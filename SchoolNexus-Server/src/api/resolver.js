import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

import * as pint from "../models/prisma-interface.js";
import * as loginSession from "../models/loginSession.js";
import { generateHashedPassword } from "../functions/password.js";

export const resolvers = {
    Query: {
        // Get user
        async getUser(_, args) {
            const conditions = [];

            if (args.id && args.id != "undefined")
                conditions.push({ id: { contains: args.id } });
            if (args.fullName && args.fullName != "undefined")
                conditions.push({ fullName: { contains: args.fullName } });
            if (args.dateOfBirth && args.dateOfBirth != "undefined")
                conditions.push({
                    dateOfBirth: { equals: args.dateOfBirth },
                });
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
            });

            for (let i = 0; i < result.length; i++) {
                // get user's schoolId from userSchoolAssignment
                const schoolId = (
                    await pint.find(
                        "userSchoolAssignment",
                        { schoolId: true },
                        { userId: args.id },
                        true
                    )
                )[0];
                result[i].schoolId = schoolId;

                // get user's classsId from userClasssAssignment
                const classsId = await pint.find(
                    "userClasssAssignment",
                    { classsId: true },
                    { userId: args.id },
                    true
                );
                result[i].classsId = classsId;
            }

            console.log(result);
            return result;
        },

        // Set user
        async setUser(_, args) {
            const hashedPassword = generateHashedPassword(args.password);

            const result = await prisma.user.create({
                data: {
                    id: args.id,
                    password: hashedPassword,
                    fullName: args.fullName,
                    dateOfBirth: args.dateOfBirth,
                    gender: args.gender,
                    email: args.email,
                    phoneNumber: args.phoneNumber,
                    address: args.address,
                    profilePicture: args.profilePicture,
                    accountType: args.accountType,
                },
            });
            console.log(result);
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
            console.log(result);
            return result;
        },

        async userBySchoolId(_, args) {
            const usa = await prisma.userSchoolAssignment.findMany({
                where: { schoolId: args.schoolId },
            });

            let result = [];
            for (let i = 0; i < usa.length; i++) {
                const user = await prisma.user.findUnique({
                    where: { id: usa[i].userId },
                });
                result.push(user);
            }
            console.log(result);
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

            if (args.id) conditions.push({ id: { contains: args.id } });
            if (args.name) conditions.push({ name: { contains: args.name } });

            return await prisma.subject.findMany({
                where: { AND: conditions },
            });
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

        async classs(_, args) {
            const conditions = [];

            console.log("args", args);

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

                // get entry's id
                const entryId = result[i].id;
                console.log("entryId:", entryId);

                // get all ttEntryAttendences with entryId
                const ttEntryAttendences =
                    await prisma.timetableEntryAttendence.findMany({
                        where: { timetableEntryId: entryId },
                    });
                console.log("ttEntryAttendences:", ttEntryAttendences);

                // get all userId of ttEntryAttendences
                const userIds = ttEntryAttendences.map((x) => x.userId);
                console.log("userIds:", userIds);

                // get teacher's userId
                const teacherId = (
                    await prisma.user.findFirst({
                        where: { id: { in: userIds }, accountType: "TEACHER" },
                    })
                ).id;
                console.log("teacherId:", teacherId);

                // get teacher's subjectId
                const tsa = await prisma.teacherSubjectAssignment.findFirst({
                    where: { teacherId: teacherId },
                });
                console.log("subjectId:", tsa);
                result[i].subjectId = tsa.subjectId;

                // get subjectId's name
                const subjectName = (
                    await prisma.subject.findFirst({
                        where: { id: tsa.subjectId },
                    })
                ).name;
                console.log("subjectName:", subjectName);

                // set the subjectId to the entry
                result[i].subjectName = subjectName;
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

                // get entry's id
                const entryId = result[i].id;
                console.log("entryId:", entryId);

                // get all ttEntryAttendences with entryId
                const ttEntryAttendences =
                    await prisma.timetableEntryAttendence.findMany({
                        where: { timetableEntryId: entryId },
                    });
                console.log("ttEntryAttendences:", ttEntryAttendences);

                // get all userId of ttEntryAttendences
                const userIds = ttEntryAttendences.map((x) => x.userId);
                console.log("userIds:", userIds);

                // get teacher's userId
                const teacherId = (
                    await prisma.user.findFirst({
                        where: { id: { in: userIds }, accountType: "TEACHER" },
                    })
                ).id;
                console.log("teacherId:", teacherId);

                // get teacher's subjectId
                const tsa = await prisma.teacherSubjectAssignment.findFirst({
                    where: { teacherId: teacherId },
                });
                console.log("subjectId:", tsa);
                result[i].subjectId = tsa.subjectId;

                // get subjectId's name
                const subjectName = (
                    await prisma.subject.findFirst({
                        where: { id: tsa.subjectId },
                    })
                ).name;
                console.log("subjectName:", subjectName);

                // set the subjectId to the entry
                result[i].subjectName = subjectName;
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

            // check if user is TEACHER
            const user = await prisma.user.findUnique({
                where: { id: args.userId },
            });
            if (user.accountType == "TEACHER") {
                console.log("user is TEACHER");
                // check if there are any other TEACHERs in the same timetableEntry
                // get all userIds of the same timetableEntry
                const userIds = (
                    await prisma.timetableEntryAttendence.findMany({
                        where: { timetableEntryId: args.timetableEntryId },
                    })
                ).map((x) => x.userId);
                console.log("userIds:", userIds);

                // get all TEACHERs of the same timetableEntry
                const teachers = await prisma.user.findMany({
                    where: { id: { in: userIds }, accountType: "TEACHER" },
                });
                console.log("teachers:", teachers);

                // if there are any other TEACHERs, delete their attendence
                if (teachers.length > 0) {
                    console.log(
                        "found other TEACHERs in the same timetableEntry"
                    );
                    for (let i = 0; i < teachers.length; i++) {
                        const teaId = (
                            await prisma.timetableEntryAttendence.findFirst({
                                where: {
                                    userId: teachers[i].id,
                                    timetableEntryId: args.timetableEntryId,
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
                            teachers[i].id
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
    },
};
