import {
  Body,
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
  tokenCode: string;
}

export const AuthVerifyEmail = ({tokenCode}: EmailProps) => (
  <Tailwind config={config}>
    <Html lang="en">
      <Head />
      <Preview>
        Your verification code is {tokenCode}, Please do not share this code
        with anybody, If you didn't request this code, you can safely ignore
        this email.
      </Preview>
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

          <Heading className="text-[22px] pt-4 pb-2 font-medium text-neutral-800">
            Account verification for Formizee.
          </Heading>
          <Text className="text-neutral-600 leading-[1.4] text-[15px]">
            To complete your registration, please use the verification code
            below:
          </Text>
          <code className="font-mono font-semibold text-2xl tracking-[3px]">
            {tokenCode}
          </code>
          <Text className="text-neutral-600 leading-[1.4] text-[15px]">
            Please do not share this code with anybody. If you didn't request
            this code, you can safely ignore this email.
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
  tokenCode: '123456'
} as EmailProps;

export default AuthVerifyEmail;
