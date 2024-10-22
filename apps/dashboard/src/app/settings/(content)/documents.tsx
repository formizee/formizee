import Link from 'next/link';
import {
  SettingsCard,
  SettingsCardContent,
  SettingsCardFooter,
  SettingsCardLabel,
  SettingsCardTitle
} from '@/components';
import {Button} from '@formizee/ui';
import {LinkIcon} from '@formizee/ui/icons';
import {Transition} from '@/components';

const DocumentsSettings = () => (
  <Transition className="flex flex-col py-6 gap-6">
    <SettingsCard>
      <SettingsCardTitle>Privacy Policy</SettingsCardTitle>
      <SettingsCardContent>
        <SettingsCardLabel>
          Here is our privacy policy, if you want to check it, it’s all yours.
        </SettingsCardLabel>
      </SettingsCardContent>
      <SettingsCardFooter align="right">
        <Button asChild>
          <Link
            href="https://formizee.com/legal/privacy-policy"
            target="_blank"
            className="flex flex-row align-item gap-2"
          >
            Check It
            <LinkIcon />
          </Link>
        </Button>
      </SettingsCardFooter>
    </SettingsCard>
    <SettingsCard>
      <SettingsCardTitle>Terms Of Service</SettingsCardTitle>
      <SettingsCardContent>
        <SettingsCardLabel>
          Our terms and conditions of the software.
        </SettingsCardLabel>
      </SettingsCardContent>
      <SettingsCardFooter align="right">
        <Button>
          <Link
            href="https://formizee.com/legal/terms-of-service"
            target="_blank"
            className="flex flex-row align-item gap-2"
          >
            Check it
            <LinkIcon />
          </Link>
        </Button>
      </SettingsCardFooter>
    </SettingsCard>
  </Transition>
);

export default DocumentsSettings;
