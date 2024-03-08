import Chance from "chance";
import { PrismaClient } from "@prisma/client";
import * as pint from "./prisma-interface.js";

const chance = new Chance();
const prisma = new PrismaClient();

export async function createTeacherSubjectAssignment(tsaObjs = {}) {
    if (tsaObjs.subjectId === "" || tsaObjs.subjectId === undefined) {
        // Get a random subject
        const subjectIds = await pint.find("subject", { id: true }, null, true);

        if (subjectIds.length === 0) {
            if (process.env.VERBOSITY >= 1) {
                console.error(
                    "Failed to find a subject to assign to teacherId " +
                        tsaObjs.teacherId
                );
            }
            return false;
        } else {
            tsaObjs.subjectId = chance.pickone(subjectIds);
        }
    } else if (
        !(await pint.find(
            "subject",
            { id: true },
            { id: tsaObjs.subjectId },
            false
        ))
    ) {
        if (process.env.VERBOSITY >= 1) {
            console.error("subjectId not found: " + tsaObjs.subjectId);
        }
        return false;
    }

    if (tsaObjs.teacherId === "" || tsaObjs.teacherId === undefined) {
        // Find teachers that are not currently assigned with any subject
        const teacherIds = await pint.find(
            "user",
            { id: true },
            { accountType: "TEACHER" },
            true
        );
        const assignedTeacherIds = await pint.find(
            "teacherSubjectAssignment",
            { teacherId: true },
            { teacherId: { notIn: teacherIds } },
            true
        );

        if (assignedTeacherIds.length === 0) {
            if (process.env.VERBOSITY >= 1) {
                console.error(
                    "Failed to find a teacher to assign to subjectId " +
                        tsaObjs.subjectId
                );
            }
            return false;
        } else {
            tsaObjs.teacherId = chance.pickone(assignedTeacherIds);
        }
    } else if (
        !(await pint.find(
            "user",
            { id: true },
            { id: tsaObjs.teacherId },
            false
        ))
    ) {
        if (process.env.VERBOSITY >= 1) {
            console.error("teacherId not found: " + tsaObjs.teacherId);
        }
        return false;
    }

    try {
        await prisma.teacherSubjectAssignment.create({
            data: tsaObjs,
        });
        if (process.env.VERBOSITY >= 3) {
            console.log(
                "Created TSA for " +
                    tsaObjs.teacherId +
                    ": " +
                    tsaObjs.subjectId
            );
        }
        return true;
    } catch (error) {
        if (process.env.VERBOSITY >= 1) {
            console.error(
                "Failed to create TSA for " + tsaObjs.teacherId + ": " + error
            );
        }
        return false;
    }
}

export async function createTeacherSubjectAssignments(tsaObjs = []) {
    if (tsaObjs.length === 0) {
        // Get all teachers
        const teacherIds = await pint.find(
            "user",
            { id: true },
            { accountType: "TEACHER" },
            true
        );

        // Get all subjects
        const subjectIds = await pint.find("subject", { id: true }, null, true);

        // Assign subjects to teachers
        for (const teacherId of teacherIds) {
            const subjectId = chance.pickone(subjectIds);

            await prisma.teacherSubjectAssignment.create({
                data: {
                    teacherId,
                    subjectId,
                },
            });

            if (process.env.VERBOSITY >= 3) {
                console.log("Created TSA for " + teacherId + ": " + subjectId);
            }
        }

        return true;
    } else {
        for (const tsaObj of tsaObjs) {
            await createTeacherSubjectAssignment(tsaObj);
        }
    }
}

export async function createTeacherSubjectAssignmentsFromTemplate(
    tsaTemplate = {},
    numTsa = 1
) {
    if (numTsa <= 0) {
        if (process.env.VERBOSITY >= 1) {
            console.error("Invalid numTsa: " + numTsa);
        }
        return false;
    }

    for (let i = 0; i < numTsa; i++) {
        let success = false;
        let retries = 5;
        while (!success && retries > 0) {
            success = await createTeacherSubjectAssignment({ ...tsaTemplate });
            retries--;
        }
    }
}
