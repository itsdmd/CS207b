import { PrismaClient } from "@prisma/client";
import * as pint from "./prisma-interface.js";

const prisma = new PrismaClient();

export async function createSchoolQuateralSchedule(scheduleObj = {}) {
	// Structure of scheduleObj (all fields are required):
	// scheduleObj = {
	// 		schoolId,
	// 		quarterId,
	// }

	if (scheduleObj.quarterId === "" || scheduleObj.quarterId === undefined) {
		const quarterIds = await pint.find("quarter", { id: true }, null, true);
		scheduleObj.quarterId = chance.pickone(quarterIds);
	} else if (!(await pint.find("quarter", { id: true }, { id: scheduleObj.quarterId }, false))) {
		console.error("quarterId not found: " + scheduleObj.quarterId);
		return false;
	}

	if (scheduleObj.schoolId === "" || scheduleObj.schoolId === undefined) {
		// Get all schoolIds that are not already assigned to a schedule
		const schoolIds = await pint.find("school", { id: { notIn: {} } }, null, true);
		scheduleObj.schoolId = chance.pickone(schoolIds);
	} else if (!(await pint.find("school", { id: true }, { id: scheduleObj.schoolId }, false))) {
		console.error("schoolId not found: " + scheduleObj.schoolId);
		return false;
	}

	try {
		await prisma.schoolQuateralSchedule.create({
			data: scheduleObj,
		});
		console.log("Created schoolQuateralSchedule " + scheduleObj.schoolId + " " + scheduleObj.quarterId);
		return true;
	} catch (error) {
		console.error("Failed to create schoolQuateralSchedule: " + error);
		return false;
	}
}
