export type TeamPlan = 'hobby' | 'professional' | 'teams' | 'custom';

export type UserPermissions = 'read' | 'edit' | 'create' | 'all';

export type TeamRoles = 'owner' | 'member';

export interface LinkedEmail {
  email: string;
  isVerified: boolean;
}
