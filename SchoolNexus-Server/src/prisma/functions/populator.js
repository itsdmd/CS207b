import Chance from "chance";
const chance = new Chance();

import * as bops from "../models/basic-operations.js";
import * as user from "../models/user.js";
import * as school from "../models/school.js";
import * as classroom from "../models/classroom.js";

async function populateUsers(numOfStudents = 500, numOfTeachers = 50, numOfPrincipals = 5) {
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
	for (let i = 0; i < numOfClassrooms; i++) {
		await classroom.createClassroom();
	}
}

async function assignStudentsAndTeachersToClassrooms() {
	// Each class has 10 students and 1 teacher
	// Student must be in the class according to their grade, which is determined by the birthday

	// Get all students
	const studentIds = await bops.read("user", { id: true }, { accountType: "STUDENT" }, true);

	// Get all teachers
	const teacherIds = await bops.read("user", { id: true }, { accountType: "TEACHER" }, true);

	// Assign students to classrooms
	for (const studentId of studentIds) {
		// Get student's birthday
		const dateOfBirth = new Date(await bops.read("user", { dateOfBirth: true }, { id: studentId }, true));

		// Calculate student's grade
		const grade = new Date().getFullYear() - dateOfBirth.getFullYear() - 5;

		// Get classrooms with the same grade
		const classroomIds = await bops.read("classroom", { id: true }, { name: { startsWith: grade.toString() } }, true);

		// Pick a classroom sequentially, loop until found a classroom with less than 10 students
		let selectedId = null;

		for (const indexingId of classroomIds) {
			const numOfStudentsQuery = await bops.other("aggregate", "user", {
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
			await bops.update("user", "classroomId", [selectedId], { id: studentId });
		} else {
			console.error("Failed to assign student " + studentId + " to a classroom.");
		}
	}

	// Assign teachers to classrooms
	for (const teacherId of teacherIds) {
		// Get all classrooms
		const classroomIds = await bops.read("classroom", { id: true }, null, true);

		let selectedId = null;

		// Pick a classroom sequentially, loop until found a classroom with no teacher
		for (const indexingId of classroomIds) {
			const numOfTeachersQuery = await bops.other("aggregate", "user", {
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
			await bops.update("user", "classroomId", [selectedId], { id: teacherId });
		} else {
			console.error("Failed to assign teacher " + teacherId + " to a classroom.");
		}
	}
}

async function assignClassroomsToSchools() {
	// Get all schools
	const schoolIds = await bops.read("school", { id: true }, null, true);

	// Get all classrooms
	const classroomIds = await bops.read("classroom", { id: true }, null, true);

	// Assign classrooms to schools
	for (const classroomId of classroomIds) {
		let selectedId = null;
		// Pick a school sequentially, loop until found a school with less than 10 classrooms
		for (const indexingId of schoolIds) {
			const numOfClassroomsQuery = await bops.other("aggregate", "classroom", {
				where: { schoolId: indexingId },
				_count: { id: true },
			});
			if (numOfClassroomsQuery["_count"]["id"] < 10) {
				selectedId = indexingId;
				break;
			}
		}

		// Assign classroom to school
		if (selectedId !== null) {
			await bops.update("classroom", "schoolId", [selectedId], { id: classroomId });
			return true;
		} else {
			console.error("Failed to assign classroom " + classroomId + " to a school.");
			return false;
		}
	}
}

// await bops.del("classroom");
// await bops.del("school");
// await bops.del("user");

// await populateUsers();
// await populateSchools();
// await populateClassrooms();

// await assignStudentsAndTeachersToClassrooms();
// await assignClassroomsToSchools();
