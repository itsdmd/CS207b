import apolloClient from "./apolloClient.service.js";
import { userGql } from "./schema.constants.js";

export default async function GetUser(userObj) {
    // Clear cache
    await apolloClient.cache.reset();

    const result = await apolloClient.query({
        query: userGql(userObj),
    });

    console.log("Data:", result.data.user);

    return result.data.user;
}
