import {
  type Limits,
  type WorkspacePlans,
  pricingTableConfig,
  getLimit
} from '@formizee/plans';
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
  username: string;
  limit: keyof Limits;
  currentPlan: WorkspacePlans;
}

interface UsageBreakdownProps {
  limit: keyof Limits;
  currentPlan: WorkspacePlans;
}

const UsageBreakdown = (props: UsageBreakdownProps) => {
  function getLabelForLimit(limit: keyof Limits): string | undefined {
    for (const category of Object.values(pricingTableConfig)) {
      for (const feature of category.features) {
        if (feature.value === limit) {
          return feature.label;
        }
      }
    }
    return undefined; // Return undefined if the key is not found
  }

  const limit = getLimit(props.currentPlan, props.limit);
  const label = getLabelForLimit(props.limit);

  return (
    <div
      style={{border: '1px solid #d4d4d4'}}
      className="flex flex-row justify-between items-center rounded-md mt-2 px-4 h-10"
    >
      <Text className="p-0 m-0 font-medium text-neutral-950 text-ellipsis overflow-hidden whitespace-nowrap">
        {label}
      </Text>
      <Text className="flex flex-row items-center gap-1 p-0 m-0 font-medium text-neutral-500 text-ellipsis overflow-hidden whitespace-nowrap">
        <span className="text-red-500">{limit}</span>
        <span>/</span>
        <span>{limit}</span>
      </Text>
    </div>
  );
};

export const PlanLimitReached = (props: EmailProps) => (
  <Tailwind config={config}>
    <Html lang="en">
      <Head />
      <Preview>Upgrade your billing plan for Formizee</Preview>
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
            You've reached the usage limits of the {props.currentPlan} plan
          </Heading>
          <Text className="text-neutral-600 leading-[1.4] text-[15px]">
            Hi <span className="text-neutral-950">{props.username}</span>,<br />
          </Text>
          <Text className="text-neutral-600 leading-[1.4] text-[15px]">
            You've reached the usage limits of your current {props.currentPlan}{' '}
            plan for{' '}
            <span className="font-medium text-neutral-950">{props.limit}</span>.
            To continue enjoying Formizee without interruption, consider
            upgrading.
          </Text>
          <Text>
            <span className="font-medium text-neutral-950">
              Upgrade Benefits:
            </span>
            <ul className="text-neutral-950 pl-4 m-0">
              <li>
                <span className="text-neutral-600">Unlimited endpoints</span>
              </li>
              <li>
                <span className="text-neutral-600">More submissions</span>
              </li>
              <li>
                <span className="text-neutral-600">Priority support</span>
              </li>
              <li>
                <span className="text-neutral-600">More storage</span>
              </li>
            </ul>
          </Text>
          <UsageBreakdown limit={props.limit} currentPlan={props.currentPlan} />
          <Button
            className="flex w-40 px-3 border-neutral-300 py-2 justify-center items-center rounded-md mt-4 mb-8 text-neutral-700"
            style={{border: '1px solid #d4d4d4'}}
            href="https://formizee.com/pricing"
          >
            <div className="flex gap-2">
              <span className="font-medium text-sm">See Upgrade Plans</span>
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
            Need help? Please reach out to{' '}
            <Link className="underline" href="mailto:support@formizee.com">
              support@formizee.com
            </Link>{' '}
            or just reply this email.
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

PlanLimitReached.PreviewProps = {
  username: 'pauchiner',
  currentPlan: 'hobby',
  limit: 'submissions'
} as EmailProps;

export default PlanLimitReached;
