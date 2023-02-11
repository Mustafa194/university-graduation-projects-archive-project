import { z } from "zod";

export const IdSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});

export const RoleSchema = z.object({
  body: z.object({
    userId: z.string().uuid(),
  }),
});

type Id = z.infer<typeof IdSchema>["params"];
type RoleData = z.infer<typeof RoleSchema>["body"];

export { Id, RoleData };
