export const memberPermissions = ['read', 'edit', 'create'] as const;
export type MemberPermissions = (typeof memberPermissions)[number];
