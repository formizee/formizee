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
  Text
} from '@react-email/components';

interface EmailProps {
  email: string;
  link: string;
}

export const authVerifyLinkedEmail = ({email, link}: EmailProps) => (
  <Html lang="en">
    <Head />
    <Preview>Verify {email} as your new linked email for Formizee</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img
          src="https://avatars.githubusercontent.com/u/168822716?s=200&v=4"
          alt="Formizee."
          style={logo}
        />
        <Heading style={heading}>Verify Your New Linked Email</Heading>
        <Text style={paragraphTop}>
          We noticed you're adding <span style={emailSpan}>{email}</span> to
          your Formizee account. To finish setting this up, click the button
          below.
        </Text>
        <Button style={button} href={link}>
          <div style={{display: 'flex', gap: '6px'}}>
            <span style={buttonText}>Verify Email</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              width="18"
              height="18"
              fill="currentColor"
              className="size-4"
            >
              <path
                fillRule="evenodd"
                d="M2 8a.75.75 0 0 1 .75-.75h8.69L8.22 4.03a.75.75 0 0 1 1.06-1.06l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 0 1-1.06-1.06l3.22-3.22H2.75A.75.75 0 0 1 2 8Z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </Button>
        <Text style={paragraphBottom}>
          This link will expire in one hour. If you don't verify your email
          within that time, just request a new link when you're ready.
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

authVerifyLinkedEmail.PreviewProps = {
  email: 'example@formizee.com',
  link: 'https://formizee.com/auth/linked-emails/verify?token=123456'
} as EmailProps;

export default authVerifyLinkedEmail;

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

const emailSpan = {
  color: '#f59e0b',
  textDecoration: 'underline'
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

const button = {
  width: '8rem',
  display: 'flex',
  color: '#404040',
  padding: '8px 6px',
  borderRadius: '6px',
  justifyContent: 'center',
  border: '1px solid #d4d4d4'
};

const buttonText = {
  fontSize: '14px',
  fontWeight: '500'
};
