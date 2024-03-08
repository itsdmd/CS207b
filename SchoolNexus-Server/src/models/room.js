import { PrismaClient } from "@prisma/client";
import Chance from "chance";
import * as pint from "./prisma-interface.js";

const chance = new Chance();
const prisma = new PrismaClient();

export async function createRoom(roomObj = {}) {
    // Structure of roomObj:
    // roomObj = {
    //      schoolId String,
    //      name? String,
    //      building? String,
    //      floor Int,
    //      index Int,
    // }

    // Get all school IDs
    if (roomObj.schoolId === "" || roomObj.schoolId === undefined) {
        roomObj.schoolId = chance.pickone(
            await pint.find("school", { id: true }, null, true)
        );
    } else if (
        !(await pint.find("school", { id: true }, { id: roomObj.schoolId }))
    ) {
        if (process.env.VERBOSITY >= 1) {
            console.error("Invalid school ID: " + roomObj.schoolId);
        }
        return false;
    }

    if (roomObj.building === "" || roomObj.building === undefined) {
        roomObj.building = chance.pickone(["A", "B", "C", "D", "E"]);
    } else if (roomObj.building.length > 50) {
        if (process.env.VERBOSITY >= 1) {
            console.error("Building name too long: " + roomObj.building);
        }
        return false;
    }

    if (roomObj.floor === "" || roomObj.floor === undefined) {
        roomObj.floor = chance.integer({ min: 1, max: 5 });
    } else if (
        roomObj.floor < 1 ||
        roomObj.floor > 1000 ||
        isNaN(roomObj.floor)
    ) {
        if (process.env.VERBOSITY >= 1) {
            console.error("Invalid floor number: " + roomObj.floor);
        }
        return false;
    }

    if (roomObj.index === "" || roomObj.index === undefined) {
        roomObj.index = chance.integer({ min: 1, max: 20 });
    } else if (
        roomObj.index < 1 ||
        roomObj.index > 1000 ||
        isNaN(roomObj.index)
    ) {
        if (process.env.VERBOSITY >= 1) {
            console.error("Invalid room index: " + roomObj.index);
        }
        return false;
    }

    if (roomObj.name === "" || roomObj.name === undefined) {
        roomObj.name = roomObj.building + roomObj.floor + "-" + roomObj.index;
    } else if (roomObj.name.length > 100) {
        if (process.env.VERBOSITY >= 1) {
            console.error("Invalid room name: " + roomObj.name);
        }
        return false;
    }

    try {
        await prisma.room.create({
            data: roomObj,
        });
        if (process.env.VERBOSITY >= 3) {
            console.log(
                "Created room " +
                    roomObj.name +
                    " of school " +
                    roomObj.schoolId
            );
        }
        return true;
    } catch (error) {
        if (process.env.VERBOSITY >= 1) {
            console.error("Failed to create room " + roomObj.name + ":", error);
        }
        return false;
    }
}

export async function createRooms(numRooms = 1, roomObj = {}) {
    let rooms = [];
    for (let i = 0; i < numRooms; i++) {
        rooms.push(await createRoom(roomObj));
    }
    return rooms;
}

export async function createRoomsFromTemplate(roomTemplate = {}, numRooms = 1) {
    if (numRooms <= 0) {
        if (process.env.VERBOSITY >= 1) {
            console.error("Invalid numRooms: " + numRooms);
        }
        return false;
    }

    for (let i = 0; i < numRooms; i++) {
        let success = false;
        let retries = 5;
        while (!success && retries > 0) {
            success = await createRoom({ ...roomTemplate });
            retries--;
        }
    }
}
