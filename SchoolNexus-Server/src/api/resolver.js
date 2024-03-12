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
            return await prisma.classs.findUnique({
                where: { id: args.classsId },
            });
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
    },
};
