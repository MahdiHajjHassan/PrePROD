import { z } from "zod";

const fields = {
  title: z.string().trim().min(1).max(120),
  description: z.string().max(1000),
  status: z.enum(["OPEN", "DONE"]),
  priority: z.enum(["LOW", "NORMAL", "HIGH"]),
};
export const taskCreateSchema = z.object({
  ...fields, description: fields.description.default(""),
  status: fields.status.default("OPEN"), priority: fields.priority.default("NORMAL"),
}).strict();
// Use fields without defaults: omitted patch fields must retain stored values.
export const taskPatchSchema = z.object(fields).partial().strict().refine(
  (patch) => Object.values(patch).some((value) => value !== undefined),
  { message: "At least one task field is required" },
);
export const taskIdSchema = z.uuid().transform((id) => id.toLowerCase());
export const versionSchema = z.number().int().min(1).max(2147483646);
export const taskUpdateBodySchema = z.object({ ...z.object(fields).partial().shape, version: versionSchema }).strict();
export const taskDeleteBodySchema = z.object({ version: versionSchema }).strict();
export const basicTaskQuerySchema = z.object({
  page: z.literal(1).default(1), sort: z.literal("created_desc").default("created_desc"),
}).strict();
