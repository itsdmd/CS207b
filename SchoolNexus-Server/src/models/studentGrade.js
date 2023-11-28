import { PrismaClient } from "@prisma/client";
import Chance from "chance";
import * as pint from "./prisma-interface.js";

const chance = new Chance();
const prisma = new PrismaClient();

export async function createStudentGrade(studentGradeObj = {}) {
	// Structure of studentGradeObj (all fields are required):
	// studentGradeObj = {
	// 		studentId,
	// 		graderId,
	//      quarterId,
	//      subjectId,
	//      typeId,
	//      value,
	// }
}

export async function createStudentGrades(studentGradeObj = {}) {
	// Get all students
	const studentIds = await pint.find("user", { id: true }, { accountType: "STUDENT" }, true);

	// Get all quarters
	const quarterIds = await pint.find("quarter", { id: true }, null, true);

	// Get all subjects
	const subjects = await pint.find("subject", { name: true }, null, true);

	// For each student, create a grade for each grade type for each subject for each quarter, each grade has value between 0.0 and 10.0, and is graded by 1 teacher.
	for (const studentId of studentIds) {
		// Get all grade types that has null schoolId field or schoolId field that matches the student's schoolId
		const types = await pint.find(
			"gradeType",
			{ name: true },
			{ OR: [{ schoolId: null }, { schoolId: (await pint.find("user", { schoolId: true }, { id: studentId }, false)).schoolId }] },
			true
		);

		for (const quarterId of quarterIds) {
			for (const subject of subjects) {
				// Join user and teacherSubjectAssignment table to get all teachers that was assigned to the subject at the student's school
				const graderIds = await pint.find(
					"user",
					{ id: true },
					{
						where: {
							AND: [
								{ accountType: "TEACHER" },
								{ schoolId: (await pint.find("user", { schoolId: true }, { id: studentId }, false)).schoolId },
								{ teacherSubjectAssignments: { some: { subject: subject } } },
							],
						},
					},
					true
				);

				for (const type of types) {
					try {
						await prisma.studentGrade.create({
							data: {
								studentId: studentId,
								graderId: chance.pickone(graderIds),
								quarterId: quarterId,
								subject: subject,
								grade: chance.floating({ min: 0, max: 10, fixed: 1 }),
								type: type,
							},
						});

						console.log(
							"Created student grade for student " + studentId + " for quarter " + quarterId + " for subject " + subject + " for type " + type
						);
						return true;
					} catch (error) {
						console.error("Failed to create grade of subject " + studentGradeObj.subject + " for " + studentGradeObj.studentId + ": " + error);
						return false;
					}
				}
			}
		}
	}
}
