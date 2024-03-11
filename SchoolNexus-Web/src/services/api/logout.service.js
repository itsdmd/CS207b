import apolloClient from "./apolloClient.service.js";
import { logoutGql } from "./schema.constants.js";
import { resetLocalStorage } from "../LocalStorage/LocalStorage.service.js";

export default async function Logout() {
    const userId = localStorage.getItem("userId");

    if (userId == null || userId == "") {
        console.warn("No user logged in");
        resetLocalStorage();
        return {
            success: true,
            data: "No user logged in.",
        };
    }

    // Clear cache
    await apolloClient.cache.reset();

    // Request delete existing login session
    const result = await apolloClient.query({
        query: logoutGql(userId),
    });

    if (result.data.logout.success) {
        console.log("Logout successful");

        resetLocalStorage();

        return {
            success: result.data.logout.success,
            data: result.data.logout.msg,
        };
    } else {
        console.error("Logout failed: " + result.data.logout.msg);
        return {
            success: result.data.logout.success,
            data: result.data.logout.msg,
        };
    }
}
