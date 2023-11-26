import Chance from "chance";
import { hashSync } from "bcrypt";

const chance = new Chance();

export function generateHashedPassword(input = "", saltRounds = 10) {
	if (input === "") {
		input = chance.natural({ min: 100000, max: 999999 }).toString();
	}
	const hashedPassword = hashSync(input, saltRounds);
	return hashedPassword;
}
