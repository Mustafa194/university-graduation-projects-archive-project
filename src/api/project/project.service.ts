import { PrismaClient, Project, DocType } from "@prisma/client";

import Service from "../abstracts/Service";
import InternalServerError from "../errors/InternalServerError";
import asyncHandler from "../helpers/asyncHandler.helper";
import { ProjectData } from "./project.validation";

class ProjectService extends Service {
  constructor(private prisma: PrismaClient, private docType: DocType) {
    super();
  }

  // : TODO: Add filters
  // pagination: Pagination
  async findAll() {
    const [projects, error] = <[Project[], any]>(
      await asyncHandler(this.prisma.project.findMany())
    );

    if (error) throw new InternalServerError(error.message);

    return projects;
  }

  async findOneProjectById(id: string) {
    const [project, error] = <[Project, any]>(
      await asyncHandler(this.prisma.project.findUnique({ where: { id } }))
    );

    if (error) throw new InternalServerError(error.message);

    return project;
  }

  async findProjectByName(name: string) {
    const [project, error] = <[Project, any]>(
      await asyncHandler(
        this.prisma.project.findMany({ where: { name: { contains: name } } })
      )
    );

    if (error) throw new InternalServerError(error.message);

    return project;
  }

  async createOne(data: ProjectData) {
    const [project, error] = <[Project, any]>(
      await asyncHandler(this.prisma.project.create({ data }))
    );

    if (error) throw new InternalServerError(error.message);

    return project;
  }

  async updateOneProject(id: string, data: ProjectData) {
    const [project, error] = <[Project, any]>await asyncHandler(
      this.prisma.project.update({
        data,
        where: { id },
      })
    );

    if (error) throw new InternalServerError(error.message);

    return project;
  }

  async deleteOneProject(id: string) {
    const [project, error] = <[Project, any]>await asyncHandler(
      this.prisma.project.delete({
        where: { id },
      })
    );

    if (error) throw new InternalServerError(error.message);

    return project;
  }
}

export default ProjectService;
