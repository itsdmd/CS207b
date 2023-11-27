import { hashSync } from "bcrypt";

export function generateHashedPassword(input = "", saltRounds = 10) {
	if (input === "") {
		input = (Math.random() * (99999999 - 10000000) + 10000000).toString();
	}
	const hashedPassword = hashSync(input, saltRounds);
	return hashedPassword;
}
