import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Tailwind,
  Text
} from '@react-email/components';
import config from '../tailwind.config';

interface EmailProps {
  email: string;
  link: string;
}

export const AuthVerifyLinkedEmail = ({email, link}: EmailProps) => (
  <Tailwind config={config}>
    <Html lang="en">
      <Head />
      <Preview>Verify {email} as your new linked email for Formizee</Preview>
      <Body
        style={{fontFamily: 'Inter, System-UI, sans-serif'}}
        className="bg-neutral-50 flex justify-center"
      >
        <Container className="max-w-[560px] m-2">
          <Img
            src="https://avatars.githubusercontent.com/u/168822716?s=200&v=4"
            alt="Formizee."
            className="rounded-xl mt-4 w-14 h-14"
          />
          <Heading style={{fontFamily: 'Inter, System-UI, sans-serif'}} className="text-[22px] pt-4 pb-0 font-medium text-neutral-800">
            Verify your new linked email
          </Heading>
          <Text className="text-neutral-600 leading-[1.4] text-[14px]">
            We noticed you're adding{' '}
            <Link href={`mailto:${email}`} className="underline">
              {email}
            </Link>{' '}
            to your Formizee account. To finish setting this up, click the
            button below.
          </Text>
          <Button
            className="flex w-24 px-3 bg-neutral-900 py-2 justify-center items-center rounded-md my-8 text-neutral-700"
            href={link}
            style={{border: '2px solid #404040', color: '#fafafa'}}
          >
            <div className="flex gap-2">
              <span style={{textWrap: 'nowrap'}} className="font-semibold text-sm">
                Verify Email
              </span>
            </div>
          </Button>
          <Text className="text-neutral-600 leading-[1.4] text-[14px]">
            This link will expire in one hour. If you don't verify your email
            within that time, just request a new link when you're ready.
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

AuthVerifyLinkedEmail.PreviewProps = {
  email: 'example@formizee.com',
  link: 'https://dashboard.formizee.com/auth/linked-emails/verify?token=123456'
} as EmailProps;

export default AuthVerifyLinkedEmail;
