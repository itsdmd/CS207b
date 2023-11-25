import { PrismaClient } from "@prisma/client";
import { hashSync } from "bcrypt";
import Chance from "chance";
const chance = new Chance();

const prisma = new PrismaClient();

function generateHashedPassword(input, saltRounds = 10) {
	const hashedPassword = hashSync(input, saltRounds);
	return hashedPassword;
}

function randomizedAccountType() {
	const accountTypes = ["STUDENT", "STUDENT", "STUDENT", "TEACHER", "TEACHER", "PRINCIPAL"];
	const randomIndex = chance.natural({ min: 0, max: 5 });
	return accountTypes[randomIndex];
}

async function main(numberOfUsers = 30) {
	const users = [...Array(numberOfUsers)].map(() => {
		const fullName = chance.name();
		const username = fullName.toLowerCase().replace(" ", "");
		const password = generateHashedPassword(chance.natural({ min: 100000, max: 999999 }).toString());
		const dateOfBirth = chance.birthday({ american: false, year: chance.year({ min: 2007, max: 2017 }) });
		const gender = chance.gender();
		const email = username + "@example.edu";
		const phoneNumber = chance.phone({ formatted: false });
		const address = chance.address();
		const accountType = randomizedAccountType();

		return {
			username,
			password,
			fullName,
			dateOfBirth,
			gender,
			email,
			phoneNumber,
			address,
			accountType,
		};
	});

	for (const user of users) {
		try {
			await prisma.user.create({
				data: user,
			});
		} catch (error) {
			console.error("Failed to create user:", error);
			continue;
		}

		console.log("User created successfully:", user.username);
	}
}

export async function populateUsers(numberOfUsers = 30) {
	await main(numberOfUsers)
		.catch((error) => {
			console.error("Error occurred:", error);
		})
		.finally(() => {
			prisma.$disconnect();
		});
}

export async function updateUsers(fieldName, values) {
	// set: values[chance.natural({ min: 0, max: values.length - 1 })],
	// Update each user to have a random value from the values array
	const allUsers = await getAllUsersById();

	for (const userId of allUsers) {
		await prisma.user
			.update({
				where: {
					id: userId,
				},
				data: {
					[fieldName]: {
						set: values[chance.natural({ min: 0, max: values.length - 1 })],
					},
				},
			})
			.then(() => {
				console.log(`Updated user ${userId}'s ${fieldName}`);
			})
			.catch((error) => {
				console.error(`Failed to update user ${userId}'s ${fieldName}:`, error);
			})
			.finally(() => {
				prisma.$disconnect();
			});
	}
}

export async function getAllUsersById() {
	const result = await prisma.user
		.findMany({
			select: { id: true },
		})
		.then((users) => {
			return users.map((user) => user.id);
		})
		.catch((error) => {
			console.error("Failed to get all users:", error);
		})
		.finally(() => {
			prisma.$disconnect();
		});

	return result;
}

export async function getUserIdsMatching(fieldName, value) {
	const result = await prisma.user
		.findMany({
			where: {
				[fieldName]: value,
			},
		})
		.then((users) => {
			return users.map((user) => user.id);
		})
		.catch((error) => {
			console.error(`Failed to get users matching ${fieldName} ${value}:`, error);
		})
		.finally(() => {
			prisma.$disconnect();
		});

	return result;
}

export async function deleteAllUsers() {
	await prisma.user
		.deleteMany()
		.then(() => {
			console.log("Deleted all users");
		})
		.catch((error) => {
			console.error("Failed to delete all users:", error);
		})
		.finally(() => {
			prisma.$disconnect();
		});
}
