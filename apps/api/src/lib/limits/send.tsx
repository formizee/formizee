import {PlanLimitReached, PlanLimitWarning} from '@formizee/email/templates';
import type {EmailClient} from '@formizee/email/client';
import type {Database, schema} from '@formizee/db';
import {HTTPException} from 'hono/http-exception';
import type {Limits} from '@formizee/plans';
import {render} from '@formizee/email';

interface Input {
  workspace: schema.Workspace;
  environment: string;
  limit: keyof Limits;
}
interface Services {
  database: Database;
  smtp: EmailClient;
}

export const sendPlanLimitReached = async (
  {limit, workspace, environment}: Input,
  {database, smtp}: Services
): Promise<{error: null} | {error: HTTPException}> => {
  const workspaceMember = await database.query.usersToWorkspaces.findFirst({
    where: (table, {and, eq}) =>
      and(eq(table.workspaceId, workspace.id), eq(table.role, 'owner'))
  });

  if (!workspaceMember) {
    return Promise.resolve({
      error: new HTTPException(500, {
        message: 'Workspace owner not found'
      })
    });
  }

  const workspaceOwner = await database.query.user.findFirst({
    where: (table, {eq}) => eq(table.id, workspaceMember.userId)
  });

  if (!workspaceOwner) {
    return Promise.resolve({
      error: new HTTPException(500, {
        message: 'Workspace owner not found'
      })
    });
  }

  if (environment !== 'production') {
    return Promise.resolve({error: null});
  }

  await smtp.emails.send({
    subject: "Action Required: You've reached the limits of your plan",
    replyTo: 'Formizee Support <support@formizee.com>',
    from: 'Formizee Billing <payments@formizee.com>',
    to: workspaceOwner.email,
    html: await render(
      <PlanLimitReached
        limit={limit}
        username={workspaceOwner.name}
        currentPlan={workspace.plan}
      />,
      {pretty: true}
    ),
    plainText: await render(
      <PlanLimitReached
        limit={limit}
        username={workspaceOwner.name}
        currentPlan={workspace.plan}
      />,
      {plainText: true}
    )
  });

  return Promise.resolve({error: null});
};

export const sendPlanLimitNear = async (
  {limit, workspace, environment}: Input,
  {database, smtp}: Services
): Promise<{error: null} | {error: HTTPException}> => {
  const workspaceMember = await database.query.usersToWorkspaces.findFirst({
    where: (table, {and, eq}) =>
      and(eq(table.workspaceId, workspace.id), eq(table.role, 'owner'))
  });

  if (!workspaceMember) {
    return Promise.resolve({
      error: new HTTPException(500, {
        message: 'Workspace owner not found'
      })
    });
  }

  const workspaceOwner = await database.query.user.findFirst({
    where: (table, {eq}) => eq(table.id, workspaceMember.userId)
  });

  if (!workspaceOwner) {
    return Promise.resolve({
      error: new HTTPException(500, {
        message: 'Workspace owner not found'
      })
    });
  }

  if (environment !== 'production') {
    return Promise.resolve({error: null});
  }

  await smtp.emails.send({
    subject: "You've reached the 80% monthly usage of your plan",
    replyTo: 'Formizee Support <support@formizee.com>',
    from: 'Formizee Billing <payments@formizee.com>',
    to: workspaceOwner.email,
    html: await render(
      <PlanLimitWarning
        limit={limit}
        username={workspaceOwner.name}
        currentPlan={workspace.plan}
      />,
      {pretty: true}
    ),
    plainText: await render(
      <PlanLimitWarning
        limit={limit}
        username={workspaceOwner.name}
        currentPlan={workspace.plan}
      />,
      {plainText: true}
    )
  });

  return Promise.resolve({error: null});
};
