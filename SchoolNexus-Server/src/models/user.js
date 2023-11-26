import { PrismaClient } from "@prisma/client";
import Chance from "chance";
import { generateHashedPassword } from "../functions/password.js";

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

	const ACCOUNT_TYPES = ["STUDENT", "TEACHER", "PRINCIPAL"];
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

	const GENDERS = ["MALE", "FEMALE", "OTHER"];
	if (userObj.gender === "" || userObj.gender === undefined) {
		const pool = ["MALE", "MALE", "MALE", "MALE", "MALE", "FEMALE", "FEMALE", "FEMALE", "FEMALE", "FEMALE", "OTHER"];
		userObj.gender = chance.pickone(pool);
	} else if (!GENDERS.includes(userObj.gender)) {
		console.error("Invalid gender: " + userObj.gender);
		return false;
	}

	if (userObj.username === "" || userObj.username === undefined) {
		userObj.username = userObj.fullName.toLowerCase().replace(" ", "");
	}

	if (userObj.password === "" || userObj.password === undefined) {
		userObj.password = generateHashedPassword();
	}

	if (userObj.email === "" || userObj.email === undefined) {
		userObj.email = userObj.username + "@example.edu";
	}

	if (userObj.phoneNumber === "" || userObj.phoneNumber === undefined) {
		userObj.phoneNumber = chance.phone({ formatted: false });
	}

	if (userObj.address === "" || userObj.address === undefined) {
		userObj.address = chance.address();
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

export async function createUsers(userObjs) {
	for (const userObj of userObjs) {
		try {
			createUser(userObj);
		} catch (error) {
			continue;
		}
	}
}
