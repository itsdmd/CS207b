import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function createSemester(semesterObj = {}) {
    if (semesterObj.id === null || semesterObj.id === undefined) {
        try {
            // By default the schema will handle the creation of the id field.
            await prisma.semester.create();
            if (process.env.VERBOSITY >= 3) {
                console.log("Created semester " + semesterObj.id);
            }
            return true;
        } catch (error) {
            if (process.env.VERBOSITY >= 1) {
                console.error(
                    "Failed to create semester " + semesterObj.id + ": " + error
                );
            }
            return false;
        }
    } else {
        // Check if semester already exists
        if (
            (await prisma.semester.findUnique({
                where: { id: semesterObj.id },
            })) !== null
        ) {
            if (process.env.VERBOSITY >= 1) {
                console.error(
                    "semesterId " + semesterObj.id + " already exists."
                );
            }
            return false;
        }
        // Check if semester is in the correct format of "YYYY-MM"
        else if (!/^\d{4}-\d{2}$/.test(semesterObj.id)) {
            if (process.env.VERBOSITY >= 1) {
                console.error("Invalid semesterId: " + semesterObj.id);
            }
            return false;
        }

        try {
            await prisma.semester.create({
                data: semesterObj,
            });
            if (process.env.VERBOSITY >= 3) {
                console.log("Created semester " + semesterObj.id);
            }
            return true;
        } catch (error) {
            if (process.env.VERBOSITY >= 1) {
                console.error(
                    "Failed to create semester" + semesterObj.id + ": " + error
                );
            }
            return false;
        }
    }
}

export async function createSemesters(
    startYear = new Date().getFullYear(),
    endYear = new Date().getFullYear() + 3
) {
    for (let year = startYear; year < endYear; year++) {
        for (let semester = 1; semester <= 4; semester++) {
            await createSemester({
                id: year + "-" + semester.toString().padStart(2, "0"),
            });
        }
    }
}

export async function getYearFromSemesterId(semesterId) {
    return semesterId.split("-")[0];
}
