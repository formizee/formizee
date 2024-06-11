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
  Text,
  Button,
  Font
} from '@react-email/components';
import * as React from 'react';

interface EmailProps {
  name: string;
  email: string;
  link: string;
}

export const VerifyLinkedEmail = (props: EmailProps): React.JSX.Element => (
  <Html lang="en">
    <Head />
    <Preview>Verify Your Linked Email</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img
          src="https://avatars.githubusercontent.com/u/168822716?s=200&v=4"
          alt="Formizee Logo"
          style={logo}
        />
        <Heading style={heading}>Verify Your New Linked Email</Heading>
        <Text style={paragraphTop}>
          We noticed you're adding{' '}
          <span
            style={{
              color: '#f59e0b',
              textDecorationLine: 'underline',
              fontWeight: 500
            }}>
            {props.email}
          </span>{' '}
          to your Formizee account.
          <br />
          To finish setting this up, click in the button below.
        </Text>
        <Text style={paragraphTop}></Text>
        <Button style={button} href={props.link}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center'
            }}>
            <span style={{marginRight: 8, fontWeight: 500}}>Verify Email</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              width="20"
              height="20">
              <path
                fillRule="evenodd"
                d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </Button>
        <Text style={paragraphBottom}>
          This link will expire in 24 hours. If you don't verify your email
          within that time, just request a new link when you're ready.
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

VerifyLinkedEmail.PreviewProps = {
  name: 'pauchiner',
  email: 'pauchiner@formizee.com',
  link: 'https://formizee.com/auth/linked-emails/verify?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJGb3JtaXplZSIsImlhdCI6MTcxODEwMTkxNiwiZXhwIjoxNzQ5NjM3OTE2LCJhdWQiOiJ3d3cuZm9ybWl6ZWUuY29tIiwic3ViIjoic3VwcG9ydEBmb3JtaXplZS5jb20iLCJlbWFpbCI6InBhdWNoaW5lckBmb3JtaXplZS5jb20iLCJ0b2tlbiI6IjEyMzEyMyJ9.o6W8jGM25JtLVTDMiFXiRdxJqSUjI-sC9kZqEmD1oqM'
} as EmailProps;

export default VerifyLinkedEmail;

const logo = {
  border: '1px solid #a3a3a3',
  borderRadius: 11,
  marginTop: 20,
  width: 56,
  height: 56
};

const button = {
  fontSize: 14,
  borderRadius: 6,
  border: '1px solid #E4E4E7',
  padding: '8px 16px',
  background: '#fff',
  color: '#000'
};

const link = {
  width: '450px',
  overflow: 'hidden',
  whiteSpace: 'no-wrap',
  textOverflow: 'ellipsis'
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
