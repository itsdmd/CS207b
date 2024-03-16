import apolloClient from "./apolloClient.service.js";
import * as schema from "./schema.constants.js";

export async function GetClasss(classsObj) {
    // Clear cache
    await apolloClient.cache.reset();

    const result = (
        await apolloClient.query({
            query: schema.classsGql(classsObj),
        })
    ).data.classs;

    return result;
}

export async function NewClasss(classsObj) {
    // Clear cache
    await apolloClient.cache.reset();

    const result = (
        await apolloClient.query({
            query: schema.newClasssGql(classsObj),
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
            query: schema.getUCAGql(ucaObj),
        })
    ).data.getUCA;

    return result;
}

export async function NewUCA(ucaObj) {
    // Clear cache
    await apolloClient.cache.reset();

    const result = (
        await apolloClient.query({
            query: schema.newUCAGql(ucaObj),
        })
    ).data.newUCA;

    return result;
}

export async function DeleteUCA(ucaId) {
    // Clear cache
    await apolloClient.cache.reset();

    const result = (
        await apolloClient.query({
            query: schema.deleteUCAGql(ucaId),
        })
    ).data.deleteUCA;

    return result;
}
