import apolloClient from "./apolloClient.service.js";
import { authenticateGql } from "./schema.constants.js";

export default async function Authenticate(userId, sessionId) {
    // Clear cache
    await apolloClient.cache.reset();

    // Request delete existing login session
    const result = await apolloClient.query({
        query: authenticateGql(userId, sessionId),
    });

    console.log("Data:", result.data.authenticate);

    if (result.data.authenticate.success) {
        console.log("Authenticate successful");
    } else {
        console.error("Authenticate failed: " + result.data.authenticate.msg);
    }

    return {
        success: result.data.authenticate,
    };
}
