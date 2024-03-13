import apolloClient from "./apolloClient.service.js";
import { getUserGql, setUserGql } from "./schema.constants.js";

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

export async function SetUser(userObj) {
    // Clear cache
    await apolloClient.cache.reset();

    const result = (
        await apolloClient.mutate({
            mutation: setUserGql(userObj),
        })
    ).data.setUser;

    console.log("Data:", result);

    return result;
}
