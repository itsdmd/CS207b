import { PrismaClient } from "@prisma/client";
import { AccountType, Gender } from "@prisma/client";
import Chance from "chance";
import { generateHashedPassword } from "../functions/password.js";
import * as pint from "./prisma-interface.js";

const chance = new Chance();
const prisma = new PrismaClient();

export async function createUser(userObj = {}) {
    /* #region   */
    // Structure of userObj (* = required):
    // userObj = {
    // 		* id,
    // 		password,
    // 		* fullName,
    // 		* dateOfBirth,
    // 		* gender,
    // 		* accountType,
    // 		email,
    // 		phoneNumber,
    // 		address,
    // 		classsId,
    // 		schoolId,
    // };
    /* #endregion */

    if (userObj.fullName === null || userObj.fullName === undefined) {
        userObj.fullName = chance.name();
    }
    // Check if name contains only letters, spaces, hyphens, and single quotes
    else if (!/^[a-zA-Z -']+$/.test(userObj.fullName)) {
        if (process.env.VERBOSITY >= 1) {
            console.error("Invalid fullName: " + userObj.fullName);
        }
        return false;
    } else {
        userObj.fullName = userObj.fullName.trim();
    }

    const ACCOUNT_TYPES = Object.values(AccountType).map((value) =>
        value.toString()
    );
    if (userObj.accountType === null || userObj.accountType === undefined) {
        const pool = [
            "STUDENT",
            "STUDENT",
            "STUDENT",
            "TEACHER",
            "TEACHER",
            "PRINCIPAL",
        ];
        userObj.accountType = chance.pickone(pool);
    } else if (!ACCOUNT_TYPES.includes(userObj.accountType)) {
        if (process.env.VERBOSITY >= 1) {
            console.error("Invalid account type: " + userObj.accountType);
        }
        return false;
    }

    if (userObj.dateOfBirth === null || userObj.dateOfBirth === undefined) {
        // Birth year range is calculated based on the current year and the account type.
        const currentYear = new Date().getFullYear();

        // Students should be between 6 and 15 years old.
        if (userObj.accountType === "STUDENT") {
            userObj.dateOfBirth = chance.birthday({
                string: false,
                american: false,
                year: chance.year({
                    min: currentYear - 15,
                    max: currentYear - 6,
                }),
            });
        }

        // Principals should be between 30 and 70 years old.
        else if (userObj.accountType === "PRINCIPAL") {
            userObj.dateOfBirth = chance.birthday({
                string: false,
                american: false,
                year: chance.year({
                    min: currentYear - 70,
                    max: currentYear - 30,
                }),
            });
        }

        // Other accountType should be between 25 and 65 years old.
        else if (
            userObj.accountType === "TEACHER" ||
            userObj.accountType === "ADMIN"
        ) {
            userObj.dateOfBirth = chance.birthday({
                string: false,
                american: false,
                year: chance.year({
                    min: currentYear - 65,
                    max: currentYear - 25,
                }),
            });
        }
    } else if (isNaN(Date.parse(userObj.dateOfBirth))) {
        if (process.env.VERBOSITY >= 1) {
            console.error("Invalid dateOfBirth: " + userObj.dateOfBirth);
        }
        return false;
    } else if (typeof userObj.dateOfBirth === "string") {
        userObj.dateOfBirth = new Date(userObj.dateOfBirth);
    }

    const GENDERS = Object.values(Gender).map((value) => value.toString());
    if (userObj.gender === null || userObj.gender === undefined) {
        const pool = [
            GENDERS[0],
            GENDERS[0],
            GENDERS[0],
            GENDERS[0],
            GENDERS[0],
            GENDERS[1],
            GENDERS[1],
            GENDERS[1],
            GENDERS[1],
            GENDERS[1],
            GENDERS[2],
        ];
        userObj.gender = chance.pickone(pool);
    } else if (!GENDERS.includes(userObj.gender)) {
        if (process.env.VERBOSITY >= 1) {
            console.error("Invalid gender: " + userObj.gender);
        }
        return false;
    }

    if (userObj.id === null || userObj.id === undefined) {
        userObj.id = userObj.fullName.toLowerCase().replace(" ", "");
    } else if (!/^[a-zA-Z0-9_]+$/.test(userObj.id)) {
        if (process.env.VERBOSITY >= 1) {
            console.error("Invalid id: " + userObj.id);
        }
        return false;
    }

    if (userObj.password === null || userObj.password === undefined) {
        userObj.password = generateHashedPassword();
    }
    // Check if password is hashed with bcrypt
    else if (!/^\$2[ayb]\$.{56}$/.test(userObj.password)) {
        if (process.env.VERBOSITY >= 1) {
            console.error("Password was not hashed: " + userObj.password);
        }
        return false;
    }

    if (userObj.email === null || userObj.email === undefined) {
        userObj.email = userObj.id + "@example.edu";
    } else if (
        !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(userObj.email)
    ) {
        if (process.env.VERBOSITY >= 1) {
            console.error("Invalid email: " + userObj.email);
        }
        return false;
    }

    if (userObj.phoneNumber === null || userObj.phoneNumber === undefined) {
        userObj.phoneNumber = chance.phone({ formatted: false });
    } else if (!/^\d+$/.test(userObj.phoneNumber)) {
        if (process.env.VERBOSITY >= 1) {
            console.error("Invalid phoneNumber: " + userObj.phoneNumber);
        }
        return false;
    }

    if (userObj.address === null || userObj.address === undefined) {
        userObj.address = chance.address();
    }

    if (userObj.classsId !== "" && userObj.classsId !== undefined) {
        if (
            (
                await pint.find(
                    "classs",
                    { id: true },
                    { id: userObj.classsId },
                    true
                )
            ).length === 0
        ) {
            if (process.env.VERBOSITY >= 1) {
                console.error("classsId not found: " + userObj.classsId);
            }
            return false;
        }
    }

    if (userObj.schoolId !== "" && userObj.schoolId !== undefined) {
        if (
            (
                await pint.find(
                    "school",
                    { id: true },
                    { id: userObj.schoolId },
                    true
                )
            ).length === 0
        ) {
            if (process.env.VERBOSITY >= 1) {
                console.error("schoolId not found: " + userObj.schoolId);
            }
            return false;
        }
    }

    try {
        await prisma.user.create({
            data: userObj,
        });
        if (process.env.VERBOSITY >= 3) {
            console.log("Created user " + userObj.id);
        }
        return true;
    } catch (error) {
        if (process.env.VERBOSITY >= 1) {
            console.error("Failed to create user " + userObj.id + ": " + error);
        }
        return false;
    }
}

export async function createUsers(userObjs = []) {
    if (userObjs.length === 0) {
        if (process.env.VERBOSITY >= 1) {
            console.error("No userObjs provided.");
        }
        return false;
    } else {
        for (const userObj of userObjs) {
            await createUser(userObj);
        }
    }
}

export async function createUsersFromTemplate(userTemplate = {}, numUsers = 1) {
    if (numUsers <= 0) {
        if (process.env.VERBOSITY >= 1) {
            console.error("Invalid numUsers: " + numUsers);
        }
        return false;
    }

    for (let i = 0; i < numUsers; i++) {
        let success = false;
        let retries = 5;

        while (!success && retries > 0) {
            // Create a shallow copy of userTemplate, since createUser() modifies the object
            success = await createUser({ ...userTemplate });
            retries--;
        }
    }
}

export async function createRelative(relativeObj = {}) {
    // Structure of relativeObj (* = required):
    // relativeObj = {
    // 		* name,
    // 		* studentId,
    // 		* relationship,
    // 		phoneNumber,
    // 		email,
    // 		* isPrimary,		// Default: false
    // };

    if (relativeObj.name === null || relativeObj.name === undefined) {
        relativeObj.name = chance.name();
    } else if (!/^[a-zA-Z -']+$/.test(relativeObj.name)) {
        if (process.env.VERBOSITY >= 1) {
            console.error("Invalid name: " + relativeObj.name);
        }
        return false;
    }

    if (
        relativeObj.phoneNumber === null ||
        relativeObj.phoneNumber === undefined
    ) {
        relativeObj.phoneNumber = chance.phone({ formatted: false });
    } else if (!/^[0-9]{10}$/.test(relativeObj.phoneNumber)) {
        if (process.env.VERBOSITY >= 1) {
            console.error("Invalid phoneNumber: " + relativeObj.phoneNumber);
        }
        return false;
    }

    if (relativeObj.email === null || relativeObj.email === undefined) {
        relativeObj.email =
            relativeObj.name.toLowerCase().replace(" ", "") + "@email.com";
    } else if (
        !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
            relativeObj.email
        )
    ) {
        if (process.env.VERBOSITY >= 1) {
            console.error("Invalid email: " + relativeObj.email);
        }
        return false;
    }

    const RELATIONSHIPS = ["MOTHER", "FATHER", "GUARDIAN", "SIBLING"];
    if (
        relativeObj.relationship === null ||
        relativeObj.relationship === undefined
    ) {
        relativeObj.relationship = chance.pickone(RELATIONSHIPS);
    } else if (!RELATIONSHIPS.includes(relativeObj.relationship)) {
        if (process.env.VERBOSITY >= 1) {
            console.error("Invalid relationship: " + relativeObj.relationship);
        }
        return false;
    }

    if (relativeObj.studentId === null || relativeObj.studentId === undefined) {
        const studentIds = await read(
            "user",
            { id: true },
            { accountType: "STUDENT" },
            true
        );
        relativeObj.studentId = chance.pickone(studentIds);
    } else if (
        !(await pint.find(
            "user",
            { id: true },
            { id: relativeObj.studentId },
            false
        ))
    ) {
        if (process.env.VERBOSITY >= 1) {
            console.error("Invalid studentId: " + relativeObj.studentId);
        }
        return false;
    }

    try {
        await prisma.relative.create({
            data: relativeObj,
        });
        if (process.env.VERBOSITY >= 3) {
            console.log(
                "Created relative " +
                    relativeObj.name +
                    " as " +
                    relativeObj.relationship +
                    " of " +
                    relativeObj.studentId
            );
        }
        return true;
    } catch (error) {
        if (process.env.VERBOSITY >= 1) {
            console.error(
                "Failed to create relative of " +
                    relativeObj.studentId +
                    ": " +
                    error
            );
        }
        return false;
    }
}
