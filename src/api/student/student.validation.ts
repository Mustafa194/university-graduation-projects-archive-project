import { z } from "zod";
import { Gender } from "@prisma/client";

export const IdSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});

export const StudentSchema = z.object({
  body: z.object({
    Student: z.object({
      personalEmail: z.string().email(),
    }),
    Person: z.object({
      fullName: z.string().max(50),
      dateOfBirth: z.coerce.date(),
      collegeEmail: z.string().email(),
      gender: z.enum([Gender.Male, Gender.Female]).default(Gender.Male),
      departmentId: z.string().uuid(),
    }),
    Project: z.object({
      projectId: z.string().uuid(),
    }),
  }),
});

type Id = z.infer<typeof IdSchema>["params"];
type StudentData = z.infer<typeof StudentSchema>["body"];

export { Id, StudentData };
