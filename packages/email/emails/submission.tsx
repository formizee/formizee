'use client';
import config from '../tailwind.config';
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
    <Tailwind config={config}>
      <Html lang="en">
        <Head />
        <Preview>New form submission from {endpointSlug}</Preview>
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
              New form submission on Formizee.
            </Heading>
            <Text className="text-neutral-600 leading-[1.4] text-[15px]">
              Someone made a new submission to your form{' '}
              <Link
                href={`https://dashboard.formizee.com/${workspaceSlug}/${endpointSlug}`}
                className="text-amber-500 font-medium"
              >
                {endpointSlug}
              </Link>
              :
            </Text>
            {data ? (
              Object.entries(data).map(([key, value]) => {
                return (
                  <div
                    key={key}
                    className="flex flex-row items-center justify-between h-10 my-2 px-8 rounded-md"
                    style={{border: '1px solid #d4d4d4'}}
                  >
                    <Text className="p-0 m-0 font-medium text-neutral-950 text-ellipsis overflow-hidden whitespace-nowrap">
                      {key}
                    </Text>
                    <Text className="p-0 m-0 font-medium text-neutral-500 text-ellipsis overflow-hidden whitespace-nowrap">
                      {value}
                    </Text>
                  </div>
                );
              })
            ) : (
              <></>
            )}
            <Button
              className="flex w-48 px-3 border-neutral-300 py-2 justify-center items-center rounded-md my-8 text-neutral-700"
              href={`https://dashboard.formizee.com/${workspaceSlug}/${endpointSlug}/settings`}
              style={{border: '1px solid #d4d4d4'}}
            >
              <div className="flex gap-2">
                <span className="font-medium text-sm">
                  See On The Dashboard
                </span>
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
            <Text className="text-neutral-600 leading-[1.4] text-[15px]">
              You are receiving this because you confirmed this email address on
              Formizee.
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
