import Chance from "chance";
import { PrismaClient } from "@prisma/client";
import * as pint from "./prisma-interface.js";

const chance = new Chance();
const prisma = new PrismaClient();

export async function createScheduleEntry(scheduleEntryObj = {}) {
	// Structure of scheduleEntryObj:
	// scheduleEntryObj = {
	//     * scheduleId,
	//     * timeSlot,
	//     tcaId
	// }

	if (scheduleEntryObj.tcaId === "" || scheduleEntryObj.tcaId === undefined) {
		// Get all TCAs
		const tcaIds = await pint.find("teacherClasssAssignment", { id: true }, null, true);

		if (tcaIds.length === 0) {
			console.error("Failed to find a TCA to assign to scheduleEntry");
			return false;
		} else {
			scheduleEntryObj.tcaId = chance.pickone(tcaIds);
		}
	}

	if (scheduleEntryObj.scheduleId === "" || scheduleEntryObj.scheduleId === undefined) {
		// Get the schoolId of the teacher assigned to the TCA
		const teacherId = await pint.find("teacherClasssAssignment", { teacherId: true }, { id: scheduleEntryObj.tcaId }, true)[0];
		const schoolId = await pint.find("user", { schoolId: true }, { id: teacherId }, true)[0];
		// Get the scheduleIds of the school
		const scheduleIds = await pint.find("schoolQuarteralSchedule", { id: true }, { schoolId }, true);

		let success = false;
		let retries = 5;
		while (!success && retries > 0) {
			const scheduleId = chance.pickone(scheduleIds);

			if (scheduleEntryObj.dayOfWeek === "" || scheduleEntryObj.dayOfWeek === undefined) {
				scheduleEntryObj.dayOfWeek = chance.integer({ min: 1, max: 5 });
			} else if (scheduleEntryObj.dayOfWeek < 1 || scheduleEntryObj.dayOfWeek > 7) {
				console.error("Invalid dayOfWeek");
				return false;
			}

			if (scheduleEntryObj.timeSlot === "" || scheduleEntryObj.timeSlot === undefined) {
				scheduleEntryObj.timeSlot = chance.integer({ min: 1, max: 8 });
			} else if (scheduleEntryObj.timeSlot < 1 || scheduleEntryObj.timeSlot > 8) {
				console.error("Invalid timeSlot");
				return false;
			}

			// Get all tcaId with the selected scheduleId, dayOfWeek, and timeSlot
			const sameDowTsTcaIds = await pint.find(
				"scheduleEntry",
				{ tcaId: true },
				{ scheduleId, dayOfWeek: scheduleEntryObj.dayOfWeek, timeSlot: scheduleEntryObj.timeSlot },
				true
			);

			// Get the teacherIds assigned to those TCAs
			const sameDowTsTeacherIds = await pint.find("teacherClasssAssignment", { teacherId: true }, { id: { in: sameDowTsTcaIds } }, true);

			// Check if the teacher of current tcaId is already in the sameDowTsTeacherIds
			if (sameDowTsTeacherIds.length > 0) {
				if (sameDowTsTeacherIds.includes(teacherId) === true) {
					console.error("Teacher already has a schedule entry at the same time");
					retries--;
					continue;
				}
			}

			// Check if the current tcaId is already in the sameDowTsTcaIds
			if (sameDowTsTcaIds.length > 0) {
				if (sameDowTsTcaIds.includes(scheduleEntryObj.tcaId)) {
					retries--;
					continue;
				} else {
					scheduleEntryObj.scheduleId = scheduleId;
					success = true;
				}
			} else if (sameDowTsTcaIds.length === 0) {
				scheduleEntryObj.scheduleId = scheduleId;
				success = true;
			}
		}
	} else if ((await pint.find("schoolQuarteralSchedule", { id: true }, { id: scheduleEntryObj.scheduleId }, true).length) === 0) {
		console.error("Invalid scheduleId");
		return false;
	}

	if (scheduleEntryObj.dayOfWeek === "" || scheduleEntryObj.dayOfWeek === undefined) {
		scheduleEntryObj.dayOfWeek = chance.integer({ min: 1, max: 5 });
	} else if (scheduleEntryObj.dayOfWeek < 1 || scheduleEntryObj.dayOfWeek > 7) {
		console.error("Invalid dayOfWeek");
		return false;
	}

	if (scheduleEntryObj.timeSlot === "" || scheduleEntryObj.timeSlot === undefined) {
		scheduleEntryObj.timeSlot = chance.integer({ min: 1, max: 8 });
	} else if (scheduleEntryObj.timeSlot < 1 || scheduleEntryObj.timeSlot > 8) {
		console.error("Invalid timeSlot");
		return false;
	}

	// Check if the schedule entry already exists
	if (
		(await pint.find(
			"scheduleEntry",
			{ id: true },
			{ scheduleId: scheduleEntryObj.scheduleId, dayOfWeek: scheduleEntryObj.dayOfWeek, timeSlot: scheduleEntryObj.timeSlot },
			true
		).length) > 0
	) {
		console.error("Schedule entry already exists");
		return false;
	}

	// Create schedule entry
	try {
		await prisma.scheduleEntry.create({
			data: {
				scheduleId: scheduleEntryObj.scheduleId,
				dayOfWeek: scheduleEntryObj.dayOfWeek,
				timeSlot: scheduleEntryObj.timeSlot,
				tcaId: scheduleEntryObj.tcaId,
			},
		});

		console.log("Created schedule entry " + scheduleEntryObj.scheduleId + " for TCA " + scheduleEntryObj.tcaId);
		return true;
	} catch (error) {
		console.error("Failed to create schedule entry:", error);
		return false;
	}
}

export async function createScheduleEntries(scheduleEntryObjs = []) {
	if (scheduleEntryObjs.length === 0) {
		console.error("scheduleEntryObjs is empty");
		return false;
	}

	for (const scheduleEntryObj of scheduleEntryObjs) {
		await createScheduleEntry(scheduleEntryObj);
	}
}

export async function createScheduleEntriesFromTemplate(scheduleEntryTemplate = {}, numOfScheduleEntries = 1) {
	for (let i = 0; i < numOfScheduleEntries; i++) {
		let success = false;
		let retries = 5;
		while (!success && retries > 0) {
			success = await createScheduleEntry({ ...scheduleEntryTemplate });
			retries--;
		}
	}
}
