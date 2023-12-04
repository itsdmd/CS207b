import * as pint from "../models/prisma-interface.js";
import * as user from "../models/user.js";
import * as pw from "../functions/password.js";

await pint.del("user", { id: "test1" });

await user.createUser({
	id: "test1",
	password: pw.generateHashedPassword("test"),
	accountType: "ADMIN",
});

console.log("User created: " + (await pint.find("user", null, { id: "test1" })));
