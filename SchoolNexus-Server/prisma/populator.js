import * as user from "./populators/user.js";
import * as school from "./populators/school.js";
import * as classroom from "./populators/class.js";

await user.deleteAllUsers();
await user.populateUsers();

await school.deleteAllSchools();
await school.populateSchools();

const schoolIds = await school.getAllSchoolsById();
await user.updateUsers("schoolId", schoolIds);

await classroom.deleteAllClassrooms();
await classroom.populateClassrooms(schoolIds);
