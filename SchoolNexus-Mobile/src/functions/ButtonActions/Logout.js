import { gql } from "@apollo/client";
import apolloClient from "../../constants/apollo/client";

import * as storageManager from "../../functions/StorageManager";

const Logout = () => {
    console.log("Logout pressed");

    let userId = "";
    let password = "";

    // Clear cache
    apolloClient.cache.reset().then(() => {
        storageManager
            .get("userId")
            .then((value) => {
                userId = value;
            })
            .then(() => {
                storageManager.get("password");
            })
            .then((value) => {
                password = value;
            })
            .then(() => {
                if (userId === "" || password === "") {
                    navigation.navigate("Login");
                    return false;
                } else {
                    return true;
                }
            })
            .then((status) => {
                if (status) {
                    // Request delete sessionId
                    apolloClient
                        .query({
                            query: gql`
							query {
								logout(userId: "${userId}", password: "${password}")
							}
						`,
                        })
                        // Clean storage
                        .then((result) => {
                            storageManager
                                .del("userId")
                                .then(() => {
                                    storageManager.del("password");
                                })
                                .then(() => {
                                    storageManager.del("sessionId");
                                });

                            return result;
                        })

                        // Navigate to login screen
                        .then((result) => {
                            if (result.data.logout) {
                                console.log(
                                    "Logged out. Navigating to login screen."
                                );
                                navigation.navigate("Login");
                                return true;
                            } else {
                                console.error("Logout failed.");
                                return false;
                            }
                        });
                }
            });
    });
};

export default Logout;
