import apolloClient from "./apolloClient.service.js";
import {
    classsGql,
    newClasssGql,
    getUCAGql,
    newUCAGql,
} from "./schema.constants.js";

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

export async function GetUCA(ucaObj) {
    // Clear cache
    await apolloClient.cache.reset();

    const result = (
        await apolloClient.query({
            query: getUCAGql(ucaObj),
        })
    ).data.getUCA;

    return result;
}

export async function NewUCA(ucaObj) {
    // Clear cache
    await apolloClient.cache.reset();

    const result = (
        await apolloClient.query({
            query: newUCAGql(ucaObj),
        })
    ).data.newUCA;

    return result;
}
