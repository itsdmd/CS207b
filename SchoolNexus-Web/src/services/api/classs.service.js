import apolloClient from "./apolloClient.service.js";
import { classsGql } from "./schema.constants.js";

export async function GetClasss(classsObj) {
    // Clear cache
    await apolloClient.cache.reset();

    const result = (
        await apolloClient.query({
            query: classsGql(classsObj),
        })
    ).data.classs;

    return result;
}
