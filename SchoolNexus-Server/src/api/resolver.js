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

            if (args.id) conditions.push({ id: { contains: args.id } });
            if (args.name) conditions.push({ name: { contains: args.name } });
            if (args.schoolId)
                conditions.push({ schoolId: { contains: args.schoolId } });
            if (args.formTeacherId)
                conditions.push({
                    formTeacherId: { contains: args.formTeacherId },
                });

            return await prisma.classs.findMany({
                where: { AND: conditions },
            });
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
            console.log("fte:", filteredTimetableEntries);

            const result = await prisma.timetableEntry.findMany({
                orderBy: [{ timeSlot: "asc" }, { dayOfWeek: "asc" }],
                where: {
                    AND: [
                        {
                            id: { in: filteredTimetableEntries },
                        },
                        { semesterId: semesterId },
                        { weekOfSemester: 1 },
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
    },
};
