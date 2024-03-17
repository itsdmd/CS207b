import apolloClient from "./apolloClient.service.js";
import * as schema from "./schema.constants.js";

export default async function GetSchool(schoolObj) {
    // Clear cache
    await apolloClient.cache.reset();

    const result = (
        await apolloClient.query({
            query: schema.schoolGql(schoolObj),
        })
    ).data.school;

    return result;
}

export async function NewSchool(schoolObj) {
    // Clear cache
    await apolloClient.cache.reset();

    const result = (
        await apolloClient.query({
            query: schema.newSchoolGql(schoolObj),
        })
    ).data.newSchool;

    console.log("Data:", result);

    return result;
}

export async function DeleteSchool(schoolId) {
    // Clear cache
    await apolloClient.cache.reset();

    const result = (
        await apolloClient.query({
            query: schema.deleteSchoolGql(schoolId),
        })
    ).data.deleteSchool;

    return result;
}

export async function GetUSA(usaObj) {
    // Clear cache
    await apolloClient.cache.reset();

    const result = (
        await apolloClient.query({
            query: schema.getUSAGql(usaObj),
        })
    ).data.getUSA;

    return result;
}

export async function NewUSA(ucaObj) {
    // Clear cache
    await apolloClient.cache.reset();

    const result = (
        await apolloClient.query({
            query: schema.newUSAGql(ucaObj),
        })
    ).data.newUSA;

    return result;
}

export async function DeleteUSA(usaId) {
    // Clear cache
    await apolloClient.cache.reset();

    const result = (
        await apolloClient.query({
            query: schema.deleteUSAGql(usaId),
        })
    ).data.deleteUSA;

    return result;
}
