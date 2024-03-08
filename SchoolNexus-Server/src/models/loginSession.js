import * as pint from "./prisma-interface.js";
import * as pw from "../functions/password.js";

export async function newSession(userId, hashedPassword) {
    // Check if user already has a session
    if (
        await pint.custom("findUnique", "loginSession", {
            where: { userId: userId },
        })
    ) {
        if (process.env.VERBOSITY >= 2) {
            console.warn("User already has a session");
        }
        return false;
    }

    // Check if user exists
    const user = await pint.custom("findUnique", "user", {
        where: { id: userId },
    });
    if (!user) {
        if (process.env.VERBOSITY >= 1) {
            console.error("User does not exist");
        }
        return false;
    }

    // Check if password is correct
    if (!hashedPassword) {
        if (process.env.VERBOSITY >= 2) {
            console.warn("No password provided");
        }
        return false;
    } else if (!(await pw.verifyPassword(hashedPassword, user.password))) {
        if (process.env.VERBOSITY >= 1) {
            console.error("Incorrect password");
        }
        return false;
    } else {
        if (process.env.VERBOSITY >= 3) {
            console.log("Password correct. Trying to create session...");
        }
    }

    // Create new session
    try {
        let sessionObj = { userId: userId };
        if (process.env.SESSION_HOURS != 0) {
            sessionObj.expiresAt = new Date(
                Date.now() +
                    parseInt(process.env.SESSION_HOURS) * 60 * 60 * 1000
            );
        }

        await pint.custom("create", "loginSession", { data: sessionObj });

        sessionObj = await pint.custom("findUnique", "loginSession", {
            where: { userId },
        });

        if (process.env.VERBOSITY >= 3) {
            console.log(
                "Session " +
                    sessionObj.id +
                    " created for user " +
                    userId +
                    " and " +
                    (process.env.SESSION_HOURS == 0)
                    ? "will NOT automatically expires"
                    : "will expire at " + sessionObj.expiresAt
            );
        }
        return sessionObj;
    } catch (error) {
        if (process.env.VERBOSITY >= 1) {
            console.error("Failed to create session: " + error);
        }
        return false;
    }
}

export async function deleteSession(sessionId) {
    try {
        await pint.custom("delete", "loginSession", {
            where: { id: sessionId },
        });
        if (process.env.VERBOSITY >= 3) {
            console.log("Session " + sessionId + " deleted");
        }
        return true;
    } catch (error) {
        if (process.env.VERBOSITY >= 1) {
            console.error(
                "Failed to delete session " + sessionId + ": " + error
            );
        }
        return false;
    }
}

export async function deleteSessionOfUser(userId) {
    try {
        await pint.custom("delete", "loginSession", { where: { userId } });
        if (process.env.VERBOSITY >= 3) {
            console.log("Session of user " + userId + " deleted");
        }
        return true;
    } catch (error) {
        if (process.env.VERBOSITY >= 1) {
            console.error(
                "Failed to delete session of user " + userId + ": " + error
            );
        }
        return false;
    }
}

export async function deleteExpiredSessions() {
    try {
        await pint.custom("deleteMany", "loginSession", {
            where: { expiresAt: { lte: new Date() } },
        });
        if (process.env.VERBOSITY >= 3) {
            console.log("Expired sessions deleted");
        }
        return true;
    } catch (error) {
        if (process.env.VERBOSITY >= 1) {
            console.error("Failed to delete expired sessions: " + error);
        }
        return false;
    }
}

export async function deleteAllSessions() {
    try {
        await pint.custom("deleteMany", "loginSession", { where: {} });
        if (process.env.VERBOSITY >= 3) {
            console.log("All sessions deleted");
        }
        return true;
    } catch (error) {
        if (process.env.VERBOSITY >= 1) {
            console.error("Failed to delete all sessions: " + error);
        }
        return false;
    }
}
