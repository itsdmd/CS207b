import Chance from "chance";
const chance = new Chance();

import * as pint from "./prisma-interface.js";
import * as user from "./user.js";
import * as school from "./school.js";
import * as classroom from "./classroom.js";

async function populateUsers(numOfStudents = 300, numOfTeachers = 50, numOfPrincipals = 5) {
	for (let i = 0; i < numOfStudents; i++) {
		await user.createUser({ accountType: "STUDENT" });
	}

	for (let i = 0; i < numOfTeachers; i++) {
		await user.createUser({ accountType: "TEACHER" });
	}

	for (let i = 0; i < numOfPrincipals; i++) {
		await user.createUser({ accountType: "PRINCIPAL" });
	}
}

async function populateSchools(numOfSchools = 5) {
	for (let i = 0; i < numOfSchools; i++) {
		await school.createSchool();
	}
}

async function populateClassrooms(numOfClassrooms = 50) {
	// If numOfClassrooms >= 12, always create 1 classroom for each grade
	// Else if numOfClassrooms < 12, create 1 classroom for each grade until numOfClassrooms

	if (numOfClassrooms < 12) {
		for (let i = 0; i < numOfClassrooms; i++) {
			await classroom.createClassroom({ name: (i + 1).toString() + "A1" });
		}
	} else if (numOfClassrooms >= 12) {
		for (let i = 0; i < 12; i++) {
			await classroom.createClassroom({ name: (i + 1).toString() + "A1" });
		}

		for (let i = 0; i < numOfClassrooms - 12; i++) {
			await classroom.createClassroom();
		}
	}
}

async function assignStudentsAndTeachersToClassrooms() {
	// Each class has 10 students and 1 teacher
	// Student must be in the class according to their grade, which is determined by the birthday

	// Get all students
	const studentIds = await pint.read("user", { id: true }, { accountType: "STUDENT" }, true);

	// Get all teachers
	const teacherIds = await pint.read("user", { id: true }, { accountType: "TEACHER" }, true);

	// Assign students to classrooms
	for (const studentId of studentIds) {
		// Get student's birthday
		const dateOfBirth = new Date(await pint.read("user", { dateOfBirth: true }, { id: studentId }, true));

		// Calculate student's grade
		const grade = new Date().getFullYear() - dateOfBirth.getFullYear() - 5;

		// Get classrooms with the same grade
		const classroomIds = await pint.read("classroom", { id: true }, { name: { startsWith: grade.toString() } }, true);

		// Pick a classroom sequentially, loop until found a classroom with less than 10 students
		let selectedId = null;

		for (const indexingId of classroomIds) {
			const numOfStudentsQuery = await pint.custom("aggregate", "user", {
				where: { accountType: "STUDENT", classroomId: indexingId },
				_count: { id: true },
			});
			if (numOfStudentsQuery["_count"]["id"] < 10) {
				selectedId = indexingId;
				break;
			}
		}

		// Assign student to classroom
		if (selectedId !== null) {
			await pint.update("user", "classroomId", [selectedId], { id: studentId });
		} else {
			console.error("Failed to assign student " + studentId + " to a classroom.");
		}
	}

	// Get all classrooms
	const classroomIds = await pint.read("classroom", { id: true }, null, true);
	// Assign teachers to classrooms
	for (const teacherId of teacherIds) {
		let selectedId = null;
		// Pick a classroom sequentially, loop until found a classroom with no teacher
		for (const indexingId of classroomIds) {
			const numOfTeachersQuery = await pint.custom("aggregate", "user", {
				where: { accountType: "TEACHER", classroomId: indexingId },
				_count: { id: true },
			});
			if (numOfTeachersQuery["_count"]["id"] === 0) {
				selectedId = indexingId;
				break;
			}
		}

		// Assign teacher to classroom
		if (selectedId !== null) {
			await pint.update("user", "classroomId", [selectedId], { id: teacherId });
		} else {
			console.error("Failed to assign teacher " + teacherId + " to a classroom.");
		}
	}
}

async function assignClassroomsToSchools(maxNumOfClassroomsPerSchool = 10) {
	// Get all schools
	const schoolIds = await pint.read("school", { id: true }, null, true);

	// Get all classrooms
	const classroomIds = await pint.read("classroom", { id: true }, null, true);

	// Assign classrooms to schools
	for (const classroomId of classroomIds) {
		let selectedId = null;
		// Pick a school sequentially, loop until found a school with less than maxNumOfClassroomsPerSchool
		for (const indexingId of schoolIds) {
			const numOfClassroomsQuery = await pint.custom("aggregate", "classroom", {
				where: { schoolId: indexingId },
				_count: { id: true },
			});
			if (numOfClassroomsQuery["_count"]["id"] < maxNumOfClassroomsPerSchool) {
				selectedId = indexingId;
				break;
			}
		}

		// Assign classroom to school
		if (selectedId !== null) {
			await pint.update("classroom", "schoolId", [selectedId], { id: classroomId });
			return true;
		} else {
			console.error("Failed to assign classroom " + classroomId + " to a school.");
			return false;
		}
	}
}

async function assignPrincipalToSchools() {
	// Get all principals
	const principalIds = await pint.read("user", { id: true }, { accountType: "PRINCIPAL" }, true);

	// Get all schools
	const schoolIds = await pint.read("school", { id: true }, null, true);

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

async function assignSubjectToTeachers() {
	const SUBJECTS = ["MATHS", "LITERATURE", "PHYSICS", "CHEMISTRY", "BIOLOGY", "GEOGRAPHY", "HISTORY", "FOREIGN_LANGUAGE"];

	// Get all teachers
	const teacherIds = await pint.read("user", { id: true }, { accountType: "TEACHER" }, true);

	// Assign subjects to teachers
	for (const teacherId of teacherIds) {
		// Pick 3 random subjects
		const subject = chance.pickone(SUBJECTS);
		await pint.custom("create", "teacherSubjectAssignment", { data: { teacherId: teacherId, subject: subject } });
	}
}

// await pint.del("teacherSubjectAssignment");
await pint.del("schoolPrincipalAssignment");
// await pint.del("classroom");
// await pint.del("school");
// await pint.del("user");

// await populateUsers();
// await populateSchools();
// await populateClassrooms();

// await assignStudentsAndTeachersToClassrooms();
// await assignClassroomsToSchools();
await assignPrincipalToSchools();
// await assignSubjectToTeachers();
