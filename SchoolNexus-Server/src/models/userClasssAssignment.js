import { PrismaClient } from "@prisma/client";
import * as pint from "./prisma-interface.js";

const prisma = new PrismaClient();

export async function createUca(tcaObj = {}) {
    // Structure of userClasssAssignmentObj:
    // userClasssAssignmentObj = {
    // 		userId String,
    // 		classsId String,
    // };

    if (tcaObj.classsId === null || tcaObj.classsId === undefined) {
        if (process.env.VERBOSITY >= 1) {
            console.error("classsId is empty");
        }
        return false;
    } else if (
        !(await pint.find(
            "classs",
            { id: true },
            { id: tcaObj.classsId },
            true
        ))
    ) {
        if (process.env.VERBOSITY >= 1) {
            console.error("classsId not found: " + tcaObj.classsId);
        }
        return false;
    }

    if (tcaObj.userId === null || tcaObj.userId === undefined) {
        if (process.env.VERBOSITY >= 1) {
            console.error("userId is empty");
        }
        return false;
    } else if (
        !(await pint.find("user", { id: true }, { id: tcaObj.userId }, true))
    ) {
        if (process.env.VERBOSITY >= 1) {
            console.error("userId not found: " + tcaObj.userId);
        }
        return false;
    }

    try {
        await prisma.userClasssAssignment.create({
            data: tcaObj,
        });

        if (process.env.VERBOSITY >= 2) {
            console.log(
                "Created UCA of user",
                tcaObj.userId,
                "and class",
                tcaObj.classsId
            );
        }

        return true;
    } catch (error) {
        if (process.env.VERBOSITY >= 1) {
            console.error(
                "Failed to create UCA for " + tcaObj.userId + ": " + error
            );
        }
        return false;
    }
}

export async function createTcas(tcaObjs = []) {
    if (tcaObjs.length === 0) {
        if (process.env.VERBOSITY >= 1) {
            console.error("tcaObjs is empty");
        }
        return false;
    } else {
        for (const obj of tcaObjs) {
            await createUca(obj);
        }
    }
}
