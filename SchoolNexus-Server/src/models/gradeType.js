import { PrismaClient } from "@prisma/client";
import * as pint from "./prisma-interface.js";

const prisma = new PrismaClient();

export async function createGradeType(gradeTypeObj = {}) {
	// Structure of gradeTypeObj:
	// gradeTypeObj = {
	// 	    * name,
	//      shortName,
	//      * multiplier,
	//      schoolId,
	// }

	if (gradeTypeObj.name === null || gradeTypeObj.name === undefined) {
		console.error("Name is required");
		return false;
	} else if (gradeTypeObj.multiplier === null || gradeTypeObj.multiplier === undefined) {
		console.error("Multiplier is required");
		return false;
	}

	// Use title case of name as shortName
	if (gradeTypeObj.shortName === null || gradeTypeObj.shortName === undefined) {
		gradeTypeObj.shortName = gradeTypeObj.name.toLowerCase();
		gradeTypeObj.shortName = gradeTypeObj.shortName.charAt(0).toUpperCase() + gradeTypeObj.shortName.slice(1);
	}

	if (gradeTypeObj.schoolId === undefined) {
		gradeTypeObj.schoolId = null;
	}

	// Check if shoolId-name combination already exists
	if ((await pint.find("gradeType", { id: true }, { schoolId: gradeTypeObj.schoolId, name: gradeTypeObj.name }, true)).length > 0) {
		console.error("Grade type " + gradeTypeObj.name + " for schoolId " + gradeTypeObj.schoolId + " already exists");
		return false;
	}

	try {
		await prisma.gradeType.create({ data: gradeTypeObj });

		console.log("Created grade type " + gradeTypeObj.name);
		return true;
	} catch (err) {
		console.error("Failed to create grade type " + gradeTypeObj.name + ": " + err);
		return false;
	}
}

export async function createGradeTypes(gradeTypeObjs = []) {
	for (const gradeTypeObj of gradeTypeObjs) {
		let success = false;
		let retries = 10;

		while (retries > 0) {
			success = await createGradeType(gradeTypeObj);

			if (success) {
				break;
			} else {
				retries--;
			}
		}
	}

	return success;
}

export async function populateDefaultGradeTypes() {
	const TYPES_SHORT = ["QUIZ", "TEST", "EXAM"];
	const TYPES_FULL = ["Quiz", "Test", "Exam"];
	const TYPES_MULTIPLIER = [0.5, 1, 2];

	for (let i = 0; i < TYPES_SHORT.length; i++) {
		const gradeTypeObj = { shortName: TYPES_SHORT[i], name: TYPES_FULL[i], multiplier: TYPES_MULTIPLIER[i] };

		await createGradeType(gradeTypeObj);
	}
}
