import { Project, PrismaClient, DocType, PermissionType } from "@prisma/client";
import { Router, Request, Response, NextFunction } from "express";

import Controller from "../abstracts/Controller";
import ProjectService from "./project.service";
import validationMiddleware from "../middleware/validation.middleware";
import { ProjectSchema, Id, ProjectData, IdSchema } from "./project.validation";
import asyncHandler from "../helpers/asyncHandler.helper";
import NotFoundError from "../errors/NotFoundError";
import ConflictError from "../errors/ConflictError";
import authMiddleware from "../middleware/auth.middleware";
import permissionsMiddleware from "../middleware/permissions.middleware";

class ProjectController extends Controller {
  public routes = {
    getAll: "",
    getOne: "/:id",
    createOne: "",
    updateOne: "/:id",
    deleteOne: "/:id",
  };
  public router: Router;

  private service: ProjectService;
  private prisma: PrismaClient;

  constructor() {
    super("/projects", DocType.COLLEGE);

    this.router = Router();
    this.prisma = new PrismaClient();
    this.service = new ProjectService(this.prisma, this.docType);

    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.get(this.routes.getAll, this.getAll_route);

    this.router.get(
      this.routes.getOne,
      validationMiddleware(IdSchema),
      this.getOne_route
    );

    this.router.post(
      this.routes.createOne,
      authMiddleware,
      permissionsMiddleware(this.prisma, PermissionType.CREATE, this.docType),
      validationMiddleware(ProjectSchema),
      this.createOne_route
    );

    this.router.delete(
      this.routes.deleteOne,
      authMiddleware,
      permissionsMiddleware(this.prisma, PermissionType.DELETE, this.docType),
      validationMiddleware(IdSchema),
      this.deleteOne_route
    );

    this.router.put(
      this.routes.updateOne,
      authMiddleware,
      permissionsMiddleware(this.prisma, PermissionType.UPDATE, this.docType),
      validationMiddleware(ProjectSchema),
      this.updateOne_route
    );
  }

  /**
   * @desc        Gets all projects
   * @method      GET
   * @path        /projects
   * @access      public
   */
  private getAll_route = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const [projects, error] = <[Project[], any]>(
      await asyncHandler(this.service.findAll())
    );

    if (error) return next(error);

    response.json({
      success: true,
      projects,
    });
  };

  /**
   * @desc        Gets one project by id
   * @method      GET
   * @path        /projects
   * @access      public
   */
  private getOne_route = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const { id } = <Id>request.params;

    const [project, error] = <[Project, any]>(
      await asyncHandler(this.service.findOneProjectById(id))
    );

    if (error) return next(error);

    if (!project) {
      next(
        new NotFoundError(`There is no such a project with the id of ${id}`)
      );
      return;
    }

    response.json({
      success: true,
      project,
    });
  };

  /**
   * @desc        Creates one project
   * @method      POST
   * @path        /projects
   * @access      public
   */
  private createOne_route = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const data = <ProjectData>request.body;

    let [project, error] = <[Project, any]>(
      await asyncHandler(this.service.createOne(data))
    );

    if (error) return next(error);

    response.status(201).json({
      success: true,
      project,
    });
  };

  /**
   * @desc        Creates one project
   * @method      DELETE
   * @path        /projects/:id
   * @access      public
   */
  private deleteOne_route = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const { id } = <Id>request.params;

    let [project, error] = <[Project, any]>(
      await asyncHandler(this.service.findOneProjectById(id))
    );

    if (error) return next(error);

    if (!project)
      return next(
        new NotFoundError(`There is no such a project with the id of ${id}`)
      );

    [project, error] = <[Project, any]>(
      await asyncHandler(this.service.deleteOneProject(id))
    );

    if (error) return next(error);

    response.json({ success: true, project });
  };

  /**
   * @desc        Creates one project
   * @method      PUT
   * @path        /projects/:id
   * @access      public
   */
  private updateOne_route = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const { id } = <Id>request.params;

    let [project, error] = <[Project, any]>(
      await asyncHandler(this.service.findOneProjectById(id))
    );

    if (error) return next(error);

    if (!project)
      return next(
        new NotFoundError(`There is no such a project with the id of ${id}`)
      );

    const data = <ProjectData>request.body;

    [project, error] = <[Project, any]>(
      await asyncHandler(this.service.updateOneProject(id, data))
    );

    if (error) return next(error);

    response.json({
      project,
      success: true,
    });
  };
}

export default ProjectController;
