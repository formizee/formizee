import { Body, Container, Head, Heading, Hr, Html, Img, Link, Preview, Text, } from "@react-email/components";
import * as React from "react";

interface EmailProps {
  tokenCode: string;
}

export const VerifyEmail = ({ tokenCode }: EmailProps) => (
  <Html>
    <Head />
    <Preview>Your otp code is {tokenCode}, Please do not share this code with anybody, If you didn't request this code, you can safely ignore this email.</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img
          src={`https://avatars.githubusercontent.com/u/168822716?s=200&v=4`}
          width="42"
          height="42"
          alt="Formizee."
          style={logo}
        />
        <Heading style={heading}>Account verification for Formizee.</Heading>
        <Text style={paragraphTop}>
        To complete your registration, please use the OTP code below:
        </Text>
        <code style={code}>{tokenCode}</code>
        <Text style={paragraphBottom}>
        Please do not share this code with anybody. If you didn't request 
        this code, you can safely ignore this email.
        </Text>
        <Hr style={hr} />
        <Container style={{flexDirection: 'row', ...footer}}>
          <Link href="https://formizee.com" style={reportLink}>
            Formizee Inc.
          </Link>
        </Container>
      </Container>
    </Body>
  </Html>
);

VerifyEmail.PreviewProps = {
  tokenCode: "123456",
} as EmailProps;

export default VerifyEmail;

const logo = {
  borderWidth: 4,
  borderRadius: 11,
  marginTop: 20,
  width: 42,
  height: 42,
};

const main = {
  backgroundColor: "#fafafa",
  fontFamily:
    '"Inter","Helvetica Neue",sans-serif',
};

const container = {
  margin: "10px auto",
  padding: "20px 0 48px",
  maxWidth: "560px",
};

const heading = {
  fontSize: "22px",
  letterSpacing: "-0.5px",
  lineHeight: "1.3",
  fontWeight: "500",
  color: "#262626",
  padding: "17px 0 0",
};

const paragraphTop = {
  margin: "15px 0 25px",
  fontSize: "15px",
  lineHeight: "1.4",
  color: "#525252",
};

const paragraphBottom = {
  margin: "25px 0 15px",
  fontSize: "15px",
  lineHeight: "1.4",
  color: "#525252",
};

const reportLink = {
  fontSize: "14px",
  color: "#a3a3a3",
};

const footer = {
  justifyContent: 'space-between',
  alignItems: 'center',
  display: 'flex',
}

const hr = {
  borderColor: "#d4d4d4",
  margin: "18px 0 13px",
};

const code = {
  fontWeight: "700",
  padding: "2px 8px",
  backgroundColor: "#e5e5e5",
  letterSpacing: "0.3px",
  fontSize: "26px",
  borderRadius: "4px",
  color: "#404040",
};
