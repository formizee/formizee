'use server';

import {database, eq, schema} from '@/lib/db';
import {auth, signOut} from '@/lib/auth';
import {env} from '@/lib/enviroment';

export const deleteUserAccount = async () => {
  const session = await auth();

  const user = await database.query.user.findFirst({
    where: (table, {eq}) => eq(table.id, session?.user?.id ?? '')
  });

  if (!user) {
    return;
  }

  // Get all the user workspaces
  const workspaces = await database.query.usersToWorkspaces.findMany({
    where: (table, {and, eq}) =>
      and(eq(table.userId, user.id), eq(table.role, 'owner'))
  });

  // Delete each endpoint of each workspace
  for (const workspace of workspaces) {
    const endpoints = await database.query.endpoint.findMany({
      where: (table, {eq}) => eq(table.workspaceId, workspace.workspaceId)
    });

    for (const endpoint of endpoints) {
      // Delete vault data
      await fetch(`https://vault.formizee.com/v1/endpoint/${endpoint.id}`, {
        headers: {Authorization: env().VAULT_SECRET},
        method: 'DELETE'
      });
    }
  }

  // Delete Workspaces
  for (const workspace of workspaces) {
    await database
      .delete(schema.workspace)
      .where(eq(schema.workspace.id, workspace.workspaceId));
  }

  // Delete User
  await database.delete(schema.user).where(eq(schema.user.id, user.id));

  // Redirect to login
  await signOut({
    redirectTo: '/login',
    redirect: true
  });
};
