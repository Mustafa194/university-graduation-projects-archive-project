import { PrismaClient, DocType, Student } from "@prisma/client";

import Service from "../abstracts/Service";
import InternalServerError from "../errors/InternalServerError";
import asyncHandler from "../helpers/asyncHandler.helper";
import { StudentData } from "./student.validation";

class StudentService extends Service {
  constructor(private prisma: PrismaClient, private docType: DocType) {
    super();
  }

  // : TODO: Add filters
  // pagination: Pagination
  async findAll() {
    const [students, error] = <[Student[], any]>(
      await asyncHandler(this.prisma.student.findMany())
    );

    if (error) throw new InternalServerError(error.message);

    return students;
  }

  async findOneById(id: string) {
    const [student, error] = <[Student, any]>await asyncHandler(
      this.prisma.student.findUnique({
        where: { id },
      })
    );

    if (error) throw new InternalServerError(error.message);

    return student;
  }

  async findByName(name: string) {
    const [student, error] = <[Student, any]>await asyncHandler(
      this.prisma.student.findMany({
        where: { Person: { fullName: { contains: name } } },
      })
    );

    if (error) throw new InternalServerError(error.message);

    return student;
  }

  async createOne(data: StudentData) {
    const [student, error] = <[Student, any]>await asyncHandler(
      this.prisma.student.create({
        data: {
          personalEmail: data.Student.personalEmail,
          Person: { create: data.Person },
          Project: { connect: { id: data.Project.projectId } },
        },
        include: { Person: true, Project: true },
      })
    );

    if (error) throw new InternalServerError(error.message);

    return student;
  }

  async updateOne(id: string, data: StudentData) {
    const [student, error] = <[Student, any]>await asyncHandler(
      this.prisma.student.update({
        data: {
          personalEmail: data.Student.personalEmail,
          Person: { update: data.Person },
          Project: { connect: { id: data.Project.projectId } },
        },
        where: { id },
        include: { Person: true, Project: true },
      })
    );

    if (error) throw new InternalServerError(error.message);

    return student;
  }

  async deleteOne(id: string) {
    const [student, error] = <[Student, any]>await asyncHandler(
      this.prisma.student.delete({
        where: { id },
        include: { Person: true, Project: true },
      })
    );

    if (error) throw new InternalServerError(error.message);

    return student;
  }
}

export default StudentService;
