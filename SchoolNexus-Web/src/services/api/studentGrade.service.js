import apolloClient from "./apolloClient.service.js";
import * as schema from "./schema.constants.js";

export async function GetGradeTypes(subjectObj) {
    // Clear cache
    await apolloClient.cache.reset();
    const result = (
        await apolloClient.query({
            query: schema.getGradeTypeGql(subjectObj),
        })
    ).data.getGradeType;
    return result;
}

export default async function GetStudentGrades(subjectObj) {
    // Clear cache
    await apolloClient.cache.reset();

    const result = (
        await apolloClient.query({
            query: schema.getStudentGradesGql(subjectObj),
        })
    ).data.getStudentGrades;

    return result;
}

export async function NewStudentGrade(tsaObj) {
    // Clear cache
    await apolloClient.cache.reset();

    const result = (
        await apolloClient.query({
            query: schema.newStudentGradeGql(tsaObj),
        })
    ).data.newStudentGrade;

    return result;
}
