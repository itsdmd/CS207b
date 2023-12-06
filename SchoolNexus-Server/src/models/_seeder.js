import * as pint from "./prisma-interface.js";
import * as user from "./user.js";
import * as school from "./school.js";
import * as classs from "./classs.js";
import * as subject from "./subject.js";
import * as tsa from "./teacherSubjectAssignment.js";
import * as tca from "./teacherClasssAssignment.js";
import * as quarter from "./quarter.js";
import * as sqs from "./schoolQuarteralSchedule.js";
import * as sentry from "./scheduleEntry.js";
import * as gradeType from "./gradeType.js";
import * as studentGrade from "./studentGrade.js";

async function populateRelatives() {
	// Get all students
	const studentIds = await pint.find("user", { id: true }, { accountType: "STUDENT" }, true);

	// For each student, create 3 relatives: 1 father, 1 mother and 1 sibling
	for (const studentId of studentIds) {
		await user.createRelative({ relationship: "FATHER", isPrimary: true, studentId: studentId });
		await user.createRelative({ relationship: "MOTHER", studentId: studentId });
		// await user.createRelative({ relationship: "SIBLING", studentId: studentId });
	}
}

async function assignStudentsAndTeachersToClassses() {
	// Each class has 10 students and 1 teacher
	// Student must be in the class according to their grade, which is determined by the birthday

	// Get all students
	const studentIds = await pint.find("user", { id: true }, { accountType: "STUDENT" }, true);

	// Get all teachers
	const teacherIds = await pint.find("user", { id: true }, { accountType: "TEACHER" }, true);

	// Assign students to classses
	for (const studentId of studentIds) {
		// Get student's birthday
		const dateOfBirth = new Date(await pint.find("user", { dateOfBirth: true }, { id: studentId }, true));

		// Calculate student's grade
		const grade = new Date().getFullYear() - dateOfBirth.getFullYear() - 5;

		// Get classses with the same grade
		const classsIds = await pint.find("classs", { id: true }, { name: { startsWith: grade.toString() } }, true);

		// Pick a classs sequentially, loop until found a classs with less than 10 students
		let selectedId = null;

		for (const indexingId of classsIds) {
			const numOfStudentsQuery = await pint.custom("aggregate", "user", {
				where: { accountType: "STUDENT", classsId: indexingId },
				_count: { id: true },
			});
			if (numOfStudentsQuery["_count"]["id"] < 10) {
				selectedId = indexingId;
				break;
			}
		}

		// Assign student to classs
		if (selectedId !== null) {
			await pint.update("user", "classsId", [selectedId], { id: studentId });
		} else {
			console.error("Failed to assign student " + studentId + " to a classs.");
		}
	}

	// Get all classses
	const classsIds = await pint.find("classs", { id: true }, null, true);
	// Assign teachers to classses
	for (const teacherId of teacherIds) {
		let selectedId = null;
		// Pick a classs sequentially, loop until found a classs with no teacher
		for (const indexingId of classsIds) {
			const numOfTeachersQuery = await pint.custom("aggregate", "user", {
				where: { accountType: "TEACHER", classsId: indexingId },
				_count: { id: true },
			});
			if (numOfTeachersQuery["_count"]["id"] === 0) {
				selectedId = indexingId;
				break;
			}
		}

		// Assign teacher to classs
		if (selectedId !== null) {
			await pint.update("user", "classsId", [selectedId], { id: teacherId });
		} else {
			console.error("Failed to assign teacher " + teacherId + " to a classs.");
		}
	}

	// Assign schoolId to all users without classId
	const usersWithoutClasssId = await pint.find("user", { id: true }, { classsId: null }, true);
	const schoolIds = await pint.find("school", { id: true }, null, true);
	for (const userId of usersWithoutClasssId) {
		const schoolId = schoolIds[Math.floor(Math.random() * schoolIds.length)];
		await pint.update("user", "schoolId", [schoolId], { id: userId });
	}
}

async function assignClasssesToSchools(maxNumOfClasssesPerSchool = 12) {
	// Get all schools
	const schoolIds = await pint.find("school", { id: true }, null, true);

	// Get all classses
	const classsIds = await pint.find("classs", { id: true }, null, true);

	// Assign classses to schools
	for (const classsId of classsIds) {
		let selectedId = null;
		// Pick a school sequentially, loop until found a school with less than maxNumOfClasssesPerSchool
		for (const indexingId of schoolIds) {
			const numOfClasssesQuery = await pint.custom("aggregate", "classs", {
				where: { schoolId: indexingId },
				_count: { id: true },
			});
			if (numOfClasssesQuery["_count"]["id"] < maxNumOfClasssesPerSchool) {
				selectedId = indexingId;
				break;
			}
		}

		// Assign classs to school
		if (selectedId !== null) {
			await pint.update("classs", "schoolId", [selectedId], { id: classsId });
			return true;
		} else {
			console.error("Failed to assign classs " + classsId + " to a school.");
			return false;
		}
	}
}

async function assignPrincipalToSchools() {
	// Get all principals
	const principalIds = await pint.find("user", { id: true }, { accountType: "PRINCIPAL" }, true);

	// Get all schools
	const schoolIds = await pint.find("school", { id: true }, null, true);

	// Assign principals to schools using schoolPrincipalAssignment table
	// Structure of schoolPrincipalAssignment table:
	// schoolPrincipalAssignment = {
	// 		schoolId,
	// 		principalId,
	// }
	for (const principalId of principalIds) {
		let selectedId = null;
		// Pick a school sequentially, loop until found a school with no principal
		for (const indexingId of schoolIds) {
			const numOfPrincipalsQuery = await pint.custom("aggregate", "schoolPrincipalAssignment", {
				where: { schoolId: indexingId },
				_count: { id: true },
			});
			if (numOfPrincipalsQuery["_count"]["id"] === 0) {
				selectedId = indexingId;
				break;
			}
		}

		// Assign principal to school
		if (selectedId !== null) {
			await pint.custom("create", "schoolPrincipalAssignment", { data: { schoolId: selectedId, principalId: principalId } });
		} else {
			console.error("Failed to assign principal " + principalId + " to a school.");
		}
	}
}

/* ------------ Clean up ------------ */

await pint.del("studentGrade");
await pint.del("gradeType");

await pint.del("scheduleEntry");
await pint.del("schoolQuarteralSchedule");
await pint.del("quarter");

await pint.del("teacherClasssAssignment");
await pint.del("teacherSubjectAssignment");
await pint.del("subject");
await pint.del("classs");

await pint.del("schoolPrincipalAssignment");
await pint.del("school");

// await pint.del("relative");
await pint.del("user");

/* ------------ Populate ------------ */

await user.createUsersFromTemplate({ accountType: "PRINCIPAL" }, 5);
await user.createUsersFromTemplate({ accountType: "TEACHER" }, 50);
await user.createUsersFromTemplate({ accountType: "STUDENT" }, 200);
// await populateRelatives();

await school.createSchoolsFromTemplate({}, 5);
await assignPrincipalToSchools();

await classs.createClassses();
await assignClasssesToSchools();
await assignStudentsAndTeachersToClassses();

await subject.populateSubjects();
await tsa.createTeacherSubjectAssignments();
await tca.createTeacherClasssAssignments();

await quarter.createQuarters(2023, 2024);
await sqs.createSchoolQuarteralSchedules();
await sentry.createScheduleEntriesFromTemplate();

await gradeType.populateDefaultGradeTypes();
await studentGrade.createStudentGradesFromTemplate({}, 200);
