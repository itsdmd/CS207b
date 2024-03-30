import { hashSync, compare } from "bcrypt";

export function generateHashedPassword(input = "") {
    if (input === null || input === undefined || input === "") {
        if (process.env.VERBOSITY >= 1) {
            console.error("No password provided");
        }
        return null;
    }
    const hashedPassword = hashSync(input, 10);
    return hashedPassword;
}

export async function verifyPassword(input = "", comparisionTarget = "") {
    return await compare(input, comparisionTarget);
}
