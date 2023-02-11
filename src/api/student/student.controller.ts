import { Student, PrismaClient, DocType, PermissionType } from "@prisma/client";
import { Router, Request, Response, NextFunction } from "express";

import Controller from "../abstracts/Controller";
import StudentService from "./student.service";
import validationMiddleware from "../middleware/validation.middleware";
import { StudentSchema, Id, StudentData, IdSchema } from "./student.validation";
import asyncHandler from "../helpers/asyncHandler.helper";
import NotFoundError from "../errors/NotFoundError";
import authMiddleware from "../middleware/auth.middleware";
import permissionsMiddleware from "../middleware/permissions.middleware";

class StudentController extends Controller {
  public routes = {
    getAll: "",
    getOne: "/:id",
    createOne: "",
    updateOne: "/:id",
    deleteOne: "/:id",
  };
  public router: Router;

  private service: StudentService;
  private prisma: PrismaClient;

  constructor() {
    super("/students", DocType.COLLEGE);

    this.router = Router();
    this.prisma = new PrismaClient();
    this.service = new StudentService(this.prisma, this.docType);

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
      validationMiddleware(StudentSchema),
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
      validationMiddleware(StudentSchema),
      this.updateOne_route
    );
  }

  /**
   * @desc        Gets all students
   * @method      GET
   * @path        /students
   * @access      public
   */
  private getAll_route = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const [students, error] = <[Student[], any]>(
      await asyncHandler(this.service.findAll())
    );

    if (error) return next(error);

    response.json({
      success: true,
      students,
    });
  };

  /**
   * @desc        Gets one student by id
   * @method      GET
   * @path        /students
   * @access      public
   */
  private getOne_route = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const { id } = <Id>request.params;

    const [student, error] = <[Student, any]>(
      await asyncHandler(this.service.findOneById(id))
    );

    if (error) return next(error);

    if (!student) {
      next(
        new NotFoundError(`There is no such a student with the id of ${id}`)
      );
      return;
    }

    response.json({
      success: true,
      student,
    });
  };

  /**
   * @desc        Creates one student
   * @method      POST
   * @path        /students
   * @access      public
   */
  private createOne_route = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const data = <StudentData>request.body;

    const [student, error] = <[Student, any]>(
      await asyncHandler(this.service.createOne(data))
    );

    if (error) return next(error);

    response.status(201).json({
      success: true,
      student,
    });
  };

  /**
   * @desc        Creates one student
   * @method      DELETE
   * @path        /students/:id
   * @access      public
   */
  private deleteOne_route = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const { id } = <Id>request.params;

    let [student, error] = <[Student, any]>(
      await asyncHandler(this.service.findOneById(id))
    );

    if (error) return next(error);

    if (!student)
      return next(
        new NotFoundError(`There is no such a student with the id of ${id}`)
      );

    [student, error] = <[Student, any]>(
      await asyncHandler(this.service.deleteOne(id))
    );

    if (error) return next(error);

    response.json({ success: true, student });
  };

  /**
   * @desc        Creates one student
   * @method      PUT
   * @path        /students/:id
   * @access      public
   */
  private updateOne_route = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const { id } = <Id>request.params;

    let [student, error] = <[Student, any]>(
      await asyncHandler(this.service.findOneById(id))
    );

    if (error) return next(error);

    if (!student)
      return next(
        new NotFoundError(`There is no such a student with the id of ${id}`)
      );

    const data = <StudentData>request.body;

    [student, error] = <[Student, any]>(
      await asyncHandler(this.service.updateOne(id, data))
    );

    if (error) return next(error);

    response.json({
      student,
      success: true,
    });
  };
}

export default StudentController;
