import apolloClient from "./apolloClient.service.js";
import { timetableEntryGql } from "./schema.constants.js";

export default async function TimetableEntryByUserId(userId) {
    // Clear cache
    await apolloClient.cache.reset();

    const result = await apolloClient.query({
        query: timetableEntryGql(userId),
    });
    console.log("resutl", result);

    return {
        subjectId: "biology",
        dayOfWeek: 5,
    };
}
