import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import Chance from "chance";
const chance = new Chance();

import * as pint from "./prisma-interface.js";
import * as user from "./user.js";
import * as school from "./school.js";
import * as classs from "./classs.js";
import * as meeting from "./meeting.js";
import * as meetingAttendence from "./meetingAttendence.js";
import * as subject from "./subject.js";
import * as tsa from "./teacherSubjectAssignment.js";
import * as uca from "./userClasssAssignment.js";
import * as quarter from "./quarter.js";
import * as room from "./room.js";
import * as ttEntry from "./timetableEntry.js";
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

/* ------------ Clean up ------------ */

await pint.del("meetingAttendence");
await pint.del("meeting");

await pint.del("studentGrade");
await pint.del("gradeType");

await pint.del("timetableEntryAttendence");
await pint.del("timetableEntry");
await pint.del("quarter");

await pint.del("userClasssAssignment");
await pint.del("teacherSubjectAssignment");
await pint.del("subject");
await pint.del("classs");

await pint.del("userSchoolAssignment");
await pint.del("room");
await pint.del("school");

// // await pint.del("relative");
await pint.del("user");

// /* ------------ Populate ------------ */

console.log("Creating users...");
await user.createUsersFromTemplate({
    id: "principal_01",
    accountType: "PRINCIPAL",
});

await subject.populateSubjects();
const subjects = await pint.find("subject", { id: true }, null, true);
for (const subject of subjects) {
    await user.createUser({
        id: subject + "_teacher",
        accountType: "TEACHER",
    });
}

const studentDob = new Date("2010-01-01");
for (let i = 0; i < 10; i++) {
    await user.createUsersFromTemplate({
        id: "student_" + i,
        accountType: "STUDENT",
        dateOfBirth: studentDob,
    });
}
// await populateRelatives();

/* ---------- Create school --------- */
console.log("Creating school...");
await school.createSchool({
    name: "School 01",
    gradeLevels: ["PRIMARY", "MIDDLE", "HIGH"],
});

// Get school ID
const schoolId = (
    await pint.find("school", { id: true }, { name: "School 01" }, true)
)[0];

/* --- Assign principal to school --- */
console.log("Assigning principal to school...");
await prisma.userSchoolAssignment.create({
    data: {
        userId: "principal_01",
        schoolId: schoolId,
    },
});

/* ---- Assign teachers to school --- */
const teacherIds = await pint.find(
    "user",
    { id: true },
    { accountType: "TEACHER" },
    true
);
console.log("Assigning teachers to school...");
for (const teacherId of teacherIds) {
    await prisma.userSchoolAssignment.create({
        data: {
            userId: teacherId,
            schoolId: schoolId,
        },
    });
}

/* ---- Assign students to school --- */
console.log("Assigning students to school...");
const studentIds = await pint.find(
    "user",
    { id: true },
    { accountType: "STUDENT" },
    true
);
for (const studentId of studentIds) {
    await prisma.userSchoolAssignment.create({
        data: {
            userId: studentId,
            schoolId: schoolId,
        },
    });
}

/* ---------- Create rooms ---------- */
console.log("Creating rooms...");
for (let i = 0; i < 3; i++) {
    await room.createRoom({ schoolId: schoolId });
}
const rooms = await pint.find(
    "room",
    { id: true },
    { schoolId: schoolId },
    true
);

/* --------- Create classses -------- */
console.log("Creating classses...");
// Calculate students' grade based on their DoB
const studentClassGrade =
    new Date().getFullYear() - studentDob.getFullYear() - 5;
await classs.createClasss({
    grade: studentClassGrade,
    schoolId: schoolId,
    roomId: chance.pickone(rooms),
});

/* --- Assign subjects to teachers -- */
console.log("Assigning subjects to teachers...");
const subjectIds = await pint.find("subject", { id: true }, null, true);
for (const teacherId of teacherIds) {
    const subjectId = chance.pickone(subjectIds);
    await tsa.createTsa({ teacherId: teacherId, subjectId: subjectId });
}

/* --- Assign teachers to classses --- */
console.log("Assigning teachers to classses...");
const classsIds = await pint.find("classs", { id: true }, null, true);
for (let i = 0; i < teacherIds.length; i++) {
    for (let j = 0; j < classsIds.length; j++) {
        await uca.createUca({
            userId: teacherIds[i],
            classsId: classsIds[j],
        });
    }
}

/* --- Assign students to classes --- */
console.log("Assigning students to classses...");
for (const studentId of studentIds) {
    await uca.createUca({
        userId: studentId,
        classsId: chance.pickone(classsIds),
    });
}

/* --------- Create quarter -------- */
console.log("Creating quarter...");
await quarter.createQuarter({ id: "2024-01" });
const quarterIds = await pint.find("quarter", { id: true }, null, true);

/* ----- Create Timetable entries ---- */
console.log("Creating timetableEntries...");
for (const quarterId of quarterIds) {
    for (let weekOfQuarter = 0; weekOfQuarter < 12; weekOfQuarter++) {
        for (let dayOfWeek = 0; dayOfWeek <= 5; dayOfWeek++) {
            for (const classsId of classsIds) {
                for (
                    let timeSlot = parseInt(
                        process.env.TIMETABLE_TIMESLOT_MIN_INDEX
                    );
                    timeSlot <=
                    parseInt(process.env.TIMETABLE_TIMESLOT_MAX_INDEX);
                    timeSlot++
                ) {
                    await ttEntry.createTimetableEntry({
                        quarterId: quarterId,
                        weekOfQuarter: weekOfQuarter,
                        schoolId: schoolId,
                        classsId: classsId,
                        dayOfWeek: dayOfWeek,
                        timeSlot: timeSlot,
                    });
                }
            }
        }
    }
}
const ttEntryIds = await pint.find("timetableEntry", { id: true }, null, true);

/* --- Create Tt entry attendence --- */
console.log("Creating timetableEntryAttendence...");
for (const tteId of ttEntryIds) {
    const classsId = await pint.find(
        "timetableEntry",
        { classsId: true },
        { id: tteId },
        true
    )[0];
    const studentUcaIds = await pint.find(
        "userClasssAssignment",
        { userId: true },
        { classsId: classsId, userId: { in: studentIds } },
        true
    );
    const teacherUcaIds = await pint.find(
        "userClasssAssignment",
        { userId: true },
        { classsId: classsId, userId: { in: teacherIds } },
        true
    );

    await ttEntry.createTimetableEntryAttendence({
        timetableEntryId: tteId,
        userId: chance.pickone(teacherUcaIds),
    });

    for (const ucaId of studentUcaIds) {
        await ttEntry.createTimetableEntryAttendence({
            timetableEntryId: tteId,
            userId: ucaId,
        });
    }
}

// /* --- Create grades for students --- */
// console.log("Creating default grade types...");
// await gradeType.populateDefaultGradeTypes();
// const gradeTypes = await pint.find("gradeType", { id: true }, null, true);

// console.log("Creating student grades...");
// for (const studentId of studentIds) {
//     const classsId = await pint.find(
//         "user",
//         { classsId: true },
//         { id: studentId },
//         true
//     );
//     for (const subjectId of subjectIds) {
//         const teachersWithSameSubject = await pint.find(
//             "teacherSubjectAssignment",
//             { teacherId: true },
//             { subjectId: subjectId },
//             true
//         );
//         const teachersWithSameSubjectAssignedToClass = await pint.find(
//             "teacherClasssAssignment",
//             { id: true },
//             {
//                 teacherId: { in: teachersWithSameSubject },
//                 classsId: classsId,
//             },
//             true
//         )[0];
//         for (const quarterId of quarterIds) {
//             for (const gradeType of gradeTypes) {
//                 await studentGrade.createStudentGrade({
//                     studentId: studentId,
//                     graderId: teachersWithSameSubjectAssignedToClass,
//                     subjectId: subjectId,
//                     quarterId: quarterId,
//                     typeId: gradeType,
//                 });
//             }
//         }
//     }
// }

// await createMeetingForPrincipals();
// await assignTeachersToMeetings();
