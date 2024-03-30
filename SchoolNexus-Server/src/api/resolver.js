import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

import * as pint from "../models/prisma-interface.js";
import * as loginSession from "../models/loginSession.js";
import { generateHashedPassword } from "../functions/password.js";

export const resolvers = {
    Query: {
        async getUser(_, args) {
            const conditions = [];

            if (args.id && args.id != "undefined")
                conditions.push({ id: { contains: args.id } });
            if (args.fullName && args.fullName != "undefined")
                conditions.push({ fullName: { contains: args.fullName } });
            if (args.dateOfBirth && args.dateOfBirth != "undefined") {
                const dateObj = new Date(args.dateOfBirth);
                conditions.push({
                    dateOfBirth: { equals: dateObj },
                });
            }
            if (args.gender && args.gender != "undefined")
                conditions.push({ gender: { equals: args.gender } });
            if (args.email != "undefined")
                conditions.push({
                    email: { contains: args.email },
                });
            if (args.phoneNumber && args.phoneNumber != "undefined")
                conditions.push({
                    phoneNumber: { contains: args.phoneNumber },
                });
            if (args.address && args.address != "undefined")
                conditions.push({
                    address: { contains: args.address },
                });
            if (args.profilePicture && args.profilePicture != "undefined")
                conditions.push({
                    profilePicture: { equals: args.profilePicture },
                });
            if (args.accountType && args.accountType != "undefined")
                conditions.push({
                    accountType: { equals: args.accountType },
                });

            const result = await prisma.user.findMany({
                where: { AND: conditions },
                include: { usa: true, uca: true, tsa: true },
            });

            for (let i = 0; i < result.length; i++) {
                result[i].dateOfBirth = result[i].dateOfBirth.toISOString();
            }

            console.log("getUser:", result);
            return result;
        },

        async newUser(_, args) {
            const hashedPassword = generateHashedPassword(args.password);

            const existingUser = await prisma.user.findFirst({
                where: { id: args.id },
            });
            let result = null;
            if (existingUser) {
                result = await prisma.user.update({
                    where: { id: args.id },
                    data: {
                        password: hashedPassword,
                        fullName: args.fullName,
                        // dateOfBirth: args.dateOfBirth,
                        gender: args.gender,
                        email: args.email,
                        phoneNumber: args.phoneNumber,
                        address: args.address,
                        profilePicture: args.profilePicture,
                        accountType: args.accountType,
                    },
                });
            } else {
                result = await prisma.user.create({
                    data: {
                        id: args.id,
                        password: hashedPassword,
                        fullName: args.fullName,
                        // dateOfBirth: args.dateOfBirth,
                        gender: args.gender,
                        email: args.email,
                        phoneNumber: args.phoneNumber,
                        address: args.address,
                        profilePicture: args.profilePicture,
                        accountType: args.accountType,
                    },
                });
            }
            console.log("newUser", result);
            return result;
        },

        async deleteUser(_, args) {
            const uca = await prisma.userClasssAssignment.findMany({
                where: { userId: args.id },
            });
            for (let i = 0; i < uca.length; i++) {
                await prisma.userClasssAssignment.delete({
                    where: { id: uca[i].id },
                });
            }

            const usa = await prisma.userSchoolAssignment.findMany({
                where: { userId: args.id },
            });
            for (let i = 0; i < usa.length; i++) {
                await prisma.userSchoolAssignment.delete({
                    where: { id: usa[i].id },
                });
            }

            const tsa = await prisma.teacherSubjectAssignment.findMany({
                where: { teacherId: args.id },
            });
            for (let i = 0; i < tsa.length; i++) {
                await prisma.teacherSubjectAssignment.delete({
                    where: { id: tsa[i].id },
                });
            }

            const result = await prisma.user.delete({
                where: { id: args.id },
            });
            console.log("deleteUser", result);
            return result;
        },

        async userByClasssId(_, args) {
            const uca = await prisma.userClasssAssignment.findMany({
                where: { classsId: args.classsId },
            });

            let result = [];
            for (let i = 0; i < uca.length; i++) {
                const user = await prisma.user.findUnique({
                    where: { id: uca[i].userId },
                });
                result.push(user);
            }
            console.log("userByClasssId", result);
            return result;
        },

        async userBySchoolId(_, args) {
            const usa = await prisma.userSchoolAssignment.findMany({
                where: { schoolId: args.schoolId },
                include: {
                    user: true,
                },
            });

            const result = [];
            for (let i = 0; i < usa.length; i++) {
                result.push(usa[i].user);
            }

            console.log("userBySchoolId:", usa);

            return result;
        },

        // Request new login session for user by id
        async login(_, args) {
            await loginSession.deleteExpiredSessions();

            const newSession = await loginSession.newSession(
                args.userId,
                args.password
            );

            return newSession;
        },

        // Request logout for user by id
        async logout(_, args) {
            const result = await pint.custom("findUnique", "loginSession", {
                where: { userId: args.userId },
            });

            if (result) {
                return await loginSession.deleteSession(result.id);
            }
        },

        // Check if user that request new session has a valid session
        async authenticate(_, args) {
            await loginSession.deleteExpiredSessions();

            const userHasSessionId = await pint.custom(
                "findUnique",
                "loginSession",
                {
                    where: { id: args.sessionId, userId: args.userId },
                }
            );

            if (userHasSessionId) {
                return true;
            }

            return false;
        },

        async subject(_, args) {
            const conditions = [];

            if (args.id && args.id != "undefined")
                conditions.push({ id: { contains: args.id } });
            if (args.name && args.name != "undefined")
                conditions.push({ name: { contains: args.name } });

            const result = await prisma.subject.findMany({
                where: { AND: conditions },
            });

            console.log("subject", result);
            return result;
        },

        async newTSA(_, args) {
            const result = await prisma.teacherSubjectAssignment.create({
                data: {
                    teacherId: args.teacherId,
                    subjectId: args.subjectId,
                },
            });
            console.log("newTSA", result);
            return result;
        },

        async getTSA(_, args) {
            const conditions = [];

            if (args.teacherId && args.teacherId != "undefined")
                conditions.push({ teacherId: args.teacherId });
            if (args.subjectId && args.subjectId != "undefined")
                conditions.push({ subjectId: args.subjectId });

            const result = await prisma.teacherSubjectAssignment.findMany({
                where: { AND: conditions },
                include: { teacher: true, subject: true },
            });
            console.log("getTSA", result);
            return result;
        },

        async school(_, args) {
            const conditions = [];

            if (args.id && args.id != "undefined")
                conditions.push({ id: args.id });
            if (args.name && args.name != "undefined")
                conditions.push({ name: { contains: args.name } });
            if (args.address && args.address != "undefined")
                conditions.push({ address: { contains: args.address } });

            const result = await prisma.school.findMany({
                where: { AND: conditions },
                include: { usa: true },
            });

            for (let i = 0; i < result.length; i++) {
                const principal = await prisma.userSchoolAssignment.findFirst({
                    where: {
                        AND: [
                            { schoolId: result[i].id },
                            { user: { accountType: "PRINCIPAL" } },
                        ],
                    },
                });

                if (principal) {
                    result[i].principal = (
                        await prisma.user.findUnique({
                            where: { id: principal.userId },
                        })
                    ).userId;
                }
            }

            console.log("school", result);
            return result;
        },

        async newSchool(_, args) {
            let result = null;
            if (args.id && args.id != "undefined") {
                const existingSchool = await prisma.school.findFirst({
                    where: { id: args.id },
                });
                if (existingSchool) {
                    result = await prisma.school.update({
                        where: { id: args.id },
                        data: {
                            name: args.name,
                            address: args.address,
                        },
                    });
                }
            } else {
                result = await prisma.school.create({
                    data: {
                        name: args.name,
                        address: args.address,
                    },
                });
            }

            console.log("newSchool", result);
            return result;
        },

        async deleteSchool(_, args) {
            // find all USA and delete them
            const usa = await prisma.userSchoolAssignment.findMany({
                where: { schoolId: args.id },
            });
            for (let i = 0; i < usa.length; i++) {
                await prisma.userSchoolAssignment.delete({
                    where: { id: usa[i].id },
                });
            }

            // find all classes of this school and delete them
            const classes = await prisma.classs.findMany({
                where: { schoolId: args.id },
            });
            for (let i = 0; i < classes.length; i++) {
                await prisma.classs.delete({
                    where: { id: classes[i].id },
                });
            }

            const result = await prisma.school.delete({
                where: { id: args.id },
            });
            console.log("deleteSchool", result);
            return result;
        },

        async schoolById(_, args) {
            return await prisma.school.findUnique({
                where: { id: args.id },
            });
        },

        async schoolByUserId(_, args) {
            const schoolId = (
                await pint.find(
                    "userSchoolAssignment",
                    { schoolId: true },
                    { userId: args.userId },
                    true
                )
            )[0];

            const result = await prisma.school.findUnique({
                where: { id: schoolId },
            });

            console.log(result);
            return result;
        },

        async schoolByClasssId(_, args) {
            const schoolId = (
                await pint.find(
                    "userSchoolAssignment",
                    { schoolId: true },
                    { userId: args.userId },
                    true
                )
            )[0];

            const result = await prisma.school.findUnique({
                where: { id: schoolId },
            });

            console.log(result);
            return result;
        },

        async getUSA(_, args) {
            const conditions = [];

            if (args.userId && args.userId != "undefined")
                conditions.push({ userId: args.userId });
            if (args.schoolId && args.schoolId != "undefined")
                conditions.push({ schoolId: args.schoolId });

            const result = await prisma.userSchoolAssignment.findMany({
                where: { AND: conditions },
                include: { user: true, school: true },
            });

            console.log(result);
            return result;
        },

        async newUSA(_, args) {
            const result = await prisma.userSchoolAssignment.create({
                data: {
                    userId: args.userId,
                    schoolId: args.schoolId,
                },
            });
            console.log("newUSA:", result);
            return result;
        },

        async deleteUSA(_, args) {
            const result = await prisma.userSchoolAssignment.delete({
                where: { id: args.id },
            });
            console.log("deleteUSA:", result);
            return result;
        },

        async classs(_, args) {
            const conditions = [];

            if (args.id && args.id != "undefined")
                conditions.push({ id: { contains: args.id } });
            if (args.name && args.name != "undefined")
                conditions.push({ name: { contains: args.name } });
            if (args.schoolId && args.schoolId != "undefined")
                conditions.push({ schoolId: { contains: args.schoolId } });
            if (args.formTeacherId && args.formTeacherId != "undefined")
                conditions.push({
                    formTeacherId: { contains: args.formTeacherId },
                });

            const result = await prisma.classs.findMany({
                orderBy: [{ name: "asc" }],
                where: { AND: conditions },
            });
            console.log(result);
            return result;
        },

        async classsByUserId(_, args) {
            return await pint.find(
                "userClasssAssignment",
                null,
                {
                    userId: args.userId,
                },
                true
            );
        },

        async getFormTeachersOfSchool(_, args) {
            const result = (
                await prisma.classs.findMany({
                    where: { schoolId: args.schoolId },
                    include: {
                        formTeacher: true,
                    },
                })
            ).map((x) => x.formTeacher);
            console.log("Form teachers:", result);
            return result;
        },

        async getNonFormTeachersOfSchool(_, args) {
            const result = await prisma.user.findMany({
                where: {
                    AND: [
                        { accountType: "TEACHER" },
                        { formTeacherOf: { none: {} } },
                        { usa: { some: { schoolId: args.schoolId } } },
                    ],
                },
            });

            console.log("Non-form teachers:", result);
            return result;
        },

        async newClasss(_, args) {
            // Check if formTeacherId is already assigned to a class
            const formTeacher = (await prisma.classs.findFirst({
                where: { formTeacherId: args.formTeacherId },
            }))
                ? true
                : false;

            if (formTeacher) {
                console.log("formTeacher already assigned to a class");
                return null;
            }

            const result = await prisma.classs.create({
                data: {
                    name: args.name,
                    schoolId: args.schoolId,
                    grade: parseInt(args.grade),
                    formTeacherId: args.formTeacherId,
                },
            });
            console.log("New class created:", result);
            return result;
        },

        async deleteClasss(_, args) {
            const result = await prisma.classs.delete({
                where: { id: args.id },
            });
            console.log("Class deleted:", result);
            return result;
        },

        async getUCA(_, args) {
            const conditions = [
                { user: { accountType: { notIn: ["ADMIN"] } } },
            ];

            if (args.userId && args.userId != "undefined")
                conditions.push({ userId: args.userId });
            if (args.classsId && args.classsId != "undefined")
                conditions.push({ classsId: args.classsId });

            const result = await prisma.userClasssAssignment.findMany({
                where: { AND: conditions },
                include: { user: true, classs: true },
            });

            console.log("getUCA:", result);
            return result;
        },

        async newUCA(_, args) {
            const uca = await prisma.userClasssAssignment.findFirst({
                where: {
                    AND: [{ userId: args.userId }, { classsId: args.classsId }],
                },
            });

            if (uca) {
                console.log("UCA already exists");
                return uca;
            }

            const result = await prisma.userClasssAssignment.create({
                data: {
                    userId: args.userId,
                    classsId: args.classsId,
                },
            });
            console.log("newUCA:", result);
            return result;
        },

        async deleteUCA(_, args) {
            const result = await prisma.userClasssAssignment.delete({
                where: { id: args.id },
            });
            console.log("deleteUCA:", result);
            return result;
        },

        async timetableEntry(_, args) {
            const conditions = [];

            if (args.id && args.id != "undefined")
                conditions.push({ id: args.id });
            if (args.semesterId && args.semesterId != "undefined")
                conditions.push({ semesterId: args.semesterId });
            if (args.schoolId && args.schoolId != "undefined")
                conditions.push({ schoolId: args.schoolId });
            if (args.classsId && args.classsId != "undefined")
                conditions.push({ classsId: args.classsId });
            if (args.dayOfWeek && args.dayOfWeek != "undefined")
                conditions.push({
                    dayOfWeek: parseInt(args.dayOfWeek),
                });
            if (args.timeSlot && args.timeSlot != "undefined")
                conditions.push({
                    timeSlot: parseInt(args.timeSlot),
                });

            const result = await prisma.timetableEntry.findMany({
                where: { AND: conditions },
            });

            for (let i = 0; i < result.length; i++) {
                result[i].classsName = (
                    await prisma.classs.findFirst({
                        where: { id: result[i].classsId },
                    })
                ).name;

                const teacherId = (
                    await prisma.timetableEntryAttendence.findFirst({
                        where: {
                            AND: [
                                { timetableEntryId: result[i].id },
                                {
                                    user: {
                                        accountType: "TEACHER",
                                    },
                                },
                            ],
                        },
                    })
                ).userId;

                const subjectObj =
                    await prisma.teacherSubjectAssignment.findFirst({
                        where: {
                            teacherId: teacherId,
                        },
                        include: {
                            subject: {
                                select: {
                                    name: true,
                                },
                            },
                        },
                    });
                result[i].subjectName = subjectObj.subject.name;
            }

            console.log(result);
            return result;
        },

        async timetableEntryByUserId(_, args) {
            let semesterId = "";

            const currentDate = new Date();
            if (currentDate.getMonth() >= 0 && currentDate.getMonth() <= 5) {
                semesterId = currentDate.getFullYear() + "-01";
            } else {
                semesterId = currentDate.getFullYear() + "-02";
            }
            console.log("semesterId:", semesterId);

            const filteredTimetableEntries = await pint.find(
                "timetableEntryAttendence",
                { timetableEntryId: true },
                { userId: args.userId },
                true
            );
            // console.log("fte:", filteredTimetableEntries);

            const result = await prisma.timetableEntry.findMany({
                orderBy: [{ timeSlot: "asc" }, { dayOfWeek: "asc" }],
                where: {
                    AND: [
                        {
                            id: { in: filteredTimetableEntries },
                        },
                        { semesterId: semesterId },
                        { weekOfSemester: 0 },
                    ],
                },
            });
            console.log("result:", result);

            // for each entry
            for (let i = 0; i < result.length; i++) {
                result[i].classsName = (
                    await prisma.classs.findFirst({
                        where: { id: result[i].classsId },
                    })
                ).name;

                const teacherObj =
                    await prisma.timetableEntryAttendence.findFirst({
                        where: {
                            AND: [
                                { timetableEntryId: result[i].id },
                                {
                                    user: {
                                        accountType: "TEACHER",
                                    },
                                },
                            ],
                        },
                    });

                if (teacherObj) {
                    const subjectObj =
                        await prisma.teacherSubjectAssignment.findFirst({
                            where: {
                                teacherId: teacherObj.userId,
                            },
                            include: {
                                subject: {
                                    select: {
                                        name: true,
                                    },
                                },
                            },
                        });
                    result[i].subjectName = subjectObj.subject.name;
                } else {
                    result[i].subjectName = "";
                }
            }

            console.log(result);
            return result;
        },

        async newTimetableEntry(_, args) {
            // if entry already exists, return the entry
            const entry = await prisma.timetableEntry.findFirst({
                where: {
                    semesterId: args.semesterId,
                    weekOfSemester: 0,
                    schoolId: args.schoolId,
                    classsId: args.classsId,
                    dayOfWeek: parseInt(args.dayOfWeek),
                    timeSlot: parseInt(args.timeSlot),
                },
            });
            if (entry) {
                console.log(entry);
                return entry;
            }

            const result = await prisma.timetableEntry.create({
                data: {
                    semesterId: args.semesterId,
                    weekOfSemester: 0,
                    schoolId: args.schoolId,
                    classsId: args.classsId,
                    dayOfWeek: parseInt(args.dayOfWeek),
                    timeSlot: parseInt(args.timeSlot),
                },
            });
            console.log(result);
            return result;
        },

        async timetableEntryAttendence(_, args) {
            const conditions = [];

            if (args.id && args.id != "undefined")
                conditions.push({ id: { contains: args.id } });
            if (args.timetableEntryId && args.timetableEntryId != "undefined")
                conditions.push({
                    timetableEntryId: { contains: args.timetableEntryId },
                });
            if (args.userId && args.userId != "undefined")
                conditions.push({ userId: { contains: args.userId } });

            const result = await prisma.timetableEntryAttendence.findMany({
                where: { AND: conditions },
            });

            console.log(result);
            return result;
        },

        async newTimetableEntryAttendence(_, args) {
            // Check if tea already exists
            const tea = await prisma.timetableEntryAttendence.findFirst({
                where: {
                    timetableEntryId: args.timetableEntryId,
                    userId: args.userId,
                },
            });

            // If tea already exists, return it
            if (tea) {
                console.log(tea);
                return tea;
            }

            const user = await prisma.user.findUnique({
                where: { id: args.userId },
            });
            if (user.accountType == "TEACHER") {
                console.log("user is TEACHER");
                // check if there are any other TEACHERs in the same timetableEntry
                // get all userIds of the same timetableEntry
                const teacherIds = (
                    await prisma.timetableEntryAttendence.findMany({
                        where: {
                            AND: [
                                { timetableEntryId: args.timetableEntryId },
                                {
                                    user: {
                                        accountType: "TEACHER",
                                    },
                                },
                            ],
                        },
                        include: {
                            user: {
                                select: {
                                    id: true,
                                },
                            },
                        },
                    })
                ).map((x) => x.user.id);
                console.log("userIds:", teacherIds);

                // if there are any other TEACHERs, delete their attendence
                if (teacherIds.length > 0) {
                    console.log(
                        "found other TEACHERs in the same timetableEntry"
                    );
                    for (let i = 0; i < teacherIds.length; i++) {
                        const teaId = (
                            await prisma.timetableEntryAttendence.findFirst({
                                where: {
                                    AND: [
                                        { userId: teacherIds[i] },
                                        {
                                            timetableEntryId:
                                                args.timetableEntryId,
                                        },
                                    ],
                                },
                            })
                        ).id;
                        await prisma.timetableEntryAttendence.delete({
                            where: {
                                id: teaId,
                            },
                        });
                        console.log(
                            "deleted attendence for TEACHER:",
                            teacherIds[i].id
                        );
                    }
                }
            }

            const result = await prisma.timetableEntryAttendence.create({
                data: {
                    timetableEntryId: args.timetableEntryId,
                    userId: args.userId,
                },
            });
            console.log(result);
            return result;
        },

        async deleteTimetableEntryAttendence(_, args) {
            const conditions = [];

            if (args.timetableEntryId && args.timetableEntryId != "undefined")
                conditions.push({
                    timetableEntryId: args.timetableEntryId,
                });
            if (args.userId && args.userId != "undefined")
                conditions.push({ userId: args.userId });

            const tea = await prisma.timetableEntryAttendence.findFirst({
                where: {
                    AND: conditions,
                },
            });

            if (!tea) {
                console.log("No such TEA");
                return null;
            }

            const result = await prisma.timetableEntryAttendence.delete({
                where: { id: tea.id },
            });

            console.log("deleteTimetableEntryAttendence:", result);
            return result;
        },

        async getGradeType(_, args) {
            const conditions = [];

            if (args.id && args.id != "undefined")
                conditions.push({ id: args.id });
            if (args.name && args.name != "undefined")
                conditions.push({ name: { contains: args.name } });
            if (args.multiplier && args.multiplier != "undefined")
                conditions.push({
                    multiplier: { equals: parseFloat(args.multiplier) },
                });

            const result = await prisma.gradeType.findMany({
                where: { AND: conditions },
            });

            console.log("getGradeType", result);
            return result;
        },

        async getStudentGrades(_, args) {
            const conditions = [];

            if (args.studentId && args.studentId != "undefined")
                conditions.push({ studentId: args.studentId });
            if (args.graderId && args.graderId != "undefined")
                conditions.push({ graderId: args.graderId });
            if (args.subjectId && args.subjectId != "undefined")
                conditions.push({ subjectId: args.subjectId });
            if (args.semesterId && args.semesterId != "undefined")
                conditions.push({ semesterId: args.semesterId });
            if (args.typeId && args.typeId != "undefined")
                conditions.push({ typeId: args.typeId });

            const result = await prisma.studentGrade.findMany({
                where: { AND: conditions },
                include: {
                    student: true,
                    grader: true,
                    subject: true,
                    semester: true,
                    type: true,
                },
            });

            console.log("getStudentGrade", result);
            return result;
        },

        async newStudentGrade(_, args) {
            // Check if studentGrade already exists
            const studentGrade = await prisma.studentGrade.findFirst({
                where: {
                    studentId: args.studentId,
                    graderId: args.graderId,
                    subjectId: args.subjectId,
                    semesterId: args.semesterId,
                    typeId: args.typeId,
                },
            });

            if (studentGrade) {
                await prisma.studentGrade.update({
                    where: { id: studentGrade.id },
                    data: { value: parseFloat(args.value) },
                });
                console.log("studentGrade updated", studentGrade);
                return studentGrade;
            }

            const result = await prisma.studentGrade.create({
                data: {
                    studentId: args.studentId,
                    graderId: args.graderId,
                    subjectId: args.subjectId,
                    semesterId: args.semesterId,
                    typeId: args.typeId,
                    value: parseFloat(args.value),
                },
            });
            console.log("newStudentGrade", result);
            return result;
        },
    },
};
