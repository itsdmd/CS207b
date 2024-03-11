import apolloClient from "./apolloClient.service.js";
import { getUserGql } from "./schema.constants.js";

export default async function GetUser(userObj) {
    // Clear cache
    await apolloClient.cache.reset();

    const result = await apolloClient.query({
        query: getUserGql(userObj),
    });

    console.log("Data:", result.data.user);

    return result.data.user;
}
