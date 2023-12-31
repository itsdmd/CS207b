import * as pint from "../models/prisma-interface.js";
import * as pw from "../functions/password.js";

import * as user from "../models/user.js";
import * as loginSession from "../models/loginSession.js";

await pint.del("user", { id: "test1" });

await user.createUser({
	id: "test1",
	password: pw.generateHashedPassword("test"),
	accountType: "ADMIN",
});

console.log("User created: " + JSON.stringify(await pint.find("user", null, { id: "test1" })));

await loginSession.deleteSessionOfUser("test1");

await loginSession.newSession("test1", pw.generateHashedPassword("test"));
