import {Name, Email, Password} from 'domain/models/values';
import {DrizzleD1Database, drizzle} from 'drizzle-orm/d1';
import {Mail, Response, User} from 'domain/models';
import {AuthService} from 'domain/services';
import {SecretsProvider} from '@/lib/secrets';
import {SaveUser} from '@/useCases/users';

import {parseLinkedEmails, parseLinkedForms} from '@/lib/adapters';
import {randomInt} from 'node:crypto';
import {compare, hash} from 'bcryptjs';
import {authTokens, users} from '../models/schema';
import {eq} from 'drizzle-orm';
import { MailSend } from '@/useCases/mail';

export class AuthServiceImplementation implements AuthService {
  private readonly db: DrizzleD1Database;

  constructor() {
    const provider = SecretsProvider.getInstance();
    this.db = drizzle(provider.getDb());
  }

  async login(email: Email, password: string): Promise<Response<User>> {
    const response = await this.db
      .select()
      .from(users)
      .where(eq(users.email, email.value));
    if (!response[0]) return Response.error('Invalid email or password.', 401);

    const authenticate = await compare(response[0].password, password);
    if (!authenticate) return Response.error('Invalid email or password.', 401);

    const linkedForms = await parseLinkedForms(response[0].forms);
    const linkedEmails = await parseLinkedEmails(response[0].linkedEmails);

    const user = new User(
      response[0].id,
      response[0].name,
      response[0].email,
      linkedForms,
      linkedEmails
    );

    return Response.success(user);
  }

  async register(
    name: Name,
    email: Email,
    password: Password
  ): Promise<Response<User>> {
    const hashedPassword = await hash(password.value, 13);

    const service = new SaveUser(name.value, email.value, hashedPassword);
    return await service.run();
  }

  async verifyUser(email: Email, token: string): Promise<Response<User>> {
    // 1. Find the token
    const tokenResponse = await this.db.select().from(authTokens).where(eq(authTokens.email, email.value));
    if(!tokenResponse[0]) return Response.error("Invalid token.", 401);

    // 2. Check if is expired.
    const currentTime = new Date();
    const expireTime = new Date(tokenResponse[0].expiresAt);
    if(currentTime > expireTime) {
      await this.db.delete(authTokens).where(eq(authTokens.email, email.value));
      return Response.error("Expired token, please get a new one.", 401);
    }

    // 3. Compare tokens.
    if(tokenResponse[0].token.toString() !== token) return Response.error("Invalid token.", 401);

    // 4. Verify user
    const response = await this.db.update(users).set({verified: true}).where(eq(users.email, email.value)).returning();
    if(!response[0]) return Response.error("The user does not exists.", 404);

    // 5. Delete the token
    await this.db.delete(authTokens).where(eq(authTokens.email, email.value));

    // 6. Retrieve user

    const linkedForms = await parseLinkedForms(response[0].forms);
    const linkedEmails = await parseLinkedEmails(response[0].linkedEmails);

    const user = new User(
      response[0].id,
      response[0].name,
      response[0].email,
      linkedForms,
      linkedEmails
    );

    return Response.success(user);
  }

  async sendVerification(email: Email): Promise<Response<true>> {
    const sendEmail = async (to: string, token: string) => {
      const mail = new Mail(
        "Formizee.",
        "noreply@formizee.com",
        to,
        "Email Verification",
        `<table align=center border=0 cellpadding=0 cellspacing=0 role=presentation width=600><tr><td style="padding:40px 0;text-align:center"><svg fill=none height=96 viewBox="0 0 158 158"width=96 xmlns=http://www.w3.org/2000/svg><g filter=url(#filter0_d_101_1742)><rect height=128 width=128 x=15 y=11 fill=black rx=13 shape-rendering=crispEdges /><rect height=127 width=127 x=15.5 y=11.5 rx=12.5 shape-rendering=crispEdges stroke=#3C3C3C /><mask fill=black height=50 id=path-3-outside-1_101_1742 maskUnits=userSpaceOnUse width=46 x=61 y=51><rect height=50 width=46 x=61 y=51 fill=white /><path d="M62.6134 99V52.4545H92.4316V59.5227H71.0452V72.1591H90.3861V79.2273H71.0452V99H62.6134ZM100.71 99.5C99.3317 99.5 98.1498 99.0152 97.165 98.0455C96.1802 97.0758 95.6953 95.8939 95.7105 94.5C95.6953 93.1364 96.1802 91.9697 97.165 91C98.1498 90.0303 99.3317 89.5455 100.71 89.5455C102.044 89.5455 103.203 90.0303 104.188 91C105.188 91.9697 105.695 93.1364 105.71 94.5C105.695 95.4242 105.453 96.2652 104.983 97.0227C104.529 97.7803 103.923 98.3864 103.165 98.8409C102.423 99.2803 101.604 99.5 100.71 99.5Z"/></mask><path d="M62.6134 99V52.4545H92.4316V59.5227H71.0452V72.1591H90.3861V79.2273H71.0452V99H62.6134ZM100.71 99.5C99.3317 99.5 98.1498 99.0152 97.165 98.0455C96.1802 97.0758 95.6953 95.8939 95.7105 94.5C95.6953 93.1364 96.1802 91.9697 97.165 91C98.1498 90.0303 99.3317 89.5455 100.71 89.5455C102.044 89.5455 103.203 90.0303 104.188 91C105.188 91.9697 105.695 93.1364 105.71 94.5C105.695 95.4242 105.453 96.2652 104.983 97.0227C104.529 97.7803 103.923 98.3864 103.165 98.8409C102.423 99.2803 101.604 99.5 100.71 99.5Z"fill=url(#paint0_linear_101_1742) /><path d="M62.6134 99H61.8134V99.8H62.6134V99ZM62.6134 52.4545V51.6545H61.8134V52.4545H62.6134ZM92.4316 52.4545H93.2316V51.6545H92.4316V52.4545ZM92.4316 59.5227V60.3227H93.2316V59.5227H92.4316ZM71.0452 59.5227V58.7227H70.2452V59.5227H71.0452ZM71.0452 72.1591H70.2452V72.9591H71.0452V72.1591ZM90.3861 72.1591H91.1861V71.3591H90.3861V72.1591ZM90.3861 79.2273V80.0273H91.1861V79.2273H90.3861ZM71.0452 79.2273V78.4273H70.2452V79.2273H71.0452ZM71.0452 99V99.8H71.8452V99H71.0452ZM63.4134 99V52.4545H61.8134V99H63.4134ZM62.6134 53.2545H92.4316V51.6545H62.6134V53.2545ZM91.6316 52.4545V59.5227H93.2316V52.4545H91.6316ZM92.4316 58.7227H71.0452V60.3227H92.4316V58.7227ZM70.2452 59.5227V72.1591H71.8452V59.5227H70.2452ZM71.0452 72.9591H90.3861V71.3591H71.0452V72.9591ZM89.5861 72.1591V79.2273H91.1861V72.1591H89.5861ZM90.3861 78.4273H71.0452V80.0273H90.3861V78.4273ZM70.2452 79.2273V99H71.8452V79.2273H70.2452ZM71.0452 98.2H62.6134V99.8H71.0452V98.2ZM97.165 98.0455L96.6037 98.6155L97.165 98.0455ZM95.7105 94.5L96.5104 94.5087L96.5105 94.4999L96.5104 94.4911L95.7105 94.5ZM97.165 91L97.7263 91.5701L97.165 91ZM104.188 91L103.626 91.5701L103.631 91.5743L104.188 91ZM105.71 94.5L106.51 94.5131L106.511 94.5021L106.51 94.4911L105.71 94.5ZM104.983 97.0227L104.303 96.6011L104.297 96.6111L104.983 97.0227ZM103.165 98.8409L103.572 99.5294L103.577 99.5269L103.165 98.8409ZM100.71 98.7C99.5423 98.7 98.5619 98.2981 97.7263 97.4754L96.6037 98.6155C97.7378 99.7322 99.1211 100.3 100.71 100.3V98.7ZM97.7263 97.4754C96.8978 96.6597 96.4976 95.6874 96.5104 94.5087L94.9105 94.4913C94.893 96.1005 95.4625 97.4918 96.6037 98.6155L97.7263 97.4754ZM96.5104 94.4911C96.4977 93.3482 96.894 92.3895 97.7263 91.5701L96.6037 90.4299C95.4663 91.5499 94.8929 92.9246 94.9105 94.5089L96.5104 94.4911ZM97.7263 91.5701C98.5619 90.7473 99.5423 90.3455 100.71 90.3455V88.7455C99.1211 88.7455 97.7378 89.3133 96.6037 90.4299L97.7263 91.5701ZM100.71 90.3455C101.825 90.3455 102.785 90.7417 103.626 91.5701L104.749 90.4299C103.621 89.3189 102.262 88.7455 100.71 88.7455V90.3455ZM103.631 91.5743C104.481 92.3991 104.898 93.3637 104.911 94.5089L106.51 94.4911C106.493 92.909 105.894 91.5403 104.745 90.4257L103.631 91.5743ZM104.911 94.4869C104.898 95.2722 104.694 95.9711 104.303 96.6012L105.663 97.4443C106.212 96.5592 106.493 95.5762 106.51 94.5131L104.911 94.4869ZM104.297 96.6111C103.91 97.2561 103.398 97.7679 102.753 98.1549L103.577 99.5269C104.447 99.0048 105.147 98.3045 105.669 97.4343L104.297 96.6111ZM102.758 98.1524C102.143 98.5161 101.466 98.7 100.71 98.7V100.3C101.742 100.3 102.702 100.044 103.572 99.5294L102.758 98.1524Z"fill=white mask=url(#path-3-outside-1_101_1742) /></g><defs><filter color-interpolation-filters=sRGB filterUnits=userSpaceOnUse height=157.8 id=filter0_d_101_1742 width=157.8 x=0.1 y=0.1><feFlood flood-opacity=0 result=BackgroundImageFix /><feColorMatrix type=matrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"in=SourceAlpha result=hardAlpha /><feOffset dy=4 /><feGaussianBlur stdDeviation=7.45 /><feComposite in2=hardAlpha operator=out /><feColorMatrix type=matrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.11 0"/><feBlend in2=BackgroundImageFix mode=normal result=effect1_dropShadow_101_1742 /><feBlend in2=effect1_dropShadow_101_1742 mode=normal result=shape in=SourceGraphic /></filter><linearGradient gradientUnits=userSpaceOnUse id=paint0_linear_101_1742 x1=84 x2=84 y1=37 y2=114><stop stop-color=white /><stop stop-color=#737373 offset=1 /></linearGradient></defs></svg><tr><td style="padding:0 0"><h2 style=text-align:center;margin-bottom:20px>Welcome to Formizee</h2><p style=text-align:center>To complete your registration, please use the OTP code below:<div style="display:flex;justify-content:center;text-align:center;font-size:24px;padding:20px 0"><code><strong>${token}</strong></code></div><p style=text-align:center>Please do not share this code with anybody. If you didn't request this code, you can safely ignore this email.</table><style>body{background:#000;display:flex;align-items:center;justify-content:center;flex-direction:column}code{display:flex;align-items:center;justify-content:center;background:#222;border-radius:.3rem;padding-block:.25rem;padding-inline:.5rem;letter-spacing:5px}h2,p,strong{font-family:monospace;color:#fff}</style>`
      );

      const service = new MailSend(mail);
      await service.run();
    }

    // 0. Check if the user exists.
    const userResponse = await this.db.select().from(users).where(eq(users.email, email.value));
    if(!userResponse[0]) return Response.error("The user does not exists.", 404);

    // 1. Check if already exists a token and resend the email, otherwise delete the old token.
    const existentToken = await this.db.select().from(authTokens).where(eq(authTokens.email, email.value));

    if(existentToken[0]) {
      const expiresAt = new Date(existentToken[0].expiresAt);
      const currentTime = new Date();

      if(currentTime < expiresAt) {
        sendEmail(existentToken[0].email, existentToken[0].token.toString());
        return Response.success(true, 200);
      }
      else await this.db.delete(authTokens).where(eq(authTokens.email, email.value));
    }
    
    // 2. Generate a token
    const token = Math.floor(randomInt(100000, 999999 + 1));


    // 3. Generate expires date
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10); 

    // 3. Store in auth_tokens db 
    const dbResponse = await this.db.insert(authTokens).values({
      expiresAt: expiresAt.toISOString(),
      email: email.value,
      token,
    }).returning();

    if(!dbResponse[0]) Response.error("Internal error.", 500)

    // 4. Send email
    await sendEmail(email.value, token.toString());
    return Response.success(true, 202);
  }

}
