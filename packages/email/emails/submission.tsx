'use client';
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
  workspaceSlug: string;
  endpointSlug: string;
  data: object;
}

export const SubmissionEmail = ({
  workspaceSlug,
  endpointSlug,
  data
}: EmailProps) => {
  return (
    <Html lang="en">
      <Head />
      <Preview>New form submission from {endpointSlug}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Img
            src="https://avatars.githubusercontent.com/u/168822716?s=200&v=4"
            alt="Formizee."
            style={logo}
          />
          <Heading style={heading}>New form submission on Formizee.</Heading>
          <Text style={paragraphTop}>
            Someone made a new submission to your form{' '}
            <Link
              href={`https://formizee.com/${workspaceSlug}/${endpointSlug}`}
              style={endpointSpan}
            >
              {endpointSlug}
            </Link>
            :
          </Text>
          {data ? (
            Object.entries(data).map(([key, value]) => {
              return (
                <div key={key} style={{flexDirection: 'row', ...submissionRow}}>
                  <Text style={submissionKey}>{key}</Text>
                  <Text style={submissionValue}>{value}</Text>
                </div>
              );
            })
          ) : (
            <></>
          )}
          <Button
            style={button}
            href={`https://formizee.com/${workspaceSlug}/${endpointSlug}`}
          >
            <div style={{display: 'flex', gap: '6px'}}>
              <span style={buttonText}>See On The Dashboard</span>
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
            You are receiving this because you confirmed this email address on
            formizee.
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
};

SubmissionEmail.PreviewProps = {
  workspaceSlug: 'formizee',
  endpointSlug: 'my-homepage',
  data: {
    Name: 'example',
    Email: 'example@formizee.com'
  }
} as EmailProps;

export default SubmissionEmail;

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

const submissionRow = {
  paddingInline: '16px',
  marginBlock: '8px',
  height: '2.5rem',
  alignItems: 'center',
  justifyContent: 'space-between',
  border: '1px solid #d4d4d4',
  borderRadius: '6px',
  display: 'flex'
};

const submissionKey = {
  padding: '0px',
  margin: '0px',
  fontWeight: '500',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  color: '#0a0a0a',
  textOverflow: 'ellipsis'
};

const submissionValue = {
  padding: '0px',
  margin: '0px',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  color: '#737373',
  textOverflow: 'ellipsis'
};

const button = {
  width: '12rem',
  display: 'flex',
  color: '#404040',
  marginTop: '20px',
  padding: '8px 6px',
  borderRadius: '6px',
  justifyContent: 'center',
  border: '1px solid #d4d4d4'
};

const endpointSpan = {
  textDecoration: 'underline',
  fontFamily: 'monospace',
  marginInline: '2px',
  color: '#f59e0b'
};

const buttonText = {
  fontSize: '14px',
  fontWeight: '500'
};
