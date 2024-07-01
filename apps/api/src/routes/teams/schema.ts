import {z} from 'zod';

export const GetTeamSchema = z.object({
  teamId: z.string()
});

export const PostTeamSchema = z.object({
  name: z.string(),
  ownerId: z.string()
});

export const DeleteTeamSchema = z.object({
  teamId: z.string()
});

export const GetMembersSchema = z.object({
  teamId: z.string()
});

export const GetMemberSchema = z.object({
  teamId: z.string(),
  memberId: z.string()
});

export const PostMemberParamSchema = z.object({
  teamId: z.string()
});

export const PostMemberJsonSchema = z.object({
  userId: z.string()
});

export const PatchMemberParamSchema = z.object({
  teamId: z.string(),
  memberId: z.string()
});

export const PatchMemberJsonSchema = z.object({
  role: z.enum(['member', 'owner']).optional(),
  permissions: z.enum(['read', 'edit', 'create', 'all']).optional()
});

export const DeleteMemberSchema = z.object({
  teamId: z.string(),
  memberId: z.string()
});
