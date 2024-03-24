import apolloClient from "./apolloClient.service.js";
import * as schema from "./schema.constants.js";

export default async function GetSubject(subjectObj) {
    // Clear cache
    await apolloClient.cache.reset();

    const result = (
        await apolloClient.query({
            query: schema.subjectGql(subjectObj),
        })
    ).data.subject;

    return result;
}

export async function NewTSA(tsaObj) {
    // Clear cache
    await apolloClient.cache.reset();

    const result = (
        await apolloClient.query({
            query: schema.newTSAGql(tsaObj),
        })
    ).data.newTSA;

    return result;
}

export async function GetTSAs(subjectObj) {
    // Clear cache
    await apolloClient.cache.reset();

    const result = (
        await apolloClient.query({
            query: schema.getTSAGql(subjectObj),
        })
    ).data.getTSA;

    return result;
}
