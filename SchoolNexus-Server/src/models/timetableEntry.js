import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";

const prisma = new PrismaClient();
dotenv.config();

import * as pint from "./prisma-interface.js";

const TIMESLOT_MIN = process.env.TIMETABLE_TIMESLOT_MIN_INDEX;
const TIMESLOT_MAX = process.env.TIMETABLE_TIMESLOT_MAX_INDEX;

export async function createTimetableEntry(timetableEntryObj = {}) {
    // Structure of timetableEntryObj:
    // timetableEntryObj = {
    //     quarterId String,
    //     weekOfQuarter Int,
    //     schoolId String,
    //     classsId String,
    //     dayOfWeek Int,
    //     timeSlot Int,
    //     attendenceId String?,
    // }

    if (
        timetableEntryObj.quarterId === null ||
        timetableEntryObj.quarterId === undefined
    ) {
        if (process.env.VERBOSITY >= 1) {
            console.error("quarterId is empty");
        }
        return false;
    } else if (
        !(await pint.find(
            "quarter",
            { id: true },
            { id: timetableEntryObj.quarterId },
            true
        ))
    ) {
        if (process.env.VERBOSITY >= 1) {
            console.error(
                "quarterId not found: " + timetableEntryObj.quarterId
            );
        }
        return false;
    }

    if (
        timetableEntryObj.weekOfQuarter === null ||
        timetableEntryObj.weekOfQuarter === undefined ||
        isNaN(timetableEntryObj.weekOfQuarter) ||
        timetableEntryObj.weekOfQuarter < 1 ||
        timetableEntryObj.weekOfQuarter > 52
    ) {
        if (process.env.VERBOSITY >= 1) {
            console.error("weekOfQuarter is invalid");
        }
        return false;
    }

    if (
        timetableEntryObj.schoolId === null ||
        timetableEntryObj.schoolId === undefined
    ) {
        if (process.env.VERBOSITY >= 1) {
            console.error("schoolId is empty");
        }
        return false;
    } else if (
        !(await pint.find(
            "school",
            { id: true },
            { id: timetableEntryObj.schoolId },
            true
        ))
    ) {
        if (process.env.VERBOSITY >= 1) {
            console.error("schoolId not found: " + timetableEntryObj.schoolId);
        }
        return false;
    }

    if (
        timetableEntryObj.classsId === null ||
        timetableEntryObj.classsId === undefined
    ) {
        if (process.env.VERBOSITY >= 1) {
            console.error("classsId is empty");
        }
        return false;
    } else if (
        !(await pint.find(
            "classs",
            { id: true },
            { id: timetableEntryObj.classsId },
            true
        ))
    ) {
        if (process.env.VERBOSITY >= 1) {
            console.error("classsId not found: " + timetableEntryObj.classsId);
        }
        return false;
    }

    if (
        timetableEntryObj.dayOfWeek === null ||
        timetableEntryObj.dayOfWeek === undefined ||
        isNaN(timetableEntryObj.dayOfWeek)
    ) {
        if (process.env.VERBOSITY >= 1) {
            console.error("dayOfWeek is invalid");
        }
        return false;
    } else if (
        timetableEntryObj.dayOfWeek < 0 ||
        timetableEntryObj.dayOfWeek > 6
    ) {
        if (process.env.VERBOSITY >= 1) {
            console.error("Invalid dayOfWeek:", timetableEntryObj.dayOfWeek);
        }
        return false;
    }

    if (
        timetableEntryObj.timeSlot === null ||
        timetableEntryObj.timeSlot === undefined ||
        isNaN(timetableEntryObj.timeSlot)
    ) {
        if (process.env.VERBOSITY >= 1) {
            console.error("timeSlot is invalid");
        }
        return false;
    } else if (
        timetableEntryObj.timeSlot < TIMESLOT_MIN ||
        timetableEntryObj.timeSlot > TIMESLOT_MAX
    ) {
        if (process.env.VERBOSITY >= 1) {
            console.error(
                "Invalid timeSlot:",
                timetableEntryObj.timeSlot + ". Value must be between",
                TIMESLOT_MIN,
                "and",
                TIMESLOT_MAX,
                "(inclusive)"
            );
        }
        return false;
    }

    // Create timetable entry
    try {
        await prisma.timetableEntry.create({
            data: timetableEntryObj,
        });

        if (process.env.VERBOSITY >= 1) {
            console.log(
                "Created timetable entry on quarterId " +
                    timetableEntryObj.quarterId +
                    " on weekOfQuarter " +
                    timetableEntryObj.weekOfQuarter +
                    " for classsId " +
                    timetableEntryObj.classsId +
                    " of school " +
                    timetableEntryObj.schoolId +
                    " on dayOfWeek " +
                    timetableEntryObj.dayOfWeek +
                    " at timeSlot " +
                    timetableEntryObj.timeSlot
            );
        }
        return true;
    } catch (error) {
        if (process.env.VERBOSITY >= 1) {
            console.error(
                "Failed to create timetable entry on quarterId " +
                    timetableEntryObj.quarterId +
                    " on weekOfQuarter " +
                    timetableEntryObj.weekOfQuarter +
                    " for classsId " +
                    timetableEntryObj.classsId +
                    " of school " +
                    timetableEntryObj.schoolId +
                    " on dayOfWeek " +
                    timetableEntryObj.dayOfWeek +
                    " at timeSlot " +
                    timetableEntryObj.timeSlot +
                    ":" +
                    error
            );
        }
        return false;
    }
}

export async function createTimetableEntries(timetableEntryObjs = []) {
    if (timetableEntryObjs.length === 0) {
        if (process.env.VERBOSITY >= 1) {
            console.error("timetableEntryObjs is empty");
        }
        return false;
    }

    for (const timetableEntryObj of timetableEntryObjs) {
        await createTimetableEntry(timetableEntryObj);
    }
}

export async function createTimetableEntryAttendence(teaObj = {}) {
    // Structure of timetableEntryAttendenceObj:
    // timetableEntryAttendenceObj = {
    //     timetableEntryId String,
    //     userId String,
    //     isPresent Boolean,
    // }

    if (
        teaObj.timetableEntryId === null ||
        teaObj.timetableEntryId === undefined
    ) {
        if (process.env.VERBOSITY >= 1) {
            console.error("timetableEntryId is empty");
        }
        return false;
    } else if (
        !(await pint.find(
            "timetableEntry",
            { id: true },
            { id: teaObj.timetableEntryId },
            true
        ))
    ) {
        if (process.env.VERBOSITY >= 1) {
            console.error(
                "timetableEntryId not found: " + teaObj.timetableEntryId
            );
        }
        return false;
    }

    if (teaObj.userId === null || teaObj.userId === undefined) {
        if (process.env.VERBOSITY >= 1) {
            console.error("userId is empty");
        }
        return false;
    } else if (
        !(await pint.find("user", { id: true }, { id: teaObj.userId }, true))
    ) {
        if (process.env.VERBOSITY >= 1) {
            console.error("userId not found: " + teaObj.userId);
        }
        return false;
    }

    if (teaObj.isPresent === null || teaObj.isPresent === undefined) {
        teaObj.isPresent = false;
    } else if (typeof teaObj.isPresent !== "boolean") {
        if (process.env.VERBOSITY >= 1) {
            console.error("Invalid isPresent:", teaObj.isPresent);
        }
        return false;
    }

    // Create timetable entry attendence
    try {
        await prisma.timetableEntryAttendence.create({
            data: teaObj,
        });

        if (process.env.VERBOSITY >= 1) {
            console.log(
                "Created timetable entry attendence on timetableEntryId " +
                    teaObj.timetableEntryId +
                    " for userId " +
                    teaObj.userId +
                    " with isPresent " +
                    teaObj.isPresent
            );
        }
        return true;
    } catch (error) {
        if (process.env.VERBOSITY >= 1) {
            console.error(
                "Failed to create timetable entry attendence on timetableEntryId " +
                    teaObj.timetableEntryId +
                    " for userId " +
                    teaObj.userId +
                    " with isPresent " +
                    teaObj.isPresent +
                    ":" +
                    error
            );
        }
        return false;
    }
}
