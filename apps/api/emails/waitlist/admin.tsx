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
import * as React from 'react';

interface EmailProps {
  email: string;
}

export const AdminConfirmation = ({email}: EmailProps) => (
  <Html lang="en">
    <Head />
    <Preview>{email} joined in the Formizee waitlist.</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img
          src="https://avatars.githubusercontent.com/u/168822716?s=200&v=4"
          alt="Formizee Logo"
          style={logo}
        />
        <Heading style={heading}>Waitlist Confirmation for Formizee</Heading>
        <Text style={paragraphTop}>
          A new user has joined the Formizee waitlist:
        </Text>
        <code style={code}>{email}</code>
        <Text style={paragraphBottom}>
          This is an automated notification. No further action is required.
        </Text>
        <Hr style={hr} />
        <Container style={{flexDirection: 'row', ...footer}}>
          <Link href="https://formizee.com" style={reportLink}>
            Formizee S.L.
          </Link>
        </Container>
      </Container>
    </Body>
  </Html>
);

AdminConfirmation.PreviewProps = {
  email: 'example@formizee.com'
} as EmailProps;

export default AdminConfirmation;

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

const code = {
  fontWeight: '600',
  padding: '8px 8px',
  marginTop: '28px',
  backgroundColor: '#e5e5e5',
  letterSpacing: '0.3px',
  fontSize: '16px',
  borderRadius: '4px',
  color: '#404040'
};
