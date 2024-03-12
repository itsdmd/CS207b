import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

import * as pint from "../models/prisma-interface.js";
import * as loginSession from "../models/loginSession.js";

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

        async classsInSchool(_, args) {
            return await prisma.classs.findMany({
                where: { schoolId: args.schoolId },
            });
        },

        async userByClasssId(_, args) {
            return await prisma.userClasssAssignment.findMany({
                where: { classsId: args.classsId },
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
                where: {
                    AND: [
                        {
                            id: { in: filteredTimetableEntries },
                        },
                        { semesterId: semesterId },
                    ],
                },
            });
            console.log("result:", result);

            // for each entry
            for (let i = 0; i < result.length; i++) {
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
                const subjectId =
                    await prisma.teacherSubjectAssignment.findFirst({
                        where: { userId: teacherId.id },
                    });
                console.log("subjectId:", subjectId);

                // set the subjectId to the entry
                result[i].subjectId = subjectId.subjectId;
            }

            console.log(result);
            return result;
        },
    },
};
