import { PrismaClient } from "@prisma/client";
import Chance from "chance";
const chance = new Chance();

const prisma = new PrismaClient();

async function main(schoolIds, numberOfClassrooms = 30) {
	const classrooms = [...Array(numberOfClassrooms)].map(() => {
		const name =
			chance.natural({ min: 1, max: 12 }).toString() +
			chance.character({ alpha: true, casing: "upper" }) +
			chance.natural({ min: 1, max: 10 }).toString();
		const schoolId = schoolIds[chance.natural({ min: 0, max: schoolIds.length - 1 })];

		return {
			name,
			schoolId,
		};
	});

	for (const c of classrooms) {
		try {
			await prisma.class.create({
				data: c,
			});
		} catch (error) {
			console.error("Failed to create classroom:", error);
			continue;
		}

		console.log("Class created successfully:", c.name);
	}
}

export async function populateClassrooms(schoolIds, numberOfClassrooms = 30) {
	await main(schoolIds, numberOfClassrooms)
		.catch((error) => {
			console.error("Failed to populate classrooms:", error);
			process.exit(1);
		})
		.finally(async () => {
			await prisma.$disconnect();
		});
}

export async function updateClassrooms(fieldName, values) {
	await prisma.class
		.updateMany({
			data: {
				[fieldName]: {
					set: values[chance.natural({ min: 0, max: values.length - 1 })],
				},
			},
		})
		.then(() => {
			console.log(`Updated all classrooms' ${fieldName}`);
		})
		.catch((error) => {
			console.error(`Failed to update all classrooms' ${fieldName}:`, error);
		})
		.finally(() => {
			prisma.$disconnect();
		});
}

export async function deleteAllClassrooms() {
	await prisma.class
		.deleteMany()
		.then(() => {
			console.log("Deleted all classrooms");
		})
		.catch((error) => {
			console.error("Failed to delete all classrooms:", error);
		})
		.finally(() => {
			prisma.$disconnect();
		});
}

export async function getAllClassroomsById() {
	const result = await prisma.class
		.findMany({
			select: { id: true },
		})
		.then((classrooms) => {
			return classrooms.map((classroom) => classroom.id);
		})
		.catch((error) => {
			console.error("Failed to get all classrooms:", error);
		})
		.finally(() => {
			prisma.$disconnect();
		});

	return result;
}
