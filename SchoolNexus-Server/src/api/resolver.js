import * as pint from "../models/prisma-interface.js";
import * as pw from "../functions/password.js";
import * as loginSession from "../models/loginSession.js";

export const resolvers = {
	Query: {
		async user(_, args) {
			const result = await pint.custom("findUnique", "user", { where: { id: args.id } });
			console.log(result);
			return result;
		},

		async login(_, args) {
			await loginSession.deleteExpiredSessions();

			const newSession = await loginSession.newSession(args.userId, args.password);

			if (newSession) {
				return { sessionId: newSession.id };
			} else {
				return null;
			}
		},

		async logout(_, args) {
			const result = await pint.custom("findUnique", "loginSession", { where: { userId: args.userId } });
			const valid = pw.verifyPassword(args.password, result.password);

			if (valid) {
				return await loginSession.deleteSession(result.id);
			}
		},

		// Used to check if logged in user has a valid session
		async authenticate(_, args) {
			await loginSession.deleteExpiredSessions();

			const userObj = await pint.custom("findUnique", "user", { where: { id: args.userId } });
			const userHasSessionId = await pint.custom("findUnique", "loginSession", { where: { id: args.sessionId, userId: args.userId } });
			const valid = userHasSessionId && pw.verifyPassword(args.password, userObj.password);

			if (valid === null || valid === undefined) {
				return false;
			}

			return valid;
		},
	},
};
