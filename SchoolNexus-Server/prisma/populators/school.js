import { PrismaClient } from "@prisma/client";
import Chance from "chance";
const chance = new Chance();

const prisma = new PrismaClient();

function randomizedGradeLevels() {
	const accountTypes = ["PRIMARY", "MIDDLE", "HIGH"];
	const randomIndex = chance.natural({ min: 0, max: 2 });
	return accountTypes[randomIndex];
}

async function main(numberOfSchools = 30) {
	const schools = [...Array(numberOfSchools)].map(() => {
		const name = chance.word() + " " + chance.word() + " School";
		const address = chance.address();
		const isPublic = chance.bool();
		const gradeLevels = [...Array(chance.natural({ min: 1, max: 3 }))].map(randomizedGradeLevels);

		return {
			name,
			address,
			isPublic,
			gradeLevels,
		};
	});

	for (const school of schools) {
		try {
			await prisma.school.create({
				data: school,
			});
		} catch (error) {
			console.error("Failed to create school:", error);
			continue;
		}

		console.log("School created successfully:", school.name);
	}
}

export async function populateSchools(numberOfSchools = 30) {
	await main(numberOfSchools)
		.catch((error) => {
			console.error("Failed to populate schools:", error);
			process.exit(1);
		})
		.finally(async () => {
			await prisma.$disconnect();
		});
}

export async function updateSchools(fieldName, values) {
	await prisma.school
		.updateMany({
			data: {
				[fieldName]: {
					set: values[chance.natural({ min: 0, max: values.length - 1 })],
				},
			},
		})
		.then(() => {
			console.log(`Updated all schools' ${fieldName}`);
		})
		.catch((error) => {
			console.error(`Failed to update all schools' ${fieldName}:`, error);
		})
		.finally(() => {
			prisma.$disconnect();
		});
}

export async function deleteAllSchools() {
	await prisma.school
		.deleteMany()
		.then(() => {
			console.log("Deleted all schools");
		})
		.catch((error) => {
			console.error("Failed to delete all schools:", error);
		})
		.finally(() => {
			prisma.$disconnect();
		});
}

export async function getAllSchoolsById() {
	const result = await prisma.school
		.findMany({
			select: { id: true },
		})
		.then((schools) => {
			return schools.map((school) => school.id);
		})
		.catch((error) => {
			console.error("Failed to get all schools:", error);
		})
		.finally(() => {
			prisma.$disconnect();
		});

	return result;
}
