import Chance from "chance";
import { PrismaClient } from "@prisma/client";
import * as pint from "./prisma-interface.js";

const chance = new Chance();
const prisma = new PrismaClient();

export async function createSchoolSemesteralSchedule(scheduleObj = {}) {
    // Structure of scheduleObj (all fields are required):
    // scheduleObj = {
    // 		schoolId,
    // 		semesterId,
    // }

    if (
        scheduleObj.semesterId === null ||
        scheduleObj.semesterId === undefined
    ) {
        const semesterIds = await pint.find(
            "semester",
            { id: true },
            null,
            true
        );
        scheduleObj.semesterId = chance.pickone(semesterIds);
    } else if (
        !(await pint.find(
            "semester",
            { id: true },
            { id: scheduleObj.semesterId },
            false
        ))
    ) {
        if (process.env.VERBOSITY >= 1) {
            console.error("semesterId not found: " + scheduleObj.semesterId);
        }
        return false;
    }

    if (scheduleObj.schoolId === null || scheduleObj.schoolId === undefined) {
        // Get all schools that have a schedule for the schedule.semesterId
        const schoolsWithScheduleOnSemesterIds = await pint.find(
            "school",
            { schoolId: true },
            { semesterId: scheduleObj.semesterId },
            true
        );

        // Get all schoolIds that are not already assigned with a schedule for the schedule.semesterId
        const schoolsWithoutScheduleOnSemesterIds = await pint.find(
            "school",
            { id: true },
            { id: { notIn: schoolsWithScheduleOnSemesterIds } },
            true
        );

        if (schoolsWithoutScheduleOnSemesterIds.length === 0) {
            if (process.env.VERBOSITY >= 1) {
                console.error(
                    "Failed to find a school to assign to semesterId " +
                        scheduleObj.semesterId
                );
            }
            return false;
        }

        scheduleObj.schoolId = chance.pickone(schoolWithoutScheduleIds);
    } else if (
        !(await pint.find(
            "school",
            { id: true },
            { id: scheduleObj.schoolId },
            false
        ))
    ) {
        if (process.env.VERBOSITY >= 1) {
            console.error("schoolId not found: " + scheduleObj.schoolId);
        }
        return false;
    }
    // Check if schoolId-semesterId pair already exists
    else if (
        (
            await pint.find(
                "schoolSemesteralSchedule",
                { id: true },
                {
                    schoolId: scheduleObj.schoolId,
                    semesterId: scheduleObj.semesterId,
                },
                true
            )
        ).length > 0
    ) {
        if (process.env.VERBOSITY >= 1) {
            console.error(
                "SQS already exists for " +
                    scheduleObj.schoolId +
                    "@" +
                    scheduleObj.semesterId
            );
        }
        return false;
    }

    try {
        await prisma.schoolSemesteralSchedule.create({
            data: scheduleObj,
        });
        if (process.env.VERBOSITY >= 3) {
            console.log(
                "Created SQS of schoolId " +
                    scheduleObj.schoolId +
                    " for semesterId " +
                    scheduleObj.semesterId
            );
        }
        return true;
    } catch (error) {
        if (process.env.VERBOSITY >= 1) {
            console.error(
                "Failed to create SQS " + scheduleObj.id + ": " + error
            );
        }
        return false;
    }
}

export async function createSchoolSemesteralSchedules(scheduleObjs = []) {
    if (scheduleObjs.length === 0) {
        // Get all schools
        const schoolIds = await pint.find("school", { id: true }, null, true);

        // Get all semesters
        const semesterIds = await pint.find(
            "semester",
            { id: true },
            null,
            true
        );

        // Assign schools to semesters
        for (const schoolId of schoolIds) {
            for (const semesterId of semesterIds) {
                await createSchoolSemesteralSchedule({
                    schoolId: schoolId,
                    semesterId: semesterId,
                });
            }
        }
    } else {
        for (const scheduleObj of scheduleObjs) {
            await createSchoolSemesteralSchedule(scheduleObj);
        }
    }
}
