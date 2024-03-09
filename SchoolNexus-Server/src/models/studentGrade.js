import { PrismaClient } from "@prisma/client";
import * as pint from "./prisma-interface.js";

const prisma = new PrismaClient();

export async function createStudentGrade(studentGradeObj = {}) {
    // Structure of studentGradeObj (all fields are required):
    // studentGradeObj = {
    // 		studentId String,
    // 		graderId String,
    //      semesterId String,
    //      typeId String,
    //      value Float,
    // }

    if (
        !studentGradeObj.studentId ||
        !studentGradeObj.graderId ||
        !studentGradeObj.semesterId ||
        !studentGradeObj.typeId ||
        !studentGradeObj.value
    ) {
        if (process.env.VERBOSITY >= 1) {
            console.error("Invalid studentGradeObj: " + studentGradeObj);
        }
        return false;
    }

    try {
        const studentGrade = await prisma.studentGrade.create({
            data: studentGradeObj,
        });
        if (process.env.VERBOSITY >= 3) {
            console.log(
                "Created studentGrade for studentId " +
                    studentGradeObj.studentId +
                    " by graderId " +
                    studentGradeObj.graderId +
                    " on semesterId " +
                    studentGradeObj.semesterId +
                    " of type " +
                    studentGradeObj.typeId +
                    " with value " +
                    studentGradeObj.value
            );
        }
        return true;
    } catch (err) {
        if (process.env.VERBOSITY >= 1) {
            console.error("Error creating studentGrade: " + err);
        }
        return false;
    }
}

export async function createStudentGrades(studentGradeObjs = []) {
    if (studentGradeObjs.length === 0) {
        if (process.env.VERBOSITY >= 1) {
            console.error("Invalid studentGradeObjs: " + studentGradeObjs);
        }
        return false;
    } else {
        for (const studentGradeObj of studentGradeObjs) {
            try {
                const studentGrade = await pint.create(
                    "studentGrade",
                    studentGradeObj
                );
                if (process.env.VERBOSITY >= 3) {
                    console.log("Created studentGrade: " + studentGrade);
                }

                continue;
            } catch (err) {
                if (process.env.VERBOSITY >= 1) {
                    console.error("Error creating studentGrade: " + err);
                }
                continue;
            }
        }
        return true;
    }
}
