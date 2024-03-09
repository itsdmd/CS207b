import Chance from "chance";
import { PrismaClient } from "@prisma/client";
import * as pint from "./prisma-interface.js";

const chance = new Chance();
const prisma = new PrismaClient();

export async function createTsa(tsaObjs = {}) {
    if (tsaObjs.subjectId === null || tsaObjs.subjectId === undefined) {
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

    if (tsaObjs.teacherId === null || tsaObjs.teacherId === undefined) {
        // Find teachers that are assigned with a subject
        const teachersWithAssignment = await pint.find(
            "teacherSubjectAssignment",
            { teacherId: true },
            null,
            true
        );
        // Get all teachers without subject assignments
        const teachersWithoutAssignment = await pint.find(
            "user",
            { id: true },
            { id: { notIn: teachersWithAssignment }, accountType: "TEACHER" },
            true
        );

        if (teachersWithoutAssignment.length === 0) {
            if (process.env.VERBOSITY >= 1) {
                console.error(
                    "Failed to find a teacher to assign to subjectId " +
                        tsaObjs.subjectId
                );
            }
            return false;
        } else {
            tsaObjs.teacherId = chance.pickone(teachersWithoutAssignment);
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

export async function createTsas(tsaObjs = []) {
    if (tsaObjs.length === 0) {
        // Get all teachers that are assigned with a subject
        const teachersWithAssignment = await pint.find(
            "teacherSubjectAssignment",
            { teacherId: true },
            null,
            true
        );
        // Get all teachers without subject assignments
        const teachersWithoutAssignment = await pint.find(
            "user",
            { id: true },
            { id: { notIn: teachersWithAssignment }, accountType: "TEACHER" },
            true
        );

        if (teachersWithoutAssignment.length === 0) {
            if (process.env.VERBOSITY >= 1) {
                console.error("No teachers without assignment.");
            }
            return true;
        }

        // Assign subjects to teachers
        for (const id of teachersWithoutAssignment) {
            await createTsa({ teacherId: id });
        }

        return true;
    } else {
        for (const obj of tsaObjs) {
            await createTsa(obj);
        }
    }
}

export async function createTsaFromTemplate(tsaTemplate = {}, numTsa = 1) {
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
            success = await createTsa({ ...tsaTemplate });
            retries--;
        }
    }
}
