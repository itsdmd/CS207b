-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateEnum
CREATE TYPE "AccountType" AS ENUM ('ADMIN', 'PRINCIPAL', 'TEACHER', 'STUDENT', 'SUBSTITUTE');

-- CreateEnum
CREATE TYPE "Relationship" AS ENUM ('FATHER', 'MOTHER', 'GUARDIAN', 'SIBLING');

-- CreateEnum
CREATE TYPE "GradeLevel" AS ENUM ('PRIMARY', 'MIDDLE', 'HIGH');

-- CreateTable
CREATE TABLE "User" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "id" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "gender" "Gender" NOT NULL,
    "email" TEXT,
    "phoneNumber" TEXT,
    "address" TEXT,
    "profilePicture" TEXT,
    "accountType" "AccountType" NOT NULL,
    "classsId" TEXT,
    "schoolId" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Relative" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "relationship" "Relationship" NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "phoneNumber" TEXT,
    "email" TEXT,

    CONSTRAINT "Relative_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeacherSubjectAssignment" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "teacherId" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,

    CONSTRAINT "TeacherSubjectAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subject" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "minGradeLevel" "GradeLevel" NOT NULL DEFAULT 'PRIMARY',
    "maxGradeLevel" "GradeLevel" NOT NULL DEFAULT 'HIGH',

    CONSTRAINT "Subject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeacherClasssAssignment" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "teacherId" TEXT NOT NULL,
    "classsId" TEXT NOT NULL,

    CONSTRAINT "TeacherClasssAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentGrade" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "studentId" TEXT NOT NULL,
    "graderId" TEXT NOT NULL,
    "quarterId" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "typeId" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "StudentGrade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GradeType" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "shortName" TEXT,
    "multiplier" DOUBLE PRECISION NOT NULL,
    "schoolId" TEXT,

    CONSTRAINT "GradeType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "School" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "gradeLevels" "GradeLevel"[],

    CONSTRAINT "School_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Classs" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,

    CONSTRAINT "Classs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Quarter" (
    "id" TEXT NOT NULL DEFAULT to_char(now(), 'YYYY') || '-' || to_char(now(), 'Q'),

    CONSTRAINT "Quarter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SchoolQuarteralSchedule" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "schoolId" TEXT NOT NULL,
    "quarterId" TEXT NOT NULL,

    CONSTRAINT "SchoolQuarteralSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScheduleEntry" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "scheduleId" TEXT NOT NULL,
    "dayOfWeek" INTEGER NOT NULL,
    "timeSlot" INTEGER NOT NULL,
    "tcaId" TEXT,

    CONSTRAINT "ScheduleEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SchoolPrincipalAssignment" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "principalId" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3) DEFAULT NOW() + INTERVAL '5 year',

    CONSTRAINT "SchoolPrincipalAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Meeting" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "room" TEXT NOT NULL,
    "notes" TEXT,

    CONSTRAINT "Meeting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LoginSession" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LoginSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_MeetingToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phoneNumber_key" ON "User"("phoneNumber");

-- CreateIndex
CREATE INDEX "User_accountType_idx" ON "User"("accountType");

-- CreateIndex
CREATE UNIQUE INDEX "Relative_phoneNumber_key" ON "Relative"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Relative_email_key" ON "Relative"("email");

-- CreateIndex
CREATE INDEX "Relative_studentId_idx" ON "Relative"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "Relative_studentId_name_relationship_phoneNumber_key" ON "Relative"("studentId", "name", "relationship", "phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Relative_studentId_name_relationship_email_key" ON "Relative"("studentId", "name", "relationship", "email");

-- CreateIndex
CREATE UNIQUE INDEX "Relative_studentId_isPrimary_key" ON "Relative"("studentId", "isPrimary");

-- CreateIndex
CREATE UNIQUE INDEX "TeacherSubjectAssignment_teacherId_key" ON "TeacherSubjectAssignment"("teacherId");

-- CreateIndex
CREATE INDEX "TeacherSubjectAssignment_teacherId_idx" ON "TeacherSubjectAssignment"("teacherId");

-- CreateIndex
CREATE UNIQUE INDEX "Subject_name_key" ON "Subject"("name");

-- CreateIndex
CREATE INDEX "Subject_name_idx" ON "Subject"("name");

-- CreateIndex
CREATE INDEX "TeacherClasssAssignment_teacherId_idx" ON "TeacherClasssAssignment"("teacherId");

-- CreateIndex
CREATE INDEX "TeacherClasssAssignment_classsId_idx" ON "TeacherClasssAssignment"("classsId");

-- CreateIndex
CREATE UNIQUE INDEX "TeacherClasssAssignment_teacherId_classsId_key" ON "TeacherClasssAssignment"("teacherId", "classsId");

-- CreateIndex
CREATE INDEX "StudentGrade_studentId_idx" ON "StudentGrade"("studentId");

-- CreateIndex
CREATE INDEX "StudentGrade_studentId_quarterId_idx" ON "StudentGrade"("studentId", "quarterId");

-- CreateIndex
CREATE UNIQUE INDEX "StudentGrade_studentId_quarterId_subjectId_typeId_key" ON "StudentGrade"("studentId", "quarterId", "subjectId", "typeId");

-- CreateIndex
CREATE UNIQUE INDEX "GradeType_name_key" ON "GradeType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "GradeType_shortName_key" ON "GradeType"("shortName");

-- CreateIndex
CREATE INDEX "GradeType_name_idx" ON "GradeType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "School_address_key" ON "School"("address");

-- CreateIndex
CREATE INDEX "School_name_idx" ON "School"("name");

-- CreateIndex
CREATE UNIQUE INDEX "School_name_address_key" ON "School"("name", "address");

-- CreateIndex
CREATE INDEX "Classs_schoolId_name_idx" ON "Classs"("schoolId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Classs_schoolId_name_key" ON "Classs"("schoolId", "name");

-- CreateIndex
CREATE INDEX "SchoolQuarteralSchedule_schoolId_idx" ON "SchoolQuarteralSchedule"("schoolId");

-- CreateIndex
CREATE UNIQUE INDEX "SchoolQuarteralSchedule_schoolId_quarterId_key" ON "SchoolQuarteralSchedule"("schoolId", "quarterId");

-- CreateIndex
CREATE INDEX "ScheduleEntry_scheduleId_idx" ON "ScheduleEntry"("scheduleId");

-- CreateIndex
CREATE INDEX "ScheduleEntry_tcaId_idx" ON "ScheduleEntry"("tcaId");

-- CreateIndex
CREATE UNIQUE INDEX "ScheduleEntry_scheduleId_timeSlot_tcaId_key" ON "ScheduleEntry"("scheduleId", "timeSlot", "tcaId");

-- CreateIndex
CREATE INDEX "SchoolPrincipalAssignment_principalId_idx" ON "SchoolPrincipalAssignment"("principalId");

-- CreateIndex
CREATE INDEX "SchoolPrincipalAssignment_schoolId_idx" ON "SchoolPrincipalAssignment"("schoolId");

-- CreateIndex
CREATE UNIQUE INDEX "SchoolPrincipalAssignment_principalId_schoolId_startDate_key" ON "SchoolPrincipalAssignment"("principalId", "schoolId", "startDate");

-- CreateIndex
CREATE INDEX "Meeting_schoolId_idx" ON "Meeting"("schoolId");

-- CreateIndex
CREATE UNIQUE INDEX "Meeting_schoolId_room_startTime_key" ON "Meeting"("schoolId", "room", "startTime");

-- CreateIndex
CREATE UNIQUE INDEX "LoginSession_userId_key" ON "LoginSession"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "LoginSession_token_key" ON "LoginSession"("token");

-- CreateIndex
CREATE INDEX "LoginSession_userId_idx" ON "LoginSession"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "_MeetingToUser_AB_unique" ON "_MeetingToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_MeetingToUser_B_index" ON "_MeetingToUser"("B");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_classsId_fkey" FOREIGN KEY ("classsId") REFERENCES "Classs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Relative" ADD CONSTRAINT "Relative_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeacherSubjectAssignment" ADD CONSTRAINT "TeacherSubjectAssignment_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeacherSubjectAssignment" ADD CONSTRAINT "TeacherSubjectAssignment_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeacherClasssAssignment" ADD CONSTRAINT "TeacherClasssAssignment_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeacherClasssAssignment" ADD CONSTRAINT "TeacherClasssAssignment_classsId_fkey" FOREIGN KEY ("classsId") REFERENCES "Classs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentGrade" ADD CONSTRAINT "StudentGrade_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentGrade" ADD CONSTRAINT "StudentGrade_graderId_fkey" FOREIGN KEY ("graderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentGrade" ADD CONSTRAINT "StudentGrade_quarterId_fkey" FOREIGN KEY ("quarterId") REFERENCES "Quarter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentGrade" ADD CONSTRAINT "StudentGrade_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentGrade" ADD CONSTRAINT "StudentGrade_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "GradeType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GradeType" ADD CONSTRAINT "GradeType_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Classs" ADD CONSTRAINT "Classs_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SchoolQuarteralSchedule" ADD CONSTRAINT "SchoolQuarteralSchedule_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SchoolQuarteralSchedule" ADD CONSTRAINT "SchoolQuarteralSchedule_quarterId_fkey" FOREIGN KEY ("quarterId") REFERENCES "Quarter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduleEntry" ADD CONSTRAINT "ScheduleEntry_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "SchoolQuarteralSchedule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduleEntry" ADD CONSTRAINT "ScheduleEntry_tcaId_fkey" FOREIGN KEY ("tcaId") REFERENCES "TeacherClasssAssignment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SchoolPrincipalAssignment" ADD CONSTRAINT "SchoolPrincipalAssignment_principalId_fkey" FOREIGN KEY ("principalId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SchoolPrincipalAssignment" ADD CONSTRAINT "SchoolPrincipalAssignment_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Meeting" ADD CONSTRAINT "Meeting_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Meeting" ADD CONSTRAINT "Meeting_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoginSession" ADD CONSTRAINT "LoginSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MeetingToUser" ADD CONSTRAINT "_MeetingToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Meeting"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MeetingToUser" ADD CONSTRAINT "_MeetingToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
