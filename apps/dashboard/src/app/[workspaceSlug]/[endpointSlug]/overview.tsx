import {Button, Input} from '@formizee/ui';
import {
  SettingsCard,
  SettingsCardContent,
  SettingsCardFooter,
  SettingsCardFooterLabel,
  SettingsCardLabel,
  SettingsCardTitle,
  Transition
} from '@/components';
import {LinkIcon} from '@formizee/ui/icons';
import Link from 'next/link';

export const Overview = ({endpointId}: {endpointId: string}) => {
  return (
    <Transition className="flex flex-col py-6 gap-6">
      <SettingsCard>
        <SettingsCardTitle>Endpoint ID</SettingsCardTitle>
        <SettingsCardContent>
          <SettingsCardLabel>
            Used when interacting with the Formizee API.
          </SettingsCardLabel>
          <Input disabled defaultValue={endpointId} className="max-w-96" />
        </SettingsCardContent>
        <SettingsCardFooter>
          <SettingsCardFooterLabel>
            Learn more about{' '}
            <Link
              className="text-amber-500 dark:text-amber-400"
              href="https://docs.formizee.com/concepts"
            >
              Endpoint ID
            </Link>
          </SettingsCardFooterLabel>
          <Button>
            Integrate Your Form
            <LinkIcon />
          </Button>
        </SettingsCardFooter>
      </SettingsCard>
      <div className="rounded-md border border-neutral-200 dark:border-neutral-800 h-72" />
    </Transition>
  );
};
