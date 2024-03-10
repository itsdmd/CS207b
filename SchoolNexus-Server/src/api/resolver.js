import * as pint from "../models/prisma-interface.js";
import * as pw from "../functions/password.js";
import * as loginSession from "../models/loginSession.js";

export const resolvers = {
    Query: {
        // Get user by id
        async userById(_, args) {
            const result = await pint.custom("findUnique", "user", {
                where: { id: args.id },
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

            const userObj = await pint.custom("findUnique", "user", {
                where: { id: args.userId },
            });
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
