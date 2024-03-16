import apolloClient from "./apolloClient.service.js";
import { classsGql, newClasssGql } from "./schema.constants.js";

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

export async function NewClasss(classsObj) {
    // Clear cache
    await apolloClient.cache.reset();

    const result = (
        await apolloClient.query({
            query: newClasssGql(classsObj),
        })
    ).data.newClasss;

    console.log("Data:", result);

    return result;
}
