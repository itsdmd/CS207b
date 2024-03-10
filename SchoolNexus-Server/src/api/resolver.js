import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

import * as pint from "../models/prisma-interface.js";
import * as pw from "../functions/password.js";
import * as loginSession from "../models/loginSession.js";

export const resolvers = {
    Query: {
        // Get user
        async user(_, args) {
            const conditions = [];
            if (args.id) conditions.push({ id: { contains: args.id } });
            if (args.fullName)
                conditions.push({ fullName: { contains: args.fullName } });
            if (args.dateOfBirth)
                conditions.push({
                    dateOfBirth: { equals: args.dateOfBirth },
                });
            if (args.gender)
                conditions.push({ gender: { equals: args.gender } });
            if (args.email)
                conditions.push({
                    email: { contains: args.email },
                });
            if (args.phoneNumber)
                conditions.push({
                    phoneNumber: { contains: args.phoneNumber },
                });
            if (args.address)
                conditions.push({
                    address: { contains: args.address },
                });
            if (args.profilePicture)
                conditions.push({
                    profilePicture: { equals: args.profilePicture },
                });
            if (args.accountType)
                conditions.push({
                    accountType: { equals: args.accountType },
                });
            if (args.createdAt)
                conditions.push({
                    createdAt: { equals: args.createdAt },
                });
            if (args.updatedAt)
                conditions.push({
                    updatedAt: { equals: args.updatedAt },
                });
            const result = await pint.custom("findMany", "user", {
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
            const valid = pw.verifyPassword(args.password, result.password);

            if (valid) {
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
    },
};
