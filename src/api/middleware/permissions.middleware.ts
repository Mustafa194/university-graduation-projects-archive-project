import { Request, Response, NextFunction } from "express";
import {
  PrismaClient,
  PermissionType,
  DocType,
  Role,
  Permission,
} from "@prisma/client";

import asyncHandler from "./../helpers/asyncHandler.helper";
import { decodeToken, JWTPayload } from "./../helpers/jwt.helper";
// import UnauthorizedError from "./../errors/UnauthorizedError";
import ForbiddenError from "./../errors/ForbiddenError";

const permissionsMiddleware =
  (prisma: PrismaClient, permissionType: PermissionType, docType: DocType) =>
  async (request: Request, response: Response, next: NextFunction) => {
    const token = String(request.headers.authorization?.split(" ")[1]);

    let [{ roleId }, error] = <[JWTPayload, any]>(
      await asyncHandler(decodeToken(token))
    );

    if (error) return next(error);

    let role: Role | null;
    [role, error] = <[Role | null, any]>await asyncHandler(
      prisma.role.findUnique({
        where: { id: roleId },
        include: { Permissions: true },
      })
    );

    if (error) return next(error);

    if (!role) return next(new ForbiddenError());

    let permission: Permission;
    [permission, error] = <[Permission, any]>await asyncHandler(
      prisma.permission.findFirst({
        where: { roleId, docType, permissionType },
      })
    );

    if (!permission) return next(new ForbiddenError());

    next();
  };

export default permissionsMiddleware;
