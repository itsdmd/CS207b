import { PrismaClient } from "@prisma/client";
import Chance from "chance";
import * as pint from "./prisma-interface.js";

const chance = new Chance();
const prisma = new PrismaClient();

export async function createTeacherClasssAssignment(tcaObj = {}) {
	// Structure of teacherClasssAssignmentObj (all fields are required):
	// teacherClasssAssignmentObj = {
	// 		teacherId,
	// 		classsId,
	// };

	if (tcaObj.classsId === "" || tcaObj.classsId === undefined) {
		// Find classes with form teachers
		const classsWithFormTeacherIds = await pint.find("classs", { id: true }, { members: { some: { accountType: "TEACHER" } } }, true);

		// Exclude classes with form teachers from selection pool
		const classsIds = await pint.find("classs", { id: true }, { members: { notIn: classsWithFormTeacherIds } }, true);

		// If no class found, return false
		if (classsIds.length === 0) {
			console.error("Failed to find a class to assign to teacherId " + tcaObj.teacherId);
			return false;
		}

		tcaObj.classsId = chance.pickone(classsIds);
	} else if ((await pint.find("classs", { id: true }, { id: tcaObj.classsId }, true).length) === 0) {
		console.error("classsId not found: " + tcaObj.classsId);
		return false;
	}

	// Get current subjects taught by teachers currently assigned to this class
	const currentTeachers = pint.find("teacherClasssAssignment", { teacherId: true }, { classsId: tcaObj.classsId }, true);
	const currentSubjects = [];

	if (currentTeachers.length > 0) {
		for (const teacherId of currentTeachers) {
			currentSubjects.push((await pint.find("teacherSubjectAssignment", { teacherId: true }, { teacherId: teacherId }, true))[0]);
		}
	}

	if (tcaObj.teacherId === "" || tcaObj.teacherId === undefined) {
		try {
			// Find teachers in the same school as this class
			const teacherIds = await pint.find(
				"user",
				{ id: true },
				{ schoolId: (await prisma.classs.findUnique({ where: { id: tcaObj.classsId } })).schoolId },
				true
			);

			// ... and not currently assigned to this class
			for (const teacherId of teacherIds) {
				if ((await pint.find("teacherClasssAssignment", { id: true }, { teacherId: teacherId, classsId: tcaObj.classsId }, true)).length > 0) {
					teacherIds.splice(teacherIds.indexOf(teacherId), 1);
				}
			}

			// ... and not teaching subjects already taught by teachers currently assigned to this class
			for (const teacherId of teacherIds) {
				if (
					(await pint.find("teacherSubjectAssignment", { id: true }, { teacherId: teacherId, subjectId: { in: currentSubjects } }, true)).length > 0
				) {
					teacherIds.splice(teacherIds.indexOf(teacherId), 1);
				}
			}

			tcaObj.teacherId = chance.pickone(teacherIds).id;
		} catch (error) {
			if (teacherIds.length === 0) {
				console.error("Failed to find a teacher to assign to classsId " + tcaObj.classsId + ". Error: " + error);
				return false;
			}
		}
	} else if ((await pint.find("user", { id: true }, { id: tcaObj.teacherId }, true).length) === 0) {
		console.error("teacherId not found: " + tcaObj.teacherId);
		return false;
	} else {
		// Check if teacher is already assigned to this class
		if (
			await prisma.teacherClasssAssignment.findFirst({
				where: {
					classsId: tcaObj.classsId,
					teacherId: tcaObj.teacherId,
				},
			})
		) {
			console.error("teacherId " + tcaObj.teacherId + " is already assigned to classsId " + tcaObj.classsId);
			return false;
		}

		// or is teaching a subject already taught by another teacher currently assigned to this class (currentSubjects)
		else if ((await pint.find("teacherSubjectAssignment", { id: true }, { id: tcaObj.teacherId, subjectId: { in: currentSubjects } }, true)).length > 0) {
			console.error(
				"teacherId " +
					tcaObj.teacherId +
					" is teaching a subject that already taught by another teacher currently assigned to classsId " +
					tcaObj.classsId
			);
			return false;
		}

		// or is not in the same school as this class
		else if (
			await prisma.user.findFirst({
				where: {
					id: tcaObj.teacherId,
					schoolId: (await prisma.classs.findUnique({ where: { id: tcaObj.classsId } })).schoolId,
				},
			})
		) {
			console.error("teacherId " + tcaObj.teacherId + " is not in the same school as classsId " + tcaObj.classsId);
			return false;
		}
	}

	try {
		await prisma.teacherClasssAssignment.create({
			data: tcaObj,
		});

		console.log("Created TCA " + tcaObj.teacherId + " from " + tcaObj.classsId);
		return true;
	} catch (error) {
		console.error("Failed to create TCA for " + tcaObj.teacherId + ": " + error);
		return false;
	}
}

export async function createTeacherClasssAssignments(tcaObjs = []) {
	if (tcaObjs.length === 0) {
		// Get all classes that has a teacher assigned to it (i.e. form teacher)
		const classsWithFormTeacherIds = await pint.find("classs", { id: true }, { members: { some: { accountType: "TEACHER" } } }, true);

		const formTeachers = [];

		if (classsWithFormTeacherIds.length === 0) {
			console.error("No classes with form teachers.");
		} else {
			// Assign the form teachers to their respective classes
			for (const classsId of classsWithFormTeacherIds) {
				const formTeacherIds = await pint.find("user", { id: true }, { classsId: classsId, accountType: "TEACHER" }, true);
				for (const teacherId of formTeacherIds) {
					const status = await createTeacherClasssAssignment({ teacherId: teacherId, classsId: classsId });

					if (status) {
						formTeachers.push(teacherId);
					}
				}
			}
		}

		// Get the remaining teachers
		const teacherIds = await pint.find("user", { id: true }, { accountType: "TEACHER", id: { notIn: formTeachers } }, true);

		if (teacherIds.length === 0) {
			console.error("No teachers to assign to classes.");
			return false;
		}

		// Assign the remaining teachers to random classes
		for (const teacherId of teacherIds) {
			let success = false;
			let retries = 0;
			while (!success && retries < 10) {
				success = await createTeacherClasssAssignment({ teacherId: teacherId });
				retries++;
			}
		}
	} else {
		for (const tcaObj of tcaObjs) {
			await createTeacherClasssAssignment(tcaObj);
		}
	}
}
