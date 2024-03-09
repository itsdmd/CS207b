import Chance from "chance";
import { PrismaClient } from "@prisma/client";
import * as pint from "./prisma-interface.js";

const chance = new Chance();
const prisma = new PrismaClient();

export async function createSchoolQuarteralSchedule(scheduleObj = {}) {
    // Structure of scheduleObj (all fields are required):
    // scheduleObj = {
    // 		schoolId,
    // 		quarterId,
    // }

    if (scheduleObj.quarterId === null || scheduleObj.quarterId === undefined) {
        const quarterIds = await pint.find("quarter", { id: true }, null, true);
        scheduleObj.quarterId = chance.pickone(quarterIds);
    } else if (
        !(await pint.find(
            "quarter",
            { id: true },
            { id: scheduleObj.quarterId },
            false
        ))
    ) {
        if (process.env.VERBOSITY >= 1) {
            console.error("quarterId not found: " + scheduleObj.quarterId);
        }
        return false;
    }

    if (scheduleObj.schoolId === null || scheduleObj.schoolId === undefined) {
        // Get all schools that have a schedule for the schedule.quarterId
        const schoolsWithScheduleOnQuarterIds = await pint.find(
            "school",
            { schoolId: true },
            { quarterId: scheduleObj.quarterId },
            true
        );

        // Get all schoolIds that are not already assigned with a schedule for the schedule.quarterId
        const schoolsWithoutScheduleOnQuarterIds = await pint.find(
            "school",
            { id: true },
            { id: { notIn: schoolsWithScheduleOnQuarterIds } },
            true
        );

        if (schoolsWithoutScheduleOnQuarterIds.length === 0) {
            if (process.env.VERBOSITY >= 1) {
                console.error(
                    "Failed to find a school to assign to quarterId " +
                        scheduleObj.quarterId
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
    // Check if schoolId-quarterId pair already exists
    else if (
        (
            await pint.find(
                "schoolQuarteralSchedule",
                { id: true },
                {
                    schoolId: scheduleObj.schoolId,
                    quarterId: scheduleObj.quarterId,
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
                    scheduleObj.quarterId
            );
        }
        return false;
    }

    try {
        await prisma.schoolQuarteralSchedule.create({
            data: scheduleObj,
        });
        if (process.env.VERBOSITY >= 3) {
            console.log(
                "Created SQS of schoolId " +
                    scheduleObj.schoolId +
                    " for quarterId " +
                    scheduleObj.quarterId
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

export async function createSchoolQuarteralSchedules(scheduleObjs = []) {
    if (scheduleObjs.length === 0) {
        // Get all schools
        const schoolIds = await pint.find("school", { id: true }, null, true);

        // Get all quarters
        const quarterIds = await pint.find("quarter", { id: true }, null, true);

        // Assign schools to quarters
        for (const schoolId of schoolIds) {
            for (const quarterId of quarterIds) {
                await createSchoolQuarteralSchedule({
                    schoolId: schoolId,
                    quarterId: quarterId,
                });
            }
        }
    } else {
        for (const scheduleObj of scheduleObjs) {
            await createSchoolQuarteralSchedule(scheduleObj);
        }
    }
}
