import apolloClient from "./apolloClient.service.js";
import * as schema from "./schema.constants.js";

export default async function GetUser(userObj) {
    // Clear cache
    await apolloClient.cache.reset();

    const result = (
        await apolloClient.query({
            query: schema.getUserGql(userObj),
        })
    ).data.getUser;

    // console.log("Data:", result);

    return result;
}

export async function NewUser(userObj) {
    // Clear cache
    await apolloClient.cache.reset();

    console.log("userObj:", userObj);

    const result = (
        await apolloClient.query({
            query: schema.newUserGql(userObj),
        })
    ).data.newUser;

    console.log("Data:", result);

    return result;
}

export async function DeleteUser(userId) {
    // Clear cache
    await apolloClient.cache.reset();

    const result = (
        await apolloClient.query({
            query: schema.deleteUserGql(userId),
        })
    ).data.deleteUser;

    // console.log("Data:", result);

    return result;
}

export async function UserBySchoolId(schoolId) {
    // Clear cache
    await apolloClient.cache.reset();

    const result = (
        await apolloClient.query({
            query: schema.userBySchoolIdGql(schoolId),
        })
    ).data.userBySchoolId;

    // console.log("Data:", result);

    return result;
}

export async function UserByClassId(classId) {
    // Clear cache
    await apolloClient.cache.reset();

    const result = (
        await apolloClient.query({
            query: schema.userByClasssIdGql(classId),
        })
    ).data.userByClasssId;

    // console.log("Data:", result);

    return result;
}

export async function SchoolByUserId(userId) {
    // Clear cache
    await apolloClient.cache.reset();

    const result = (
        await apolloClient.query({
            query: schema.schoolByUserIdGql(userId),
        })
    ).data.schoolByUserId;

    // console.log("Data:", result);

    return result;
}

export async function GetFormTeachersOfSchool(schoolId) {
    // Clear cache
    await apolloClient.cache.reset();

    const result = (
        await apolloClient.query({
            query: schema.getFormTeachersOfSchoolGql(schoolId),
        })
    ).data.getFormTeachersOfSchool;

    // console.log("Data:", result);

    return result;
}

export async function GetNonFormTeachersOfSchool(schoolId) {
    // Clear cache
    await apolloClient.cache.reset();

    const result = (
        await apolloClient.query({
            query: schema.getNonFormTeachersOfSchoolGql(schoolId),
        })
    ).data.getNonFormTeachersOfSchool;

    // console.log("Data:", result);

    return result;
}
