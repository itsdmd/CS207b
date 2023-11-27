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
	// 		* fullName,
	// 		* dateOfBirth,
	// 		* gender,
	// 		* accountType,
	// 		username,
	// 		password,
	// 		email,
	// 		phoneNumber,
	// 		address,
	// 		classsId,
	// 		schoolId,
	// };
	/* #endregion */

	if (userObj.fullName === "" || userObj.fullName === undefined) {
		userObj.fullName = chance.name();
	}
	// Check if name contains only letters, spaces, hyphens, and single quotes
	else if (!/^[a-zA-Z -']+$/.test(userObj.fullName)) {
		console.error("Invalid fullName: " + userObj.fullName);
		return false;
	} else {
		userObj.fullName = userObj.fullName.trim();
	}

	const ACCOUNT_TYPES = Object.values(AccountType).map((value) => value.toString());
	if (userObj.accountType === "" || userObj.accountType === undefined) {
		const pool = ["STUDENT", "STUDENT", "STUDENT", "TEACHER", "TEACHER", "PRINCIPAL"];
		userObj.accountType = chance.pickone(pool);
	} else if (!ACCOUNT_TYPES.includes(userObj.accountType)) {
		console.error("Invalid account type: " + userObj.accountType);
		return false;
	}

	if (userObj.dateOfBirth === "" || userObj.dateOfBirth === undefined) {
		// Birth year range is calculated based on the current year and the account type.
		const currentYear = new Date().getFullYear();

		// Students must be between 6 and 15 years old.
		if (userObj.accountType === "STUDENT") {
			userObj.dateOfBirth = chance.birthday({ string: false, american: false, year: chance.year({ min: currentYear - 15, max: currentYear - 6 }) });
		}

		// Teachers must be between 25 and 65 years old.
		else if (userObj.accountType === "TEACHER") {
			userObj.dateOfBirth = chance.birthday({ string: false, american: false, year: chance.year({ min: currentYear - 65, max: currentYear - 25 }) });
		}

		// Principals must be between 30 and 70 years old.
		else if (userObj.accountType === "PRINCIPAL") {
			userObj.dateOfBirth = chance.birthday({ string: false, american: false, year: chance.year({ min: currentYear - 70, max: currentYear - 30 }) });
		}
	} else if (isNaN(Date.parse(userObj.dateOfBirth))) {
		console.error("Invalid dateOfBirth: " + userObj.dateOfBirth);
		return false;
	} else if (typeof userObj.dateOfBirth === "string") {
		userObj.dateOfBirth = new Date(userObj.dateOfBirth);
	}

	const GENDERS = Object.values(Gender).map((value) => value.toString());
	if (userObj.gender === "" || userObj.gender === undefined) {
		const pool = [GENDERS[0], GENDERS[0], GENDERS[0], GENDERS[0], GENDERS[0], GENDERS[1], GENDERS[1], GENDERS[1], GENDERS[1], GENDERS[1], GENDERS[2]];
		userObj.gender = chance.pickone(pool);
	} else if (!GENDERS.includes(userObj.gender)) {
		console.error("Invalid gender: " + userObj.gender);
		return false;
	}

	if (userObj.username === "" || userObj.username === undefined) {
		userObj.username = userObj.fullName.toLowerCase().replace(" ", "");
	} else if (!/^[a-zA-Z0-9_]+$/.test(userObj.username)) {
		console.error("Invalid username: " + userObj.username);
		return false;
	}

	if (userObj.password === "" || userObj.password === undefined) {
		userObj.password = generateHashedPassword();
	}

	if (userObj.email === "" || userObj.email === undefined) {
		userObj.email = userObj.username + "@example.edu";
	} else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(userObj.email)) {
		console.error("Invalid email: " + userObj.email);
		return false;
	}

	if (userObj.phoneNumber === "" || userObj.phoneNumber === undefined) {
		userObj.phoneNumber = chance.phone({ formatted: false });
	} else if (!/^\d+$/.test(userObj.phoneNumber)) {
		console.error("Invalid phoneNumber: " + userObj.phoneNumber);
		return false;
	}

	if (userObj.address === "" || userObj.address === undefined) {
		userObj.address = chance.address();
	}

	if (userObj.classsId !== "" && userObj.classsId !== undefined) {
		if ((await pint.find("classs", { id: true }, { id: userObj.classsId }, true)).length === 0) {
			console.error("classsId not found: " + userObj.classsId);
			return false;
		}
	}

	if (userObj.schoolId !== "" && userObj.schoolId !== undefined) {
		if ((await pint.find("school", { id: true }, { id: userObj.schoolId }, true)).length === 0) {
			console.error("schoolId not found: " + userObj.schoolId);
			return false;
		}
	}

	try {
		await prisma.user.create({
			data: userObj,
		});
		console.log("Created user " + userObj.username);
		return true;
	} catch (error) {
		console.error("Failed to create user: " + error);
		return false;
	}
}

export async function createUsers(userObjs = [{}]) {
	for (const userObj of userObjs) {
		try {
			createUser(userObj);
		} catch (error) {
			continue;
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

	if (relativeObj.name === "" || relativeObj.name === undefined) {
		relativeObj.name = chance.name();
	} else if (!/^[a-zA-Z -']+$/.test(relativeObj.name)) {
		console.error("Invalid name: " + relativeObj.name);
		return false;
	}

	if (relativeObj.phoneNumber === "" || relativeObj.phoneNumber === undefined) {
		relativeObj.phoneNumber = chance.phone({ formatted: false });
	} else if (!/^[0-9]{10}$/.test(relativeObj.phoneNumber)) {
		console.error("Invalid phoneNumber: " + relativeObj.phoneNumber);
		return false;
	}

	if (relativeObj.email === "" || relativeObj.email === undefined) {
		relativeObj.email = relativeObj.name.toLowerCase().replace(" ", "") + "@email.com";
	} else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(relativeObj.email)) {
		console.error("Invalid email: " + relativeObj.email);
		return false;
	}

	const RELATIONSHIPS = ["MOTHER", "FATHER", "GUARDIAN", "SIBLING"];
	if (relativeObj.relationship === "" || relativeObj.relationship === undefined) {
		relativeObj.relationship = chance.pickone(RELATIONSHIPS);
	} else if (!RELATIONSHIPS.includes(relativeObj.relationship)) {
		console.error("Invalid relationship: " + relativeObj.relationship);
		return false;
	}

	if (relativeObj.studentId === "" || relativeObj.studentId === undefined) {
		const studentIds = await read("user", { id: true }, { accountType: "STUDENT" }, true);
		relativeObj.studentId = chance.pickone(studentIds);
	} else if (!(await pint.find("user", { id: true }, { id: relativeObj.studentId }, false))) {
		console.error("Invalid studentId: " + relativeObj.studentId);
		return false;
	}

	try {
		await prisma.relative.create({
			data: relativeObj,
		});
		console.log("Created relative " + relativeObj.name + " as " + relativeObj.relationship + " of " + relativeObj.studentId);
		return true;
	} catch (error) {
		console.error("Failed to create relative: " + error);
		return false;
	}
}
