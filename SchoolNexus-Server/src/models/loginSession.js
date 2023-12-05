import * as pint from "./prisma-interface.js";
import * as pw from "../functions/password.js";

export async function newSession(userId, hashedPassword) {
	// Check if user already has a session
	if (await pint.custom("findUnique", "loginSession", { where: { userId } })) {
		console.log("User already has a session");
		return false;
	}

	// Check if user exists
	const user = await pint.custom("findUnique", "user", { where: { id: userId } });
	if (!user) {
		console.log("User does not exist");
		return false;
	}

	// Check if password is correct
	if (!hashedPassword) {
		console.log("No password provided");
		return false;
	} else if (!pw.verifyPassword(hashedPassword, user.password)) {
		console.log("Incorrect password");
		return false;
	} else {
		console.log("Password correct. Trying to create session...");
	}

	// Create new session
	try {
		let sessionObj = { userId: userId };
		if (process.env.SESSION_HOURS != 0) {
			sessionObj.expiresAt = new Date(Date.now() + parseInt(process.env.SESSION_HOURS) * 60 * 60 * 1000);
		}

		await pint.custom("create", "loginSession", { data: sessionObj });

		sessionObj = await pint.custom("findUnique", "loginSession", { where: { userId } });

		console.log("Session " + sessionObj.id + " created for user " + userId + " and will expire at " + sessionObj.expiresAt);
		return sessionObj;
	} catch (error) {
		console.log(error);
		return false;
	}
}

export async function deleteSession(sessionId) {
	try {
		await pint.custom("delete", "loginSession", { where: { id: sessionId } });
		console.log("Session " + sessionId + " deleted");
		return true;
	} catch (error) {
		console.log(error);
		return false;
	}
}

export async function deleteSessionOfUser(userId) {
	try {
		await pint.custom("delete", "loginSession", { where: { userId } });
		console.log("Session of user " + userId + " deleted");
		return true;
	} catch (error) {
		console.log(error);
		return false;
	}
}

export async function deleteExpiredSessions() {
	try {
		await pint.custom("deleteMany", "loginSession", { where: { expiresAt: { lte: new Date() } } });
		console.log("Expired sessions deleted");
		return true;
	} catch (error) {
		console.log(error);
		return false;
	}
}

export async function deleteAllSessions() {
	try {
		await pint.custom("deleteMany", "loginSession", { where: {} });
		console.log("All sessions deleted");
		return true;
	} catch (error) {
		console.log(error);
		return false;
	}
}
