import {SettingsAccountGeneral} from './account/general';
import {SettingsWorkspaceAudit} from './workspace/audit';
import {SettingsWorkspaceBilling} from './workspace/billing';
import {SettingsWorkspaceGeneral} from './workspace/general';
import {SettingsWorkspaceKeys} from './workspace/keys';
import {SettingsWorkspaceMembers} from './workspace/members';

export const ROUTES = {
  accountsGeneral: 'account.general',
  accountsSecurity: 'account.security',

  workspaceKeys: 'workspace.keys',
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
    case 'workspace.general':
      return <SettingsWorkspaceGeneral />;
    case 'workspace.members':
      return <SettingsWorkspaceMembers workspaceSlug={props.workspaceSlug} />;
    case 'workspace.keys':
      return <SettingsWorkspaceKeys workspaceSlug={props.workspaceSlug} />;
    case 'workspace.audit':
      return <SettingsWorkspaceAudit />;
    case 'workspace.billing':
      return <SettingsWorkspaceBilling />;
  }
};
