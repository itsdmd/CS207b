import { PrismaClient } from "@prisma/client";
import * as pint from "./prisma-interface.js";

const prisma = new PrismaClient();

export async function createFormTeacherAssignment(ftaObj = {}) {
    // Structure of formTeacherAssignmentObj (all fields are required):
    // formTeacherAssignmentObj = {
    //      teacherId String,
    //      classsId String,
    //		year Int,
    // }
    if (!ftaObj.teacherId || !ftaObj.classsId || !ftaObj.year) {
        if (process.env.VERBOSITY >= 1) {
            console.error("Invalid formTeacherAssignmentObj: " + ftaObj);
        }
        return false;
    }

    if (!(await pint.find("classs", { id: true }, { id: ftaObj.classsId }))) {
        if (process.env.VERBOSITY >= 1) {
            console.error("classsId " + ftaObj.classsId + " does not exist.");
        }
        return false;
    }

    if (!(await pint.find("user", { id: true }, { id: ftaObj.teacherId }))) {
        if (process.env.VERBOSITY >= 1) {
            console.error("teacherId " + ftaObj.teacherId + " does not exist.");
        }
        return false;
    }

    if (ftaObj.year < 2000 || ftaObj.year > 10000 || isNaN(ftaObj.year)) {
        if (process.env.VERBOSITY >= 1) {
            console.error("Invalid year: " + ftaObj.year);
        }
        return false;
    }

    try {
        await prisma.formTeacherAssignment.create({
            data: ftaObj,
        });
        if (process.env.VERBOSITY >= 3) {
            console.log(
                "Created formTeacherAssignment for teacherId " +
                    ftaObj.teacherId +
                    " and classsId " +
                    ftaObj.classsId +
                    " of year " +
                    ftaObj.year
            );
        }
        return true;
    } catch (err) {
        if (process.env.VERBOSITY >= 1) {
            console.error("Error creating formTeacherAssignment: " + err);
        }
        return false;
    }
}
