import * as pint from "./prisma-interface.js";
import * as pw from "../functions/password.js";

/**
 * Each user can only have 1 login session at a time.
 * The session's expiry time is set by the SESSION_HOURS environment variable. The value must be an integer.
 * If SESSION_HOURS is set to 0, the session will not expire.
 * If user want to login from a different device, they must first perform a logout
 * by providing their password from the device they want to login.
 */

/**
 * Create a new session for a user
 * @param {String} userId - The id of the user
 * @param {String} password - The password of the user
 * @returns {Object} - The session object with format {msg: String, success: Boolean}
 */
export async function newSession(userId, password) {
    // Check if user already has a session
    if (
        await pint.custom("findUnique", "loginSession", {
            where: { userId: userId },
        })
    ) {
        if (process.env.VERBOSITY >= 2) {
            console.warn("User already has a session");
        }
        return { msg: "User already has a session", success: false };
    }

    // Check if user exists
    const user = await pint.custom("findUnique", "user", {
        where: { id: userId },
    });
    if (!user) {
        if (process.env.VERBOSITY >= 1) {
            console.error("User does not exist");
        }
        return { msg: "User does not exist", success: false };
    }

    // Check if password is correct
    if (!password) {
        if (process.env.VERBOSITY >= 2) {
            console.warn("No password provided");
        }
        return { msg: "No password provided", success: false };
    } else if (!(await pw.verifyPassword(password, user.password))) {
        if (process.env.VERBOSITY >= 1) {
            console.error("Incorrect password");
        }
        return { msg: "Incorrect password", success: false };
    } else {
        if (process.env.VERBOSITY >= 3) {
            console.log("Password correct. Trying to create session...");
        }
    }

    // Create new session
    try {
        let sessionObj = { userId: userId };
        if (parseInt(process.env.SESSION_HOURS) > 0) {
            sessionObj.expiresAt = new Date(
                Date.now() +
                    parseInt(process.env.SESSION_HOURS) * 60 * 60 * 1000
            );
        } else {
            sessionObj.expiresAt = null;
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
        return { msg: sessionObj.id, success: true };
    } catch (error) {
        if (process.env.VERBOSITY >= 1) {
            console.error("Failed to create session: " + error);
        }
        return { msg: "Failed to create session", success: false };
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
        return { msg: "Session " + sessionId + " deleted", success: true };
    } catch (error) {
        if (process.env.VERBOSITY >= 1) {
            console.error(
                "Failed to delete session " + sessionId + ": " + error
            );
        }
        return { msg: "Failed to delete session " + sessionId, success: false };
    }
}

export async function deleteSessionOfUser(userId) {
    try {
        await pint.custom("delete", "loginSession", { where: { userId } });
        if (process.env.VERBOSITY >= 3) {
            console.log("Session of user " + userId + " deleted");
        }
        return { msg: "Session of user " + userId + " deleted", success: true };
    } catch (error) {
        if (process.env.VERBOSITY >= 1) {
            console.error(
                "Failed to delete session of user " + userId + ": " + error
            );
        }
        return {
            msg: "Failed to delete session of user " + userId,
            success: false,
        };
    }
}

export async function deleteExpiredSessions() {
    try {
        await pint.custom("deleteMany", "loginSession", {
            where: {
                AND: [
                    { expiresAt: { lte: new Date() } },
                    { expiresAt: { not: null } },
                ],
            },
        });
        if (process.env.VERBOSITY >= 3) {
            console.log("Expired sessions deleted");
        }
        return { msg: "Expired sessions deleted", success: true };
    } catch (error) {
        if (process.env.VERBOSITY >= 1) {
            console.error("Failed to delete expired sessions: " + error);
        }
        return { msg: "Failed to delete expired sessions", success: false };
    }
}

export async function deleteAllSessions() {
    try {
        await pint.custom("deleteMany", "loginSession", { where: {} });
        if (process.env.VERBOSITY >= 3) {
            console.log("All sessions deleted");
        }
        return { msg: "All sessions deleted", success: true };
    } catch (error) {
        if (process.env.VERBOSITY >= 1) {
            console.error("Failed to delete all sessions: " + error);
        }
        return { msg: "Failed to delete all sessions", success: false };
    }
}
