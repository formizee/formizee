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

export const ExampleEmail = () => (
  <Html lang="en">
    <Head />
    <Preview>
      This is a Formizee example email, if you're receiving this, someone on our
      team probably drank too much yesterday.
    </Preview>
    <Body style={main}>
      <Container style={container}>
        <Img
          src="https://avatars.githubusercontent.com/u/168822716?s=200&v=4"
          alt="Formizee."
          style={logo}
        />
        <Heading style={heading}>Example Email from Formizee.</Heading>
        <Text style={paragraphTop}>
          This is a Formizee example email, if you're receiving this, someone on
          our team probably drank too much yesterday.
        </Text>
        <Text style={paragraphBottom}>Thanks for your time with us. ❤️</Text>
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

export default ExampleEmail;

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
