import { PrismaClient } from "@prisma/client";
import Chance from "chance";
import * as pint from "./prisma-interface.js";

const chance = new Chance();
const prisma = new PrismaClient();

async function generateRandomClasssName(schoolId) {
	// Generate random classs name with format: <gradeLevel's grade><A-D><1-10>
	const gradeLevels = chance.pickone(await pint.find("school", { gradeLevels: true }, { id: schoolId }, true));
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

export async function createClasss(classsObj = {}) {
	// Structure of classsObj (all fields are required):
	// classsObj = {
	// 		name,
	// 		schoolId,
	// };
	if (classsObj.schoolId === "" || classsObj.schoolId === undefined) {
		const schoolIds = await pint.find("school", { id: true }, null, true);
		classsObj.schoolId = chance.pickone(schoolIds);
	} else if ((await pint.find("school", { id: true }, { id: classsObj.schoolId }, true)).length === 0) {
		console.error("schoolId not found: " + classsObj.schoolId);
		return false;
	}

	if (classsObj.name === "" || classsObj.name === undefined) {
		classsObj.name = await generateRandomClasssName(classsObj.schoolId);
	} else if ((await pint.find("classs", { id: true }, { name: classsObj.name, schoolId: classsObj.schoolId }, true).length) > 0) {
		console.error("classs with name " + classsObj.name + " already exists at school " + classsObj.schoolId);
		return false;
	}

	try {
		await prisma.classs.create({
			data: classsObj,
		});

		console.log("Created classs " + classsObj.name + " from " + classsObj.schoolId);
		return true;
	} catch (error) {
		console.error("Failed to create classs: " + error);
		return false;
	}
}
