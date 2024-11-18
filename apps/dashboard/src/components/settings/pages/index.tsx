import {SettingsWorkspaceBilling} from './workspace/billing';
import {SettingsWorkspaceGeneral} from './workspace/general';
import {SettingsWorkspaceMembers} from './workspace/members';
import {SettingsWorkspaceAudit} from './workspace/audit';
import {SettingsWorkspacePlans} from './workspace/plans';
import {SettingsWorkspaceKeys} from './workspace/keys';
import {SettingsAccountGeneral} from './account/general';
import {SettingsAccountInfo} from './account/about';

export const ROUTES = {
  accountGeneral: 'account.general',
  accountInfo: 'account.info',

  workspaceKeys: 'workspace.keys',
  workspacePlans: 'workspace.plans',
  workspaceAudit: 'workspace.audit',
  workspaceBilling: 'workspace.billing',
  workspaceMembers: 'workspace.members',
  workspaceGeneral: 'workspace.general'
} as const;

export type Route = (typeof ROUTES)[keyof typeof ROUTES];

interface Props {
  workspaceSlug: string;
  currentRoute: Route;
  userId: string;
}

export const Content = (props: Props) => {
  return (
    <div className="flex w-full px-6 pt-12 py-4">
      <Pages {...props} />
    </div>
  );
};

export const Pages = (props: Props) => {
  switch (props.currentRoute) {
    case 'account.general':
      return <SettingsAccountGeneral userId={props.userId} />;
    case 'account.info':
      return <SettingsAccountInfo />;
    case 'workspace.general':
      return <SettingsWorkspaceGeneral workspaceSlug={props.workspaceSlug} />;
    case 'workspace.members':
      return <SettingsWorkspaceMembers workspaceSlug={props.workspaceSlug} />;
    case 'workspace.keys':
      return <SettingsWorkspaceKeys workspaceSlug={props.workspaceSlug} />;
    case 'workspace.audit':
      return <SettingsWorkspaceAudit workspaceSlug={props.workspaceSlug} />;
    case 'workspace.billing':
      return <SettingsWorkspaceBilling workspaceSlug={props.workspaceSlug} />;
    case 'workspace.plans':
      return <SettingsWorkspacePlans workspaceSlug={props.workspaceSlug} />;
  }
};
