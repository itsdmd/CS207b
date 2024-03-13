import apolloClient from "./apolloClient.service.js";
import { getUserGql } from "./schema.constants.js";

export default async function GetUser(userObj) {
    // Clear cache
    await apolloClient.cache.reset();

    const result = (
        await apolloClient.query({
            query: getUserGql(userObj),
        })
    ).data.getUser[0];

    console.log("Data:", result);

    return result;
}
