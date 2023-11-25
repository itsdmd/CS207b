import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createUser = async (user) => {
	const newUser = await prisma.user.create({
		data: {
			username: user.username,
			password: user.password,
			fullName: user.fullName,
			dateOfBirth: user.dateOfBirth,
			gender: user.gender,
			email: user.email,
			phoneNumber: user.phoneNumber,
			address: user.address,
			profilePicture: user.profilePicture,
			classId: user.classId,
			schoolId: user.schoolId,
			accountType: user.accountType,
			relatives: user.relatives,
		},
	});
	return newUser;
};

export const getUserByUsername = async (username) => {
	const user = await prisma.user.findUnique({
		where: {
			username,
		},
	});
	return user;
};
