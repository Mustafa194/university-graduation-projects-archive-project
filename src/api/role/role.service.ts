import { PrismaClient, Role, DocType } from "@prisma/client";

import Service from "../abstracts/Service";
import InternalServerError from "../errors/InternalServerError";
import asyncHandler from "../helpers/asyncHandler.helper";
import { RoleData } from "./role.validation";

class RoleService extends Service {
  constructor(private prisma: PrismaClient, private docType: DocType) {
    super();
  }

  // : TODO: Add filters
  // pagination: Pagination
  async findAll() {
    const [roles, error] = <[Role[], any]>(
      await asyncHandler(this.prisma.role.findMany())
    );

    if (error) throw new InternalServerError(error.message);

    return roles;
  }

  async findOneById(id: string) {
    const [role, error] = <[Role, any]>(
      await asyncHandler(this.prisma.role.findUnique({ where: { id } }))
    );

    if (error) throw new InternalServerError(error.message);

    return role;
  }

  async createOne(data: RoleData) {
    const [role, error] = <[Role, any]>(
      await asyncHandler(this.prisma.role.create({ data }))
    );

    if (error) throw new InternalServerError(error.message);

    return role;
  }

  async deleteOne(id: string) {
    const [role, error] = <[Role, any]>(
      await asyncHandler(this.prisma.role.delete({ where: { id } }))
    );

    if (error) throw new InternalServerError(error.message);

    return role;
  }
}

export default RoleService;
