import { PrismaClient } from "@prisma/client";
import Chance from "chance";
import * as pint from "./prisma-interface.js";

const chance = new Chance();
const prisma = new PrismaClient();

export async function createStudentGrade(studentGradeObj = {}) {
    // Structure of studentGradeObj (all fields are required):
    // studentGradeObj = {
    // 		studentId,
    // 		graderId,
    //      quarterId,
    //      subjectId,
    //      typeId,
    //      value,
    // }

    if (
        studentGradeObj.subjectId === null ||
        studentGradeObj.subjectId === undefined
    ) {
        // Get all subjects
        const subjectIds = await pint.find("subject", { id: true }, null, true);

        if (subjectIds.length === 0) {
            if (process.env.VERBOSITY >= 2) {
                console.warn("No subjects found");
            }
            return false;
        }

        let success = false;
        let retries = 10;

        while (!success && retries > 0) {
            studentGradeObj.subjectId = chance.pickone(subjectIds);

            // Check if there is any teacher assigned to the subject
            const tsaIds = await pint.find(
                "teacherSubjectAssignment",
                { id: true },
                { subjectId: studentGradeObj.subjectId },
                true
            );

            if (tsaIds.length === 0) {
                subjectIds.splice(
                    subjectIds.indexOf(studentGradeObj.subjectId),
                    1
                );
                retries--;
            } else {
                success = true;
            }
        }

        if (!success) {
            if (process.env.VERBOSITY >= 2) {
                console.warn(
                    "No subjects found that has a teacher assigned to it"
                );
            }
            return false;
        }
    } else {
        // Check if subject exists
        if (
            !(await pint.find(
                "subject",
                { id: true },
                { id: studentGradeObj.subjectId },
                false
            ))
        ) {
            if (process.env.VERBOSITY >= 2) {
                console.warn(
                    "Subject " + studentGradeObj.subjectId + " not found"
                );
            }
            return false;
        }
    }

    let graderTcaIds = null;
    if (
        studentGradeObj.graderId === null ||
        studentGradeObj.graderId === undefined
    ) {
        // Get all teachers that are teaching the subject
        const graderIds = await pint.find(
            "teacherSubjectAssignment",
            { teacherId: true },
            { subjectId: studentGradeObj.subjectId },
            true
        );

        if (graderIds.length === 0) {
            if (process.env.VERBOSITY >= 2) {
                console.warn(
                    "No teachers found for subject " + studentGradeObj.subjectId
                );
            }
            return false;
        }

        let success = false;
        let retries = 10;

        while (!success && retries > 0) {
            if (
                graderIds === null ||
                graderIds === undefined ||
                graderIds.length === 0
            ) {
                if (process.env.VERBOSITY >= 2) {
                    console.warn("No graderId provided");
                }
                return false;
            }
            studentGradeObj.graderId = chance.pickone(graderIds);

            graderTcaIds = await pint.find(
                "teacherClasssAssignment",
                { id: true },
                { teacherId: studentGradeObj.graderId },
                true
            );

            if (graderTcaIds.length === 0) {
                graderIds.splice(
                    graderIds.indexOf(studentGradeObj.graderId),
                    1
                );
                retries--;
            } else {
                success = true;
            }
        }

        if (!success) {
            if (process.env.VERBOSITY >= 2) {
                console.warn(
                    "No teachers found for subject " +
                        studentGradeObj.subjectId +
                        " that has a TCA"
                );
            }
            return false;
        }
    } else if (
        !(await pint.find(
            "user",
            { id: true },
            { id: studentGradeObj.graderId },
            false
        ))
    ) {
        if (process.env.VERBOSITY >= 2) {
            console.warn("Grader " + studentGradeObj.graderId + " not found");
        }
        return false;
    }

    // Get all classes of that teacher
    const graderClasssIds = await pint.find(
        "teacherClasssAssignment",
        { classsId: true },
        { id: { in: graderTcaIds } },
        true
    );

    if (graderClasssIds.length === 0) {
        if (process.env.VERBOSITY >= 2) {
            console.warn(
                "No classes found for grader " + studentGradeObj.graderId
            );
        }
        return false;
    }

    if (
        studentGradeObj.studentId === null ||
        studentGradeObj.studentId === undefined
    ) {
        // Get all students that are members of grader's classes
        const studentIds = await pint.find(
            "user",
            { id: true },
            { classsId: { in: graderClasssIds } },
            true
        );
        if (studentIds.length === 0) {
            if (process.env.VERBOSITY >= 2) {
                console.warn("No students found");
            }
            return false;
        }
        studentGradeObj.studentId = chance.pickone(studentIds);
    } else if (
        !(await pint.find(
            "user",
            { id: true },
            { id: studentGradeObj.studentId },
            false
        ))
    ) {
        if (process.env.VERBOSITY >= 2) {
            console.warn("Student " + studentGradeObj.studentId + " not found");
        }
        return false;
    }

    // Get all the quarters of the TCAs by
    // look up which scheduleEntry the TCA is assigned to
    const scheduleEntryIds = await pint.find(
        "scheduleEntry",
        { id: true },
        { tcaId: { in: graderTcaIds } },
        true
    );
    // then look up the SQS of those scheduleEntries
    const sqsIds = await pint.find(
        "scheduleEntry",
        { scheduleId: true },
        { id: { in: scheduleEntryIds } },
        true
    );
    // finally look up the quarters of those SQSs
    const quarterIds = await pint.find(
        "schoolQuarteralSchedule",
        { quarterId: true },
        { id: { in: sqsIds } },
        true
    );

    if (quarterIds.length === 0) {
        if (process.env.VERBOSITY >= 2) {
            console.warn("No quarters found");
        }
        return false;
    } else if (
        studentGradeObj.quarterId === null ||
        studentGradeObj.quarterId === undefined
    ) {
        studentGradeObj.quarterId = chance.pickone(quarterIds);
    } else if (!quarterIds.includes(studentGradeObj.quarterId)) {
        if (process.env.VERBOSITY >= 1) {
            console.error("Quarter " + studentGradeObj.quarterId + " invalid");
        }
        return false;
    }

    if (
        studentGradeObj.typeId === null ||
        studentGradeObj.typeId === undefined
    ) {
        // Get all grade types that has null schoolId field or schoolId field that matches the student's schoolId
        const types = await pint.find(
            "gradeType",
            { id: true },
            {
                OR: [
                    { schoolId: null },
                    {
                        schoolId: (
                            await pint.find(
                                "user",
                                { schoolId: true },
                                { id: studentGradeObj.studentId },
                                false
                            )
                        ).schoolId,
                    },
                ],
            },
            true
        );

        if (types.length === 0) {
            if (process.env.VERBOSITY >= 2) {
                console.warn("No grade types found");
            }
            return false;
        }

        studentGradeObj.typeId = chance.pickone(types);
    } else if (
        !(await pint.find(
            "gradeType",
            { id: true },
            { id: studentGradeObj.typeId },
            false
        ))
    ) {
        if (process.env.VERBOSITY >= 2) {
            console.warn("Grade type " + studentGradeObj.typeId + " not found");
        }
        return false;
    }

    if (studentGradeObj.value === null || studentGradeObj.value === undefined) {
        studentGradeObj.value = chance.floating({ min: 5, max: 10, fixed: 1 });
    } else if (
        studentGradeObj.value < 0 ||
        studentGradeObj.value > 10 ||
        isNaN(studentGradeObj.value)
    ) {
        if (process.env.VERBOSITY >= 1) {
            console.error("Grade value " + studentGradeObj.value + " invalid");
        }
        return false;
    }

    try {
        await prisma.studentGrade.create({ data: studentGradeObj });
        if (process.env.VERBOSITY >= 3) {
            console.log(
                "Created student grade for student " +
                    studentGradeObj.studentId +
                    " graded by teacher " +
                    studentGradeObj.graderId +
                    " in quarter " +
                    studentGradeObj.quarterId +
                    " for subject " +
                    studentGradeObj.subjectId +
                    " with value " +
                    studentGradeObj.value
            );
        }
        return true;
    } catch (err) {
        if (process.env.VERBOSITY >= 1) {
            console.error(
                "Failed to create student grade for student " +
                    studentGradeObj.studentId +
                    " graded by teacher " +
                    studentGradeObj.graderId +
                    " in quarter " +
                    studentGradeObj.quarterId +
                    " for subject " +
                    studentGradeObj.subjectId +
                    " with value " +
                    studentGradeObj.value +
                    " : " +
                    err
            );
        }
        return false;
    }
}

export async function createStudentGrades(studentGradeObjs = []) {
    if (studentGradeObjs.length === 0) {
        if (process.env.VERBOSITY >= 1) {
            console.error("No studentGradeObj provided.");
        }
        return false;
    } else {
        for (const studentGradeObj of studentGradeObjs) {
            let success = false;
            let retries = 10;

            while (retries > 0) {
                success = await createStudentGrade(studentGradeObj);

                if (success) {
                    break;
                } else {
                    retries--;
                }
            }
        }
    }
}

export async function createStudentGradesFromTemplate(
    studentGradeTemplate = {},
    numStudentGrade = 1
) {
    if (numStudentGrade <= 0) {
        if (process.env.VERBOSITY >= 1) {
            console.error("Invalid numStudentGrade: " + numStudentGrade);
        }
        return false;
    }

    for (let i = 0; i < numStudentGrade; i++) {
        let success = false;
        let retries = 5;

        while (!success && retries > 0) {
            success = await createStudentGrade({ ...studentGradeTemplate });

            if (!success) {
                retries--;
                if (process.env.VERBOSITY >= 3) {
                    console.log("Retries left: " + retries);
                }
            }
        }
    }
}
