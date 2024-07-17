import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Hr,
  Img,
  Link,
  Preview,
  Text
} from '@react-email/components';

export const waitlistUserConfirmation = () => (
  <Html lang="en">
    <Head />
    <Preview>You're on the waitlist for Formizee!</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img
          src="https://avatars.githubusercontent.com/u/168822716?s=200&v=4"
          alt="Formizee Logo"
          style={logo}
        />
        <Heading style={heading}>You're on the Waitlist!</Heading>
        <Text style={paragraphTop}>
          Thanks for your interest in Formizee. We're excited to have you join
          our growing community.
        </Text>
        <Text style={paragraphBottom}>
          You'll be among the first to know when we have news or updates. In the
          meantime, follow us on social media for a sneak peek at what's coming.
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

export default waitlistUserConfirmation;

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
