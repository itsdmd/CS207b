import apolloClient from "./apolloClient.service.js";
import { authenticateGql } from "./schema.constants.js";

export default async function Authenticate(userId, sessionId) {
    // Clear cache
    await apolloClient.cache.reset();

    // Authenticate user with sessionId
    const result = await apolloClient.query({
        query: authenticateGql(userId, sessionId),
    });

    // console.log("Data:", result.data.authenticate);

    if (result.data.authenticate) {
        console.log("Authenticate successful");
    } else {
        console.error("Authenticate failed");
    }

    return {
        success: result.data.authenticate,
    };
}
