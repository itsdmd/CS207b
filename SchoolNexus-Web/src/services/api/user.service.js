import apolloClient from "./apolloClient.service.js";
import {
    getUserGql,
    setUserGql,
    userBySchoolIdGql,
    userByClasssIdGql,
    schoolByUserIdGql,
} from "./schema.constants.js";

export default async function GetUser(userObj) {
    // Clear cache
    await apolloClient.cache.reset();

    const result = (
        await apolloClient.query({
            query: getUserGql(userObj),
        })
    ).data.getUser;

    // console.log("Data:", result);

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

    // console.log("Data:", result);

    return result;
}

export async function UserBySchoolId(schoolId) {
    // Clear cache
    await apolloClient.cache.reset();

    const result = (
        await apolloClient.query({
            query: userBySchoolIdGql(schoolId),
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
            query: userByClasssIdGql(classId),
        })
    ).data.userByClassId;

    // console.log("Data:", result);

    return result;
}

export async function SchoolByUserId(userId) {
    // Clear cache
    await apolloClient.cache.reset();

    const result = (
        await apolloClient.query({
            query: schoolByUserIdGql(userId),
        })
    ).data.schoolByUserId;

    // console.log("Data:", result);

    return result;
}
