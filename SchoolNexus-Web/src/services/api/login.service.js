import apolloClient from "./apolloClient.service.js";
import { loginGql, userGql } from "./schema.constants.js";

export default async function Login(userId, password) {
    // Clear cache
    await apolloClient.cache.reset();

    // Request new login session
    const result = await apolloClient.query({
        query: loginGql(userId, password),
    });

    console.log("Data:", result.data.login.msg);

    const userFullName = "";
    const returnObj = {};
    if (result.data.login.success) {
        console.log("Login successful");

        localStorage.setItem("userId", userId);
        localStorage.setItem("userCred", result.data.login.msg);

        userFullName = (
            await apolloClient.query({
                query: userGql({ id: userId }),
            })
        ).data.user.fullName;
        localStorage.setItem("userFullName", userFullName);

        returnObj = {
            success: result.data.login.success,
            data: {
                id: userId,
                cred: result.data.login.msg,
                fullName: userFullName,
            },
        };
    } else {
        console.error("Login failed: " + result.data.login.msg);
        returnObj = {
            success: result.data.login.success,
            data: result.data.login.msg,
        };
    }

    return returnObj;
}
