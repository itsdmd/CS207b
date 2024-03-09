import { hashSync, compare } from "bcrypt";

export function generateHashedPassword(input = "") {
    if (input === null) {
        input = "P@ssword1234";
    }
    const hashedPassword = hashSync(
        input,
        parseInt(process.env.PWD_SALT_ROUNDS)
    );
    return hashedPassword;
}

export async function verifyPassword(input = "", comparisionTarget = "") {
    return await compare(input, comparisionTarget);
}
