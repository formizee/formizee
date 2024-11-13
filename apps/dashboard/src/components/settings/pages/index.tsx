import {SettingsAccountGeneral} from './account/general';
import {SettingsAccountSecurity} from './account/security';
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
  currentRoute: Route;
}

export const Content = (props: Props) => {
  switch (props.currentRoute) {
    case 'account.general':
      return <SettingsAccountGeneral />;
    case 'account.security':
      return <SettingsAccountSecurity />;
    case 'workspace.general':
      return <SettingsWorkspaceGeneral />;
    case 'workspace.members':
      return <SettingsWorkspaceMembers />;
    case 'workspace.keys':
      return <SettingsWorkspaceKeys />;
    case 'workspace.audit':
      return <SettingsWorkspaceAudit />;
    case 'workspace.billing':
      return <SettingsWorkspaceBilling />;
  }
};
