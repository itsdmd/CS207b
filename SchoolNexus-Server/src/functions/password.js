import { hashSync, compare } from "bcrypt";

export function generateHashedPassword(input = "") {
	if (input === "") {
		input = (Math.random() * (99999999 - 10000000) + 10000000).toString();
	}
	const hashedPassword = hashSync(input, parseInt(process.env.PWD_SALT_ROUNDS));
	return hashedPassword;
}

export function verifyPassword(input = "", comparisionTarget = "") {
	return compare(input, comparisionTarget);
}
