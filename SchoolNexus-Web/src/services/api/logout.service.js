import apolloClient from "./apolloClient.service.js";
import { logoutGql } from "./schema.constants.js";
import { resetLocalStorage } from "../LocalStorage/LocalStorage.service.js";

export default async function Logout(userId) {
    // Clear cache
    await apolloClient.cache.reset();

    // Request delete existing login session
    const result = await apolloClient.query({
        query: logoutGql(userId),
    });

    console.log("Data:", result.data.logout.msg);

    if (result.data.logout.success) {
        console.log("Logout successful");

        resetLocalStorage();

        returnObj = {
            success: result.data.logout.success,
            data: result.data.logout.msg,
        };
    } else {
        console.error("Logout failed: " + result.data.logout.msg);
        returnObj = {
            success: result.data.logout.success,
            data: result.data.logout.msg,
        };
    }

    return returnObj;
}
