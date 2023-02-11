import { z } from "zod";

export const IdSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});

export const ProjectSchema = z.object({
  body: z.object({
    name: z.string(),
    rate: z.number().int().positive().min(0).max(100),
    year: z.number().int().positive().max(new Date().getFullYear()),
    departmentId: z.string().uuid(),
    supervisorId: z.string().uuid(),
    // Documents: z
    //   .array(
    //     z.object({
    //       name: z.string(),
    //       type: z.string(),
    //     })
    //   )
    //   .optional(),
  }),
});

type Id = z.infer<typeof IdSchema>["params"];
type ProjectData = z.infer<typeof ProjectSchema>["body"];

export { Id, ProjectData };
