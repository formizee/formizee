'use client';
import {Icon} from '../components/icon';
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
  Font,
  Text
} from '@react-email/components';

interface EmailProps {
  workspaceSlug: string;
  endpointSlug: string;
  endpointName: string;
  data: object;
}

const isAttachment = (value: unknown): boolean => {
  return (
    value !== null &&
    typeof value === 'object' &&
    'url' in value &&
    'name' in value &&
    typeof value.url === 'string' &&
    typeof value.name === 'string'
  );
};

export const SubmissionEmail = ({
  workspaceSlug,
  endpointName,
  endpointSlug,
  data
}: EmailProps) => {
  return (
    <Tailwind config={config}>
      <Html lang="en">
        <Head>
          <Font
            fontFamily="Inter"
            fallbackFontFamily="sans-serif"
            webFont={{
              url: 'https://www.formizee.com/_next/static/media/a34f9d1faa5f3315-s.p.woff2',
              format: 'woff2'
            }}
            fontWeight={400}
            fontStyle="normal"
          />
          <Font
            fontFamily="Space-Grotesk"
            fallbackFontFamily="monospace"
            webFont={{
              url: 'https://www.formizee.com/_next/static/media/2d141e1a38819612-s.p.woff2',
              format: 'woff2'
            }}
            fontWeight={400}
            fontStyle="normal"
          />
        </Head>
        <Preview>New form submission from {endpointName}</Preview>
        <Body className="bg-white flex justify-center">
          <Container className="max-w-[560px] m-2">
            <Img
              src="https://avatars.githubusercontent.com/u/168822716?s=200&v=4"
              alt="Formizee."
              className="rounded-xl mt-4 w-14 h-14"
            />
            <Heading
              style={{fontFamily: 'Inter, System-UI, sans-serif'}}
              className="text-[22px] pt-4 pb-0 font-medium text-neutral-800"
            >
              New form submission on Formizee.
            </Heading>
            <Text className="text-neutral-600 leading-[1.4] text-[14px]">
              Someone made a new submission to your form{' '}
              <Link
                href={`https://dashboard.formizee.com/${workspaceSlug}/${endpointSlug}`}
                className="underline font-medium"
              >
                {endpointName}
              </Link>
            </Text>
            {data ? (
              Object.entries(data).map(([key, value]) => {
                const title = key.slice(0, 1).toUpperCase() + key.slice(1);

                return (
                  <div
                    key={key}
                    className="flex flex-row items-center justify-between bg-neutral-50 h-10 my-2 px-4 rounded-md"
                    style={{border: '2px solid #d4d4d4'}}
                  >
                    <Text className="flex items-center gap-2 p-0 m-0 font-medium text-neutral-950 text-ellipsis overflow-hidden whitespace-nowrap">
                      <Icon
                        icon={
                          isAttachment(value) ? 'attachment' : key.toLowerCase()
                        }
                        className="size-[0.9rem] text-neutral-950"
                      />
                      {title}
                    </Text>
                    {isAttachment(value) ? (
                      <Link
                        href={value.url}
                        className="p-0 m-0 text-sm underline font-medium text-neutral-500 text-ellipsis overflow-hidden whitespace-nowrap"
                      >
                        {value.name}
                      </Link>
                    ) : (
                      <Text className="p-0 m-0 font-medium text-neutral-500 text-ellipsis overflow-hidden whitespace-nowrap">
                        {value}
                      </Text>
                    )}
                  </div>
                );
              })
            ) : (
              <></>
            )}
            <Button
              className="flex w-48 px-3 bg-neutral-900 py-2 justify-center items-center rounded-md my-8 text-neutral-700"
              href={`https://dashboard.formizee.com/${workspaceSlug}/${endpointSlug}/submissions`}
              style={{border: '2px solid #404040', color: '#fafafa'}}
            >
              <div className="flex gap-2">
                <span
                  style={{fontFamily: 'Space-Grotesk', textWrap: 'nowrap'}}
                  className="font-semibold text-sm"
                >
                  See On The Dashboard
                </span>
              </div>
            </Button>
            <Text className="text-neutral-600 leading-[1.4] text-[14px]">
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
  endpointName: 'My Homepage',
  data: {
    name: 'example',
    email: 'example@mail.com',
    attachment: {
      name: 'example.md',
      url: 'https://example.md'
    }
  }
} as EmailProps;

export default SubmissionEmail;
