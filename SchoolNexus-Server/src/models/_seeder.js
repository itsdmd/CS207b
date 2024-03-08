import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

import * as pint from "./prisma-interface.js";
import * as user from "./user.js";
import * as school from "./school.js";
import * as classs from "./classs.js";
import * as meeting from "./meeting.js";
import * as meetingAttendence from "./meetingAttendence.js";
import * as subject from "./subject.js";
import * as tsa from "./teacherSubjectAssignment.js";
import * as tca from "./teacherClasssAssignment.js";
import * as quarter from "./quarter.js";
import * as room from "./room.js";
import * as sqs from "./schoolQuarteralSchedule.js";
import * as sentry from "./scheduleEntry.js";
import * as gradeType from "./gradeType.js";
import * as studentGrade from "./studentGrade.js";

import * as dotenv from "dotenv";
dotenv.config(); // Load the environment variables
// console.log(`The connection URL is ${process.env.DATABASE_URL}`)

async function populateRelatives() {
    // Get all students
    const studentIds = await pint.find(
        "user",
        { id: true },
        { accountType: "STUDENT" },
        true
    );

    // For each student, create 3 relatives: 1 father, 1 mother and 1 sibling
    for (const studentId of studentIds) {
        await user.createRelative({
            relationship: "FATHER",
            isPrimary: true,
            studentId: studentId,
        });
        await user.createRelative({
            relationship: "MOTHER",
            studentId: studentId,
        });
        // await user.createRelative({ relationship: "SIBLING", studentId: studentId });
    }
}

async function assignStudentsAndTeachersToClassses() {
    // Each class has 10 students
    // Student must be in the class according to their grade, which is determined by the birthday

    // Get all students
    const studentIds = await pint.find(
        "user",
        { id: true },
        { accountType: "STUDENT" },
        true
    );

    // Assign students to classses
    for (const studentId of studentIds) {
        // Get student's birthday
        const dateOfBirth = new Date(
            await pint.find(
                "user",
                { dateOfBirth: true },
                { id: studentId },
                true
            )
        );

        // Calculate student's grade
        const grade = new Date().getFullYear() - dateOfBirth.getFullYear() - 5;

        // Get classses with the same grade
        const classsIds = await pint.find(
            "classs",
            { id: true },
            { name: { startsWith: grade.toString() } },
            true
        );

        // Pick a classs sequentially, loop until found a classs with less than 20 students
        let selectedId = null;

        for (const indexingId of classsIds) {
            const numOfStudentsQuery = await pint.custom("aggregate", "user", {
                where: { accountType: "STUDENT", classsId: indexingId },
                _count: { id: true },
            });
            if (numOfStudentsQuery["_count"]["id"] < 20) {
                selectedId = indexingId;
                break;
            }
        }

        // Assign student to classs
        if (selectedId !== null) {
            await pint.update("user", "classsId", [selectedId], {
                id: studentId,
            });
        } else {
            if (process.env.VERBOSITY >= 1) {
                console.error(
                    "Failed to assign student " + studentId + " to a classs."
                );
            }
        }
    }

    // Get all teachers
    const teacherIds = await pint.find(
        "user",
        { id: true },
        { accountType: "TEACHER" },
        true
    );
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
            await pint.update("user", "classsId", [selectedId], {
                id: teacherId,
            });
        } else {
            if (process.env.VERBOSITY >= 1) {
                console.error(
                    "Failed to assign teacher " + teacherId + " to a classs."
                );
            }
        }
    }

    // Assign schoolId to all users without classId
    const usersWithoutClasssId = await pint.find(
        "user",
        { id: true },
        { classsId: null },
        true
    );
    const schoolIds = await pint.find("school", { id: true }, null, true);
    for (const userId of usersWithoutClasssId) {
        const schoolId =
            schoolIds[Math.floor(Math.random() * schoolIds.length)];
        await pint.update("user", "schoolId", [schoolId], { id: userId });
    }
}

async function createRoomsForSchools() {
    // Get all schools
    const schoolIds = await pint.find("school", { id: true }, null, true);
    // Assign rooms to schools
    for (const schoolId of schoolIds) {
        for (let i = 0; i < 10; i++) {
            await room.createRoom({ schoolId: schoolId });
        }
    }
}

async function createMeetingForPrincipals() {
    // Get all principals
    const principalIds = await pint.find(
        "user",
        { id: true },
        { accountType: "PRINCIPAL" },
        true
    );

    // For each principal, create a meeting
    for (const id of principalIds) {
        await meeting.createMeeting({ createdById: id });
    }
}

async function assignTeachersToMeetings() {
    // Get all teachers
    const teacherIds = await pint.find(
        "user",
        { id: true },
        { accountType: "TEACHER" },
        true
    );
    // For each teacher, assign to a meeting from the same school
    for (const id of teacherIds) {
        const schoolId = await pint.find(
            "user",
            { schoolId: true },
            { id: id },
            true
        )[0];
        await meetingAttendence.createMeetingAttendence({
            userId: id,
            schoolId: schoolId,
        });
    }
}

async function assignPrincipalToSchools() {
    // Get all principals
    const principalIds = await pint.find(
        "user",
        { id: true },
        { accountType: "PRINCIPAL" },
        true
    );

    const schoolsWithPrincipal = await pint.find(
        "schoolPrincipalAssignment",
        { schoolId: true },
        null,
        true
    );
    const schoolsWithoutPrincipal = await pint.find(
        "school",
        { id: true },
        { id: { notIn: schoolsWithPrincipal } },
        true
    );
    const principalsWithAssignment = await pint.find(
        "schoolPrincipalAssignment",
        { principalId: true },
        null,
        true
    );
    const principalsWithoutAssignment = await pint.find(
        "user",
        { id: true },
        { id: { notIn: principalsWithAssignment } },
        true
    );
    if (principalsWithoutAssignment.length === 0) {
        if (process.env.VERBOSITY >= 1) {
            console.error("No principals without assignment.");
        }
        return false;
    } else if (schoolsWithoutPrincipal.length === 0) {
        if (process.env.VERBOSITY >= 1) {
            console.error("No schools without principal.");
        }
        return false;
    } else {
        for (const schoolId of schoolsWithoutPrincipal) {
            const principalId = principalsWithoutAssignment.pop();
            await prisma.schoolPrincipalAssignment.create({
                data: {
                    principalId: principalId,
                    schoolId: schoolId,
                },
            });
        }
    }
}

/* ------------ Clean up ------------ */

await pint.del("meetingAttendence");
await pint.del("meeting");

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
await pint.del("room");
await pint.del("school");

// // // await pint.del("relative");
await pint.del("user");

// /* ------------ Populate ------------ */

await user.createUsersFromTemplate({ accountType: "PRINCIPAL" }, 5);
await user.createUsersFromTemplate({ accountType: "TEACHER" }, 50);
await user.createUsersFromTemplate({ accountType: "STUDENT" }, 250);
// // await populateRelatives();

await school.createSchoolsFromTemplate({}, 5);
await createRoomsForSchools();
await assignPrincipalToSchools();

await classs.createClassses();
await assignStudentsAndTeachersToClassses();

await subject.populateSubjects();
await tsa.createTeacherSubjectAssignments();
await tca.createTeacherClasssAssignments();

await quarter.createQuarters(2020, 2024);
await sqs.createSchoolQuarteralSchedules();
await sentry.createScheduleEntriesFromTemplate();

await gradeType.populateDefaultGradeTypes();
await studentGrade.createStudentGradesFromTemplate({}, 250);

await createMeetingForPrincipals();
await assignTeachersToMeetings();
