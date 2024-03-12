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

        const userFullName = await apolloClient.query({
            query: getUserGql({ id: userId }),
        });


        console.log("userFullName:", userFullName.data.getUser[0].fullName);
        localStorage.setItem(
            "userFullName",
            userFullName.data.getUser[0].fullName
        );

        returnObj = {
            success: result.data.login.success,
            data: {
                id: userId,
                cred: result.data.login.msg,
                fullName: userFullName.data.getUser[0].fullName,
            },
        };
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
