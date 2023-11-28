import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const SUBJECT_IDS = ["MATHS", "LITERATURE", "PHYSICS", "CHEMISTRY", "BIOLOGY", "GEOGRAPHY", "HISTORY", "FOREIGN_LANGUAGE"];
const SUBJECT_NAMES = ["Maths", "Literature", "Physics", "Chemistry", "Biology", "Geography", "History", "Foreign Language"];

export async function populateSubjects() {
	// Check if 2 arrays have the same length
	if (SUBJECT_IDS.length !== SUBJECT_NAMES.length) {
		console.error("SUBJECT_IDS and SUBJECT_NAMES have different lengths.");
		return false;
	}

	for (let i = 0; i < SUBJECT_IDS.length; i++) {
		await prisma.subject.create({
			data: {
				id: SUBJECT_IDS[i],
				name: SUBJECT_NAMES[i],
			},
		});
	}

	console.log("Populated subjects: " + SUBJECT_IDS.toString());
	return true;
}
