import { PrismaClient } from "@prisma/client";
import Chance from "chance";
import * as pint from "./prisma-interface.js";

const chance = new Chance();
const prisma = new PrismaClient();

const GRADE_LEVELS = ["PRIMARY", "MIDDLE", "HIGH"];

function randomizedGradeLevels() {
    const gradeLevels = [];
    switch (chance.natural({ min: 1, max: 3 })) {
        case 1:
            gradeLevels.push(chance.pickone(GRADE_LEVELS));
            break;
        case 2:
            const gl_1 = chance.pickone([0, 1]);
            gradeLevels.push(GRADE_LEVELS[gl_1]);
            gradeLevels.push(GRADE_LEVELS[gl_1 + 1]);
            break;
        case 3:
            gradeLevels.push(...GRADE_LEVELS);
            break;
        default:
            break;
    }

    return gradeLevels;
}

export async function createSchool(schoolObj = {}) {
    // Structure of schoolObj (all fields are required):
    // schoolObj = {
    // 		name,
    // 		address,
    // 		isPublic,
    // 		gradeLevels,
    // };

    if (schoolObj.gradeLevels === "" || schoolObj.gradeLevels === undefined) {
        schoolObj.gradeLevels = randomizedGradeLevels();
    }
    // Check if gradeLevels contains only valid grade levels
    else if (!schoolObj.gradeLevels.every((gl) => GRADE_LEVELS.includes(gl))) {
        if (process.env.VERBOSITY >= 1) {
            console.error("Invalid grade levels: " + schoolObj.gradeLevels);
        }
        return false;
    }

    if (schoolObj.address === "" || schoolObj.address === undefined) {
        schoolObj.address = chance.address();
    }

    if (schoolObj.name === "" || schoolObj.name === undefined) {
        const word_1 = chance.city();
        const word_2 =
            schoolObj.gradeLevels.length > 1
                ? "School System"
                : schoolObj.gradeLevels[0][0] +
                  schoolObj.gradeLevels[0].slice(1).toString().toLowerCase() +
                  " School";
        schoolObj.name = word_1 + " " + word_2;
    } else if (!/^[a-zA-Z0-9 -']+$/.test(schoolObj.name)) {
        if (process.env.VERBOSITY >= 1) {
            console.error("Invalid school name: " + schoolObj.name);
        }
        return false;
    }

    // Check if name-address pair is unique
    else if (
        (await pint.find(
            "school",
            { id: true },
            { name: schoolObj.name, address: schoolObj.address },
            true
        ).length) > 0
    ) {
        if (process.env.VERBOSITY >= 2) {
            console.warn(
                'School with name "' +
                    schoolObj.name +
                    '" at ' +
                    schoolObj.address +
                    " already exists"
            );
        }
        return false;
    }

    if (schoolObj.isPublic === "" || schoolObj.isPublic === undefined) {
        schoolObj.isPublic = chance.bool();
    }

    try {
        await prisma.school.create({
            data: schoolObj,
        });

        if (process.env.VERBOSITY >= 3) {
            console.log("Created school " + schoolObj.name);
        }
        return true;
    } catch (error) {
        if (process.env.VERBOSITY >= 3) {
            console.error(
                "Failed to create school" + schoolObj.name + ":",
                error
            );
        }
        return false;
    }
}

export async function createSchools(schoolObjs = []) {
    if (schoolObjs.length === 0) {
        for (let i = 0; i < 10; i++) {
            await createSchool();
        }
    } else {
        for (const schoolObj of schoolObjs) {
            await createSchool(schoolObj);
        }
    }
}

export async function createSchoolsFromTemplate(
    schoolTemplate = {},
    numSchools = 1
) {
    if (numSchools <= 0) {
        if (process.env.VERBOSITY >= 1) {
            console.error("Invalid numSchools: " + numSchools);
        }
        return false;
    }

    for (let i = 0; i < numSchools; i++) {
        let success = false;
        let retries = 5;
        while (!success && retries > 0) {
            success = await createSchool({ ...schoolTemplate });
            retries--;
        }
    }
}
