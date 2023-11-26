import { PrismaClient } from "@prisma/client";
import Chance from "chance";
const chance = new Chance();

const prisma = new PrismaClient();

function randomizedGradeLevels() {
	const GRADE_LEVELS = ["PRIMARY", "MIDDLE", "HIGH"];

	const gradeLevels = [];
	switch (chance.natural({ min: 1, max: 3 })) {
		case 1:
			gradeLevels.push(chance.pickone(GRADE_LEVELS));
			break;
		case 2:
			const gl_1 = chance.pickone([0, 1]);
			gradeLevels.push(GRADE_LEVELS[gl_1]);
			gradeLevels.push(GRADE_LEVELS[gl_1 + 1]);
			break;
		case 3:
			gradeLevels.push(...GRADE_LEVELS);
			break;
		default:
			break;
	}

	return gradeLevels;
}

export async function createSchool(schoolObj = {}) {
	// Structure of schoolObj (all fields are required):
	// schoolObj = {
	// 		name,
	// 		address,
	// 		isPublic,
	// 		gradeLevels,
	// };

	if (schoolObj.gradeLevels === "" || schoolObj.gradeLevels === undefined) {
		schoolObj.gradeLevels = randomizedGradeLevels();
	}

	if (schoolObj.name === "" || schoolObj.name === undefined) {
		const word_1 = chance.city();
		const word_2 =
			schoolObj.gradeLevels.length > 1
				? "School System"
				: schoolObj.gradeLevels[0][0] + schoolObj.gradeLevels[0].slice(1).toString().toLowerCase() + " School";

		schoolObj.name = word_1 + " " + word_2;
	}

	if (schoolObj.address === "" || schoolObj.address === undefined) {
		schoolObj.address = chance.address();
	}

	if (schoolObj.isPublic === "" || schoolObj.isPublic === undefined) {
		schoolObj.isPublic = chance.bool();
	}

	try {
		await prisma.school.create({
			data: schoolObj,
		});
	} catch (error) {
		console.error("Failed to create school:", error);
		return false;
	}

	console.log("Created school " + schoolObj.name);
	return true;
}
