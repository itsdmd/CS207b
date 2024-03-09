import { PrismaClient } from "@prisma/client";
import Chance from "chance";
import * as pint from "./prisma-interface.js";

const chance = new Chance();
const prisma = new PrismaClient();

export async function createMeeting(meetingObj = {}) {
    // Structure of meetingObj:
    // meetingObj = {
    //      createdById,
    //      title,
    //      startTime,
    //      endTime,
    //      roomId,
    //      notes?,
    //      attendees[]
    //  };

    let schoolId = "";
    // Get all school IDs
    if (schoolId === null || schoolId === undefined) {
        schoolId = chance.pickone(
            await pint.find("school", { id: true }, null, true)
        );
    } else if (!(await pint.find("school", { id: true }, { id: schoolId }))) {
        if (process.env.VERBOSITY >= 1) {
            console.error("Invalid school ID: " + schoolId);
        }
        return false;
    }

    // Get school's principal
    if (
        meetingObj.createdById === null ||
        meetingObj.createdById === undefined
    ) {
        try {
            meetingObj.createdById = chance.pickone(
                await pint.find(
                    "SchoolPrincipalAssignment",
                    { principalId: true },
                    { schoolId: schoolId },
                    true
                )
            );
        } catch (error) {
            if (process.env.VERBOSITY >= 1) {
                console.error(
                    "Failed to get principal ID for school " + schoolId + ":",
                    error
                );
            }
            return false;
        }
    } else if (
        !(await pint.find(
            "SchoolPrincipalAssignment",
            { principalId: true },
            { schoolId: schoolId }
        ))
    ) {
        if (process.env.VERBOSITY >= 1) {
            console.error("Invalid principal ID: " + meetingObj.createdById);
        }
        return false;
    }

    if (meetingObj.title === null || meetingObj.title === undefined) {
        const principalName = await pint.find(
            "User",
            { fullName: true },
            { id: meetingObj.createdById },
            true
        );
        meetingObj.title = "Generic meeting, hosted by " + principalName;
    } else if (meetingObj.title.length > 100) {
        if (process.env.VERBOSITY >= 1) {
            console.error("Invalid meeting title: " + meetingObj.title);
        }
        return false;
    }

    if (meetingObj.startTime === null || meetingObj.startTime === undefined) {
        meetingObj.startTime = chance.date({ year: new Date().getFullYear() });
        meetingObj.startTime.setHours(chance.integer({ min: 8, max: 16 }));
        meetingObj.startTime.setMinutes(chance.pickone([0, 15, 30, 45]));
    } else if (!(meetingObj.startTime instanceof Date)) {
        if (process.env.VERBOSITY >= 1) {
            console.error("Invalid start time: " + meetingObj.startTime);
        }
        return false;
    }

    if (meetingObj.endTime === null || meetingObj.endTime === undefined) {
        meetingObj.endTime = new Date(meetingObj.startTime);
        meetingObj.endTime.setHours(meetingObj.endTime.getHours() + 1);
    } else if (!(meetingObj.endTime instanceof Date)) {
        if (process.env.VERBOSITY >= 1) {
            console.error("Invalid end time: " + meetingObj.endTime);
        }
        return false;
    }

    if (meetingObj.startTime > meetingObj.endTime) {
        if (process.env.VERBOSITY >= 1) {
            console.error(
                "Start time is after end time: " +
                    meetingObj.startTime +
                    " > " +
                    meetingObj.endTime
            );
        }
        return false;
    }

    // Get all rooms in school
    if (meetingObj.roomId === null || meetingObj.roomId === undefined) {
        meetingObj.roomId = chance.pickone(
            await pint.find("room", { id: true }, { schoolId: schoolId }, true)
        );
    } else if (
        (await pint.find("room", { id: true }, { id: meetingObj.roomId }, true))
            .length === 0
    ) {
        if (process.env.VERBOSITY >= 1) {
            console.error("Invalid room ID: " + meetingObj.roomId);
        }
        return false;
    }

    if (meetingObj.notes === undefined) {
        meetingObj.notes = "";
    } else if (meetingObj.notes.length > 1000) {
        if (process.env.VERBOSITY >= 1) {
            console.error("Invalid notes: " + meetingObj.notes);
        }
        return false;
    }

    try {
        await prisma.meeting.create({
            data: meetingObj,
        });
        if (process.env.VERBOSITY >= 3) {
            console.log("Created meeting " + meetingObj.title);
        }
        return true;
    } catch (error) {
        if (process.env.VERBOSITY >= 1) {
            console.error(
                "Failed to create meeting " + meetingObj.title + ":",
                error
            );
        }
        return false;
    }
}

export async function createMeetings(meetingObjs = []) {
    if (meetingObjs.length === 0) {
        for (let i = 0; i < 10; i++) {
            await createMeeting();
        }
    } else {
        for (const meetingObj of meetingObjs) {
            await createMeeting(meetingObj);
        }
    }
}

export async function createMeetingsFromTemplate(
    meetingTemplate = {},
    numMeetings = 1
) {
    if (numMeetings <= 0) {
        if (process.env.VERBOSITY >= 1) {
            console.error("Invalid numMeetings: " + numMeetings);
        }
        return false;
    }

    for (let i = 0; i < numMeetings; i++) {
        let success = false;
        let retries = 5;
        while (!success && retries > 0) {
            success = await createMeeting({ ...meetingTemplate });
            retries--;
        }
    }
}
