'use client';

import {
  CreditCardIcon,
  KeyIcon,
  LockIcon,
  SettingsIcon,
  UserGroupIcon
} from '@formizee/ui/icons';
import {Button} from '@formizee/ui';
import {usePathname, useRouter} from 'next/navigation';
import {useEffect, useState} from 'react';

type Tabs = 'general' | 'members' | 'billing' | 'keys' | 'audit';

interface TabItemProps {
  type: Tabs;
  children: React.ReactNode;
}

interface Props {
  workspaceSlug: string;
}

const getCurrentTab = (path: string) => {
  const paths = path.split('/');

  switch (paths[paths.length - 1]) {
    case 'members':
      return 'members';
    case 'billing':
      return 'billing';
    case 'keys':
      return 'keys';
    case 'audit':
      return 'audit';
    default:
      return 'general';
  }
};

export const SettingsTabs = ({workspaceSlug}: Props) => {
  const currentPath = usePathname();
  const [currentTab, setCurrentTab] = useState<Tabs>(
    getCurrentTab(currentPath)
  );

  useEffect(() => {
    setCurrentTab(getCurrentTab(currentPath));
  }, [currentPath, setCurrentTab]);

  const TabItem = (props: TabItemProps) => {
    const router = useRouter();

    const onClick = () => {
      router.push(
        `/${workspaceSlug}/settings/${props.type !== 'general' ? props.type : ''}`
      );
      setCurrentTab(props.type);
    };

    return (
      <Button
        onClick={onClick}
        variant={currentTab === props.type ? 'outline' : 'ghost'}
      >
        {props.children}
      </Button>
    );
  };

  return (
    <div className="flex flex-row mt-8 items-center gap-2">
      <TabItem type="general">
        <SettingsIcon />
        General
      </TabItem>
      <TabItem type="members">
        <UserGroupIcon />
        Members
      </TabItem>
      <TabItem type="billing">
        <CreditCardIcon />
        Billing
      </TabItem>
      <TabItem type="keys">
        <KeyIcon />
        API Keys
      </TabItem>
      <TabItem type="audit">
        <LockIcon />
        Audit Logs
      </TabItem>
    </div>
  );
};

export default SettingsTabs;
