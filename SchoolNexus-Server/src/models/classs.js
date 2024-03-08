import { PrismaClient } from "@prisma/client";
import Chance from "chance";
import * as pint from "./prisma-interface.js";

const chance = new Chance();
const prisma = new PrismaClient();

export async function generateGradePool(gradeLevels) {
    let gradePool = [];

    if (gradeLevels.includes("PRIMARY")) {
        gradePool.push("1", "2", "3", "4", "5");
    }
    if (gradeLevels.includes("MIDDLE")) {
        gradePool.push("6", "7", "8", "9");
    }
    if (gradeLevels.includes("HIGH")) {
        gradePool.push("10", "11", "12");
    }

    return gradePool;
}

export async function generateRandomClasssName(schoolId) {
    // Generate random classs name with format: <gradeLevel's grade><A-D><1-10>
    const gradeLevels = chance.pickone(
        await pint.find("school", { gradeLevels: true }, { id: schoolId }, true)
    );
    let gradePool = await generateGradePool(gradeLevels);

    const grade = chance.pickone(gradePool);
    const letter = chance.character({ casing: "upper", pool: "ABCD" });
    const number = chance.natural({ min: 1, max: 10 }).toString();

    return grade + letter + number;
}

export async function generateSequentialClasssName(schoolId, grade = null) {
    if (schoolId === "" || schoolId === undefined) {
        // Get all schools
        const schoolIds = await pint.find("school", { id: true }, null, true);

        if (schoolIds.length === 0) {
            if (process.env.VERBOSITY >= 1) {
                console.error("No schools exist.");
            }
            return false;
        }

        schoolId = chance.pickone(schoolIds);
    } else if (
        !(await pint.find("school", { id: true }, { id: schoolId }, false))
    ) {
        if (process.env.VERBOSITY >= 1) {
            console.error("schoolId not found: " + schoolId);
        }
        return false;
    }

    // Get school's gradeLevels
    const gradeLevels = await pint.find(
        "school",
        { gradeLevels: true },
        { id: schoolId },
        true
    );
    const gradePool = await generateGradePool(gradeLevels);

    // Check if grade is valid
    if (grade !== null && !gradePool.includes(grade)) {
        if (process.env.VERBOSITY >= 1) {
            console.error("Invalid grade: " + grade);
        }
        return false;
    }

    // Get the class names at indicated grade and school, and sort descendingly
    const classsNames = await pint.custom(
        "findMany",
        "classs",
        {
            where: { schoolId: schoolId, name: { startsWith: grade } },
            select: { name: true },
            orderBy: { name: "desc" },
        },
        true
    );

    // If no classs exist, return the first class name
    if (classsNames.length === 0) {
        return grade + "A1";
    } else {
        // Get the first class name
        const firstClassName = classsNames[0];

        // Get the letter
        const letter = firstClassName.match(/\w/)[0];

        // Get the index
        const index = parseInt(firstClassName.match(/\d+/)[-1]);

        // Add 1 and return the new class name
        return grade + letter + (index + 1).toString();
    }
}

export async function createClasss(classsObj = {}) {
    // Structure of classsObj (all fields are required):
    // classsObj = {
    // 		name,
    // 		schoolId,
    // };

    if (classsObj.schoolId === "" || classsObj.schoolId === undefined) {
        // Get all schools
        const schoolIds = await pint.find("school", { id: true }, null, true);

        if (schoolIds.length === 0) {
            if (process.env.VERBOSITY >= 1) {
                console.error("No schools exist.");
            }
            return false;
        }

        classsObj.schoolId = chance.pickone(schoolIds);
    } else if (
        (
            await pint.find(
                "school",
                { id: true },
                { id: classsObj.schoolId },
                true
            )
        ).length === 0
    ) {
        if (process.env.VERBOSITY >= 1) {
            console.error("schoolId not found: " + classsObj.schoolId);
        }
        return false;
    }

    if (classsObj.name === "" || classsObj.name === undefined) {
        classsObj.name = await generateRandomClasssName(classsObj.schoolId);
    } else if (
        (await pint.find(
            "classs",
            { id: true },
            { name: classsObj.name, schoolId: classsObj.schoolId },
            true
        ).length) > 0
    ) {
        if (process.env.VERBOSITY >= 1) {
            console.error(
                "classs with name " +
                    classsObj.name +
                    " already exists at school " +
                    classsObj.schoolId
            );
        }
        return false;
    }

    try {
        await prisma.classs.create({
            data: classsObj,
        });

        if (process.env.VERBOSITY >= 3) {
            console.log(
                "Created classs " +
                    classsObj.name +
                    " from " +
                    classsObj.schoolId
            );
        }
        return true;
    } catch (error) {
        if (process.env.VERBOSITY >= 1) {
            console.error(
                "Failed to create classs " + classsObj.name + ": " + error
            );
        }
        return false;
    }
}

export async function createClassses(classsObjs = []) {
    if (classsObjs.length === 0) {
        // Get all schools
        const schoolIds = await pint.find("school", { id: true }, null, true);

        // If no schools exist, return false
        if (schoolIds.length === 0) {
            if (process.env.VERBOSITY >= 2) {
                console.warn("No schools exist.");
            }
            return false;
        }

        // Assign 1 class of each grade to each school
        for (const schoolId of schoolIds) {
            for (let i = 1; i <= 12; i++) {
                await createClasss({
                    schoolId: schoolId,
                    name: i.toString() + "A1",
                });
            }
        }
    } else {
        for (const classsObj of classsObjs) {
            await createClasss(classsObj);
        }
    }
}

// Create multiple classes from a template. Template is a class object with some fields filled in.
export async function createClasssesFromTemplate(
    classsTemplate = {},
    numClassses = 1
) {
    if (numClassses <= 0) {
        if (process.env.VERBOSITY >= 1) {
            console.error("Invalid numClassses: " + numClassses);
        }
        return false;
    }

    for (let i = 0; i < numClassses; i++) {
        let success = false;
        let retries = 5;
        while (!success && retries > 0) {
            success = await createClasss({ ...classsTemplate });
            retries--;
        }
    }
}
