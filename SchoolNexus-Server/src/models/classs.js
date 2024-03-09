import { PrismaClient } from "@prisma/client";
import Chance from "chance";
import * as pint from "./prisma-interface.js";

const chance = new Chance();
const prisma = new PrismaClient();

export async function generateGradePool(gradeLevels) {
    let gradePool = [];

    if (gradeLevels.includes("PRIMARY")) {
        gradePool.push(1, 2, 3, 4, 5);
    }
    if (gradeLevels.includes("MIDDLE")) {
        gradePool.push(6, 7, 8, 9);
    }
    if (gradeLevels.includes("HIGH")) {
        gradePool.push(10, 11, 12);
    }

    return gradePool;
}

export async function generateRandomClasssName(grade) {
    // Generate random classs name with format: <rade><A-D><1-10>
    const letter = chance.character({ casing: "upper", pool: "ABCD" });
    const number = chance.natural({ min: 1, max: 10 }).toString();

    return String(grade) + letter + number;
}

export async function createClasss(classsObj = {}) {
    // Structure of classsObj:
    // classsObj = {
    // 		name String,
    // 		grade Int,
    // 		schoolId String,
    // 		roomId String?,
    // };

    if (classsObj.schoolId === null || classsObj.schoolId === undefined) {
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

    if (classsObj.grade === null || classsObj.grade === undefined) {
        const gradeLevels = (
            await pint.find(
                "school",
                { gradeLevels: true },
                { id: classsObj.schoolId },
                true
            )
        )[0];
        classsObj.grade = chance.pickone(await generateGradePool(gradeLevels));
    } else if (
        !(
            await generateGradePool(
                (
                    await pint.find(
                        "school",
                        { gradeLevels: true },
                        { id: classsObj.schoolId },
                        true
                    )
                )[0]
            )
        ).includes(classsObj.grade)
    ) {
        if (process.env.VERBOSITY >= 1) {
            console.error("Invalid grade: " + classsObj.grade);
        }
        return false;
    }

    if (classsObj.name === null || classsObj.name === undefined) {
        classsObj.name = await generateRandomClasssName(classsObj.grade);
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
    // Check if class name matches its grade
    else if (classsObj.name.match(/\d+/)[0] !== classsObj.grade.toString()) {
        if (process.env.VERBOSITY >= 1) {
            console.error(
                "Class name does not match its grade: " +
                    classsObj.name +
                    " at school " +
                    classsObj.schoolId
            );
        }
        return false;
    }

    if (classsObj.roomId === null || classsObj.roomId === undefined) {
        // Find all assigned roomIds
        const assignedRoomIds = await pint.find(
            "classs",
            { roomId: true },
            { schoolId: classsObj.schoolId },
            true
        );
        // Find all roomIds and exclude assigned roomIds
        const roomIds = await pint.find(
            "room",
            { id: true },
            { id: { notIn: assignedRoomIds }, schoolId: classsObj.schoolId },
            true
        );

        if (roomIds.length === 0) {
            if (process.env.VERBOSITY >= 2) {
                console.warn("No rooms available for classs " + classsObj.name);
            }
            classsObj.roomId = null;
        } else {
            classsObj.roomId = chance.pickone(roomIds);
        }
    } else if (
        (await pint.find("room", { id: true }, { id: classsObj.roomId }, true))
            .length === 0
    ) {
        if (process.env.VERBOSITY >= 1) {
            console.error("Invalid roomId: " + classsObj.roomId);
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
                    " of school " +
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

        // Assign 3 class of each valid grade to each school
        for (const schoolId of schoolIds) {
            const schoolGradeLevels = (
                await pint.find(
                    "school",
                    { gradeLevels: true },
                    { id: schoolId },
                    true
                )
            )[0];
            const gradePool = await generateGradePool(schoolGradeLevels);
            for (const grade of gradePool) {
                let classsObj = {
                    schoolId: schoolId,
                    grade: grade,
                };
                for (let i = 0; i < 3; i++) {
                    await createClasss(classsObj);
                }
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

// Get number of student in a class by counting number of user of type "STUDENT" in "member" attribute of classs
export async function getClasssSize(classsId) {
    const allMembers = await prisma.classs.findMany({
        where: { id: classsId },
        include: { members: true },
    });
    let studentCount = 0;
    for (const member of allMembers) {
        if (member.type === "STUDENT") {
            studentCount++;
        }
    }
    return studentCount;
}
