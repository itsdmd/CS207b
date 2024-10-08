import apolloClient from "./apolloClient.service.js";
import { loginGql, getUserGql } from "./schema.constants.js";

export default async function Login(userId, password) {
    // Clear cache
    await apolloClient.cache.reset();

    // Request new login session
    const result = await apolloClient.query({
        query: loginGql(userId, password),
    });

    console.log("Login Data:", result.data.login);

    let returnObj = {};
    if (result.data.login.success) {
        console.log("Login successful");

        localStorage.setItem("userId", userId);
        localStorage.setItem("userCred", result.data.login.msg);

        const userObj = (
            await apolloClient.query({
                query: getUserGql({ id: userId }),
            })
        ).data.getUser[0];

        localStorage.setItem("userFullName", userObj.fullName);
        localStorage.setItem("userAccountType", userObj.accountType);
        if (userObj.usa.length > 0) {
            localStorage.setItem("schoolId", userObj.usa[0].schoolId);
        }

        for (var i = 0; i < localStorage.length; i++) {
            console.log(localStorage.getItem(localStorage.key(i)));
        }

        returnObj = {
            success: result.data.login.success,
            data: {
                id: localStorage.getItem("userId"),
                cred: localStorage.getItem("userCred"),
                fullName: localStorage.getItem("userFullName"),
                accountType: localStorage.getItem("userAccountType"),
            },
        };

        console.log("Login returnObj:", returnObj);
    } else {
        console.error("Login failed: " + result.data.login.msg);
        returnObj = {
            success: result.data.login.success,
            data: result.data.login.msg,
        };
    }

    console.log("Login returnObj:", returnObj);
    return returnObj;
}
