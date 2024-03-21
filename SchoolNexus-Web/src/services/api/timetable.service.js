import apolloClient from "./apolloClient.service.js";
import {
    timetableEntryGql,
    timetableEntryByUserIdGql,
    newTimetableEntryGql,
    timetableEntryAttendenceGql,
    newTimetableEntryAttendenceGql,
    deleteTimetableEntryAttendenceGql,
} from "./schema.constants.js";

export async function TimetableEntry(timetableEntryObj) {
    // Clear cache
    await apolloClient.cache.reset();

    const result = (
        await apolloClient.query({
            query: timetableEntryGql(timetableEntryObj),
        })
    ).data.timetableEntry;

    return result;
}

export async function TimetableEntryByUserId(userId) {
    // Clear cache
    await apolloClient.cache.reset();

    const result = (
        await apolloClient.query({
            query: timetableEntryByUserIdGql(userId),
        })
    ).data.timetableEntryByUserId;

    return result;
}

export async function NewTimetableEntry(timetableEntryObj) {
    // Clear cache
    await apolloClient.cache.reset();

    const result = (
        await apolloClient.query({
            query: newTimetableEntryGql(timetableEntryObj),
        })
    ).data.newTimetableEntry;

    return result;
}

export async function TimetableEntryAttendence(teaObj) {
    // Clear cache
    await apolloClient.cache.reset();

    const result = (
        await apolloClient.query({
            query: timetableEntryAttendenceGql(teaObj),
        })
    ).data.timetableEntryAttendence;

    return result;
}

export async function NewTimetableEntryAttendence(teaObj) {
    // Clear cache
    await apolloClient.cache.reset();

    const result = (
        await apolloClient.query({
            query: newTimetableEntryAttendenceGql(teaObj),
        })
    ).data.newTimetableEntryAttendence;

    return result;
}

export async function DeleteTimetableEntryAttendence(teaObj) {
    // Clear cache
    await apolloClient.cache.reset();

    const result = (
        await apolloClient.query({
            query: deleteTimetableEntryAttendenceGql(teaObj),
        })
    ).data.deleteTimetableEntryAttendence;

    return result;
}
