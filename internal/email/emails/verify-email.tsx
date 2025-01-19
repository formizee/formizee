import {
  Body,
  Button,
  Container,
  Font,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Tailwind,
  Text
} from '@react-email/components';
import config from '../tailwind.config';

interface EmailProps {
  link: string;
}

export const AuthVerifyEmail = ({link}: EmailProps) => (
  <Tailwind config={config}>
    <Html lang="en">
      <Head>
        <Font
          fontFamily="Space-Grotesk"
          fallbackFontFamily="sans-serif"
          webFont={{
            url: "https://www.formizee.com/_next/static/media/2d141e1a38819612-s.p.woff2",
            format: "woff2",
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Body
        style={{fontFamily: 'Inter, System-UI, sans-serif'}}
        className="bg-white flex justify-center"
      >
        <Container className="max-w-[560px] m-2">
          <Img
            src="https://avatars.githubusercontent.com/u/168822716?s=200&v=4"
            alt="Formizee."
            className="rounded-xl mt-4 w-14 h-14"
          />

          <Heading style={{fontFamily: 'Inter, System-UI, sans-serif'}} className="text-[22px] pt-4 pb-0 font-medium text-neutral-950">
            Login Request for Formizee.
          </Heading>
          <Text className="text-neutral-600 leading-[1.4] text-[14px]">
            Click the button below to log into your workspaces
          </Text>
          <Button
            className="flex w-20 px-3 bg-neutral-900 py-2 justify-center items-center rounded-md my-8 text-neutral-700"
            href={link}
            style={{border: '2px solid #404040', color: '#fafafa'}}
          >
            <div className="flex gap-2">
              <span style={{fontFamily: 'Space-Grotesk', textWrap: 'nowrap'}} className="font-semibold text-sm">
                Sign In
              </span>
            </div>
          </Button>
          <Text className="text-neutral-600 leading-[1.4] text-[14px]">
            Please do not share this link with anybody. If you didn't request
            this link, you can safely ignore this email.
          </Text>
          <Hr className="text-neutral-300 my-5 mx-1" />
          <Container className="flex flex-row justify-between items-center">
            <Link
              href="https://formizee.com"
              className="text-sm text-neutral-400"
            >
              © {new Date().getFullYear()} Formizee. All Rights Reserved.
            </Link>
          </Container>
        </Container>
      </Body>
    </Html>
  </Tailwind>
);

AuthVerifyEmail.PreviewProps = {
  link: 'https://dashboard.formizee.com/api/auth/callback/resend?callbackUrl=https%3A%2F%2Fformizee%3A3001%2Flogin&token=02cd118467370b7d3e974bf3bfbbea16c572f823946a0fce0f154e476de48b4d&email=example@formizee.com'
} as EmailProps;

export default AuthVerifyEmail;
