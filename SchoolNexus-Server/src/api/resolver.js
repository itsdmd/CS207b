import * as pint from "../models/prisma-interface.js";
import * as pw from "../functions/password.js";
import * as session from "../models/loginSession.js";

export const resolvers = {
	Query: {
		async user(_, args) {
			const result = await pint.custom("findUnique", "user", { where: { id: args.id } });
			console.log(result);
			return result;
		},

		async authenticate(_, args) {
			const result = await pint.custom("findUnique", "user", { where: { id: args.id } });
			const valid = pw.verifyPassword(args.password, result.password);

			if (valid) {
				const sessionResult = await session.newSession(result.id);
				if (sessionResult) {
					return { id: result.id };
				}
			}
		},
	},
};
