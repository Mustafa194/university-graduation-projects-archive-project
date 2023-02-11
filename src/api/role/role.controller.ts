import { Role, PrismaClient, DocType, PermissionType } from "@prisma/client";
import { Router, Request, Response, NextFunction } from "express";

import Controller from "../abstracts/Controller";
import RoleService from "./role.service";
import validationMiddleware from "../middleware/validation.middleware";
import { RoleSchema, Id, RoleData, IdSchema } from "./role.validation";
import asyncHandler from "../helpers/asyncHandler.helper";
import NotFoundError from "../errors/NotFoundError";
import ConflictError from "../errors/ConflictError";
import authMiddleware from "../middleware/auth.middleware";
import permissionsMiddleware from "./../middleware/permissions.middleware";

class RoleController extends Controller {
  public routes = {
    getAll: "",
    getOne: "/:id",
    createOne: "",
    deleteOne: "/:id",
  };
  public router: Router;

  private service: RoleService;
  private prisma: PrismaClient;

  constructor() {
    super("/roles", DocType.ROLE);

    this.router = Router();
    this.prisma = new PrismaClient();
    this.service = new RoleService(this.prisma, this.docType);

    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.get(
      this.routes.getAll,
      authMiddleware,
      permissionsMiddleware(this.prisma, PermissionType.READ, this.docType),
      this.getAll_route
    );

    this.router.get(
      this.routes.getOne,
      authMiddleware,
      permissionsMiddleware(this.prisma, PermissionType.READ, this.docType),
      validationMiddleware(IdSchema),
      this.getOne_route
    );

    this.router.post(
      this.routes.createOne,
      authMiddleware,
      permissionsMiddleware(this.prisma, PermissionType.CREATE, this.docType),
      validationMiddleware(RoleSchema),
      this.createOne_route
    );

    this.router.delete(
      this.routes.deleteOne,
      authMiddleware,
      permissionsMiddleware(this.prisma, PermissionType.DELETE, this.docType),
      validationMiddleware(IdSchema),
      this.deleteOne_route
    );
  }

  /**
   * @desc        Gets all roles
   * @method      GET
   * @path        /roles
   * @access      public
   */
  private getAll_route = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const [roles, error] = <[Role[], any]>(
      await asyncHandler(this.service.findAll())
    );

    if (error) return next(error);

    response.json({
      success: true,
      roles,
    });
  };

  /**
   * @desc        Gets one role by id
   * @method      GET
   * @path        /roles
   * @access      public
   */
  private getOne_route = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const { id } = <Id>request.params;

    const [role, error] = <[Role, any]>(
      await asyncHandler(this.service.findOneById(id))
    );

    if (error) return next(error);

    if (!role)
      return next(
        new NotFoundError(`There is no such a role with the id of ${id}`)
      );

    response.json({
      success: true,
      role,
    });
  };

  /**
   * @desc        Creates one role
   * @method      POST
   * @path        /roles
   * @access      public
   */
  private createOne_route = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const { userId } = <RoleData>request.body;

    let [role, error] = <[Role, any]>(
      await asyncHandler(this.service.findOneById(userId))
    );

    if (error) return next(error);

    if (role)
      return next(
        new ConflictError(`A role with the userId "${userId}" already exists`)
      );

    [role, error] = <[Role, any]>(
      await asyncHandler(this.service.createOne({ userId }))
    );

    if (error) return next(error);

    response.status(201).json({
      success: true,
      role,
    });
  };

  private deleteOne_route = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const { id } = <Id>request.params;

    let [role, error] = <[Role, any]>(
      await asyncHandler(this.service.findOneById(id))
    );

    if (error) return next(error);

    if (!role)
      return next(
        new NotFoundError(`There is no such a role with the id of ${id}`)
      );

    [role, error] = <[Role, any]>await asyncHandler(this.service.deleteOne(id));

    if (error) return next(error);

    response.json({ success: true, role });
  };
}

export default RoleController;
