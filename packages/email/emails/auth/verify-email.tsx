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
  Text
} from '@react-email/components';

interface EmailProps {
  tokenCode: string;
}

export const authVerifyEmail = ({tokenCode}: EmailProps) => (
  <Html lang="en">
    <Head />
    <Preview>
      Your otp code is {tokenCode}, Please do not share this code with anybody,
      If you didn't request this code, you can safely ignore this email.
    </Preview>
    <Body style={main}>
      <Container style={container}>
        <Img
          src="https://avatars.githubusercontent.com/u/168822716?s=200&v=4"
          alt="Formizee."
          style={logo}
        />
        <Heading style={heading}>Account verification for Formizee.</Heading>
        <Text style={paragraphTop}>
          To complete your registration, please use the OTP code below:
        </Text>
        <div style={tokenCodeBlock}>
          <code style={code}>{tokenCode.trim()}</code>
        </div>
        <Text style={paragraphBottom}>
          Please do not share this code with anybody. If you didn't request this
          code, you can safely ignore this email.
        </Text>
        <Hr style={hr} />
        <Container style={{flexDirection: 'row', ...footer}}>
          <Link href="https://formizee.com" style={reportLink}>
            © {new Date().getFullYear()} Formizee. All Rights Reserved.
          </Link>
        </Container>
      </Container>
    </Body>
  </Html>
);

authVerifyEmail.PreviewProps = {
  tokenCode: '123456'
} as EmailProps;

export default authVerifyEmail;

const logo = {
  border: '1px solid #a3a3a3',
  borderRadius: 11,
  marginTop: 20,
  width: 56,
  height: 56
};

const main = {
  backgroundColor: '#fafafa',
  fontFamily: '"Inter","Helvetica Neue",sans-serif'
};

const container = {
  margin: '10px auto',
  padding: '20px 0 48px',
  maxWidth: '560px'
};

const heading = {
  fontSize: '22px',
  letterSpacing: '-0.5px',
  lineHeight: '1.3',
  fontWeight: '500',
  color: '#262626',
  padding: '17px 0 0'
};

const paragraphTop = {
  margin: '15px 0 25px',
  fontSize: '15px',
  lineHeight: '1.4',
  color: '#525252'
};

const paragraphBottom = {
  margin: '25px 0 15px',
  fontSize: '15px',
  lineHeight: '1.4',
  color: '#525252'
};

const reportLink = {
  fontSize: '14px',
  color: '#a3a3a3'
};

const footer = {
  justifyContent: 'space-between',
  alignItems: 'center',
  display: 'flex'
};

const hr = {
  borderColor: '#d4d4d4',
  margin: '18px 0 13px'
};

const tokenCodeBlock = {
  width: '7rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: '1px solid #d4d4d4',
  borderRadius: '5px',
  color: '#404040',
  padding: '4px 10px'
};

const code = {
  fontWeight: '700',
  letterSpacing: '6px',
  fontSize: '20px'
};
