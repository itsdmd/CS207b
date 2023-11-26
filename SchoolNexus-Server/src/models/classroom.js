import { PrismaClient } from "@prisma/client";
import Chance from "chance";
import * as pint from "./prisma-interface.js";

const chance = new Chance();
const prisma = new PrismaClient();

async function generateRandomClassroomName(schoolId) {
	// Generate random classroom name with format: <gradeLevel's grade><A-D><1-10>
	const gradeLevels = chance.pickone(await pint.read("school", { gradeLevels: true }, { id: schoolId }, true));
	let gradePool = [];

	if (gradeLevels.includes("PRIMARY")) {
		gradePool.push("1", "2", "3", "4", "5");
	}
	if (gradeLevels.includes("MIDDLE")) {
		gradePool.push("6", "7", "8");
	}
	if (gradeLevels.includes("HIGH")) {
		gradePool.push("9", "10", "11", "12");
	}

	const grade = chance.pickone(gradePool);
	const letter = chance.character({ casing: "upper", pool: "ABCD" });
	const number = chance.natural({ min: 1, max: 10 }).toString();

	return grade + letter + number;
}

export async function createClassroom(classroomObj = {}) {
	// Structure of classroomObj (all fields are required):
	// classroomObj = {
	// 		name,
	// 		schoolId,
	// };
	if (classroomObj.schoolId === "" || classroomObj.schoolId === undefined) {
		const schoolIds = await pint.read("school", { id: true }, null, true);
		classroomObj.schoolId = chance.pickone(schoolIds);
	}

	if (classroomObj.name === "" || classroomObj.name === undefined) {
		classroomObj.name = await generateRandomClassroomName(classroomObj.schoolId);
	}

	try {
		await prisma.classroom.create({
			data: classroomObj,
		});

		console.log("Created classroom " + classroomObj.name + " from " + classroomObj.schoolId);
		return true;
	} catch (error) {
		console.error("Failed to create classroom: " + error);
		return false;
	}
}
