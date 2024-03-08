import { PrismaClient } from "@prisma/client";
import Chance from "chance";
import * as pint from "./prisma-interface.js";

const chance = new Chance();
const prisma = new PrismaClient();

export async function createMeetingAttendence(meetingAttendenceObj = {}) {
    // Structure of meetingAttendenceObj:
    // meetingAttendenceObj = {
    //       meetingId String,
    //       userId String,
    //       isPresent bool false,
    // }

    if (
        meetingAttendenceObj.meetingId === "" ||
        meetingAttendenceObj.meetingId === undefined
    ) {
        meetingAttendenceObj.meetingId = chance.pickone(
            await pint.find("meeting", { id: true }, null, true)
        );
    } else if (
        !(await pint.find(
            "meeting",
            { id: true },
            { id: meetingAttendenceObj.meetingId }
        ))
    ) {
        if (process.env.VERBOSITY >= 1) {
            console.error(
                "Invalid meeting ID: " + meetingAttendenceObj.meetingId
            );
        }
        return false;
    }

    if (
        meetingAttendenceObj.userId === "" ||
        meetingAttendenceObj.userId === undefined
    ) {
        // User must not be the meeting's creator
        const creator = await pint.find(
            "meeting",
            { createdById: true },
            { id: meetingAttendenceObj.meetingId }
        );
        meetingAttendenceObj.userId = chance.pickone(
            await pint.find(
                "user",
                { id: true },
                { id: { not: creator } },
                true
            )
        );
    } else if (
        !(await pint.find(
            "user",
            { id: true },
            { id: meetingAttendenceObj.userId }
        ))
    ) {
        if (process.env.VERBOSITY >= 1) {
            console.error("Invalid user ID: " + meetingAttendenceObj.userId);
        }
        return false;
    }

    if (
        meetingAttendenceObj.isPresent === "" ||
        meetingAttendenceObj.isPresent === undefined
    ) {
        meetingAttendenceObj.isPresent = false;
    } else if (typeof meetingAttendenceObj.isPresent !== "boolean") {
        if (process.env.VERBOSITY >= 1) {
            console.error(
                "Invalid isPresent: " + meetingAttendenceObj.isPresent
            );
        }
        return false;
    }

    try {
        await prisma.meetingAttendence.create({
            data: meetingAttendenceObj,
        });
        if (process.env.VERBOSITY >= 3) {
            console.log(
                "Created meetingAttendence for user",
                meetingAttendenceObj.userId,
                "at meetingId",
                meetingAttendenceObj.meetingId
            );
        }
    } catch (error) {
        if (process.env.VERBOSITY >= 1) {
            console.error(
                "Failed to create meetingAttendence for user",
                meetingAttendenceObj.userId,
                "at meetingId",
                meetingAttendenceObj.meetingId,
                ":",
                error
            );
        }
        return false;
    }
}

export async function createMeetingAttendences(meetingAttendenceObjs = []) {
    if (meetingAttendenceObjs.length === 0) {
        for (let i = 0; i < 10; i++) {
            await createMeetingAttendence();
        }
    } else {
        for (const meetingAttendenceObj of meetingAttendenceObjs) {
            await createMeetingAttendence(meetingAttendenceObj);
        }
    }
}

export async function createMeetingsFromTemplate(
    meetingAttendenceTemplate = {},
    numMeetingAttendences = 1
) {
    if (numMeetingAttendences <= 0) {
        if (process.env.VERBOSITY >= 1) {
            console.error(
                "Invalid numMeetingAttendences: " + numMeetingAttendences
            );
        }
        return false;
    }

    for (let i = 0; i < numMeetingAttendences; i++) {
        let success = false;
        let retries = 5;
        while (!success && retries > 0) {
            success = await createMeetingAttendence({
                ...meetingAttendenceTemplate,
            });
            retries--;
        }
    }
}
