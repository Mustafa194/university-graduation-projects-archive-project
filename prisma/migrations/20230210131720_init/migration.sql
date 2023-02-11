-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('Male', 'Female');

-- CreateEnum
CREATE TYPE "PermissionType" AS ENUM ('CREATE', 'READ', 'UPDATE', 'DELETE');

-- CreateEnum
CREATE TYPE "DocType" AS ENUM ('COLLEGE', 'DEPARTMENT', 'USER', 'STUDENT', 'SUPERVISOR', 'PROJECT', 'ROLE', 'PERMISSION');

-- CreateTable
CREATE TABLE "colleges" (
    "id" UUID NOT NULL,
    "name" VARCHAR(35) NOT NULL,
    "website_link" VARCHAR(250) NOT NULL,

    CONSTRAINT "colleges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "departments" (
    "id" UUID NOT NULL,
    "name" VARCHAR(45) NOT NULL,
    "college_id" UUID NOT NULL,

    CONSTRAINT "departments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "people" (
    "id" UUID NOT NULL,
    "full_name" VARCHAR(50) NOT NULL,
    "date_of_birth" DATE NOT NULL,
    "college_email" VARCHAR(255) NOT NULL,
    "gender" "Gender" NOT NULL DEFAULT 'Male',
    "department_id" UUID NOT NULL,

    CONSTRAINT "people_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "username" VARCHAR(30) NOT NULL,
    "password" CHAR(97) NOT NULL,
    "token" VARCHAR(255) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "date_created" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "date_updated" DATE NOT NULL,
    "person_id" UUID NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permissions" (
    "id" UUID NOT NULL,
    "roleId" UUID NOT NULL,
    "permission_type" "PermissionType" NOT NULL DEFAULT 'READ',
    "doc_type" "DocType" NOT NULL DEFAULT 'COLLEGE',

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "supervisors" (
    "id" UUID NOT NULL,
    "person_id" UUID NOT NULL,

    CONSTRAINT "supervisors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project" (
    "id" UUID NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "rate" DOUBLE PRECISION NOT NULL,
    "year" INTEGER NOT NULL,
    "department_id" UUID NOT NULL,
    "supervisor_id" UUID NOT NULL,

    CONSTRAINT "project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projects_documents" (
    "id" UUID NOT NULL,
    "name" VARCHAR(36) NOT NULL,
    "type" VARCHAR(10) NOT NULL,
    "path" UUID NOT NULL,
    "date_created" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "date_updated" DATE NOT NULL,
    "project_id" UUID NOT NULL,

    CONSTRAINT "projects_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "students" (
    "id" UUID NOT NULL,
    "personal_email" VARCHAR(255) NOT NULL,
    "person_id" UUID NOT NULL,
    "project_id" UUID NOT NULL,

    CONSTRAINT "students_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "colleges_name_key" ON "colleges"("name");

-- CreateIndex
CREATE UNIQUE INDEX "colleges_website_link_key" ON "colleges"("website_link");

-- CreateIndex
CREATE UNIQUE INDEX "people_college_email_key" ON "people"("college_email");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_person_id_key" ON "users"("person_id");

-- CreateIndex
CREATE UNIQUE INDEX "Role_user_id_key" ON "Role"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "permissions_roleId_permission_type_doc_type_key" ON "permissions"("roleId", "permission_type", "doc_type");

-- CreateIndex
CREATE UNIQUE INDEX "supervisors_person_id_key" ON "supervisors"("person_id");

-- CreateIndex
CREATE UNIQUE INDEX "project_department_id_key" ON "project"("department_id");

-- CreateIndex
CREATE UNIQUE INDEX "projects_documents_path_key" ON "projects_documents"("path");

-- CreateIndex
CREATE UNIQUE INDEX "students_person_id_key" ON "students"("person_id");

-- AddForeignKey
ALTER TABLE "departments" ADD CONSTRAINT "departments_college_id_fkey" FOREIGN KEY ("college_id") REFERENCES "colleges"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "people" ADD CONSTRAINT "people_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "people"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Role" ADD CONSTRAINT "Role_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permissions" ADD CONSTRAINT "permissions_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "supervisors" ADD CONSTRAINT "supervisors_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "people"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project" ADD CONSTRAINT "project_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project" ADD CONSTRAINT "project_supervisor_id_fkey" FOREIGN KEY ("supervisor_id") REFERENCES "supervisors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects_documents" ADD CONSTRAINT "projects_documents_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "people"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
