import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";

import { ApolloProvider, gql } from "@apollo/client";
import apolloClient from "../../constants/apollo/client";

import * as SS from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as storageType from "../../variables/storageType";

import colors from "../../constants/colors";
import * as gstyles from "../../constants/styles";

import CustomButton from "../../components/CustomButton";

const HomeScreen = ({ navigation }) => {
    const [sessionId, setSessionId] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        switch (storageType.get()) {
            case "SS": {
                SS.getItemAsync("sessionId")
                    .then((value) => {
                        setSessionId(value);
                    })
                    .then(() => {
                        setLoading(false);
                    });

                break;
            }

            case "AS": {
                AsyncStorage.getItem("sessionId")
                    .then((value) => {
                        setSessionId(value);
                    })
                    .then(() => {
                        setLoading(false);
                    });

                break;
            }

            default:
                console.error("Invalid storage type");
                break;
        }
    }, []);

    const onLogoutButtonPress = () => {
        console.log("Logout pressed");

        let username = "";
        let password = "";

        switch (storageType.get()) {
            case "SS": {
                SS.getItemAsync("username")
                    .then((value) => {
                        username = value;
                    })
                    .then(() => {
                        SS.getItemAsync("password");
                    })
                    .then((value) => {
                        password = value;
                    })
                    .then(() => {
                        if (username === "" || password === "") {
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
						logout(userId: "${username}", password: "${password}")
					}
				`,
                                })
                                // Clean SS
                                .then((result) => {
                                    SS.deleteItemAsync("username");
                                    return result;
                                })
                                .then((result) => {
                                    SS.deleteItemAsync("password");
                                    return result;
                                })
                                .then((result) => {
                                    SS.deleteItemAsync("sessionId");
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
                    })
                    .catch((error) => console.log(error));

                break;
            }

            case "AS": {
                AsyncStorage.getItem("username")
                    .then((value) => {
                        username = value;
                    })
                    .then(() => {
                        AsyncStorage.getItem("password");
                    })
                    .then((value) => {
                        password = value;
                    })
                    .then(() => {
                        if (username === "" || password === "") {
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
						logout(userId: "${username}", password: "${password}")
					}
				`,
                                })
                                // Clean AS
                                .then((result) => {
                                    AsyncStorage.removeItem("username");
                                    return result;
                                })
                                .then((result) => {
                                    AsyncStorage.removeItem("password");
                                    return result;
                                })
                                .then((result) => {
                                    AsyncStorage.removeItem("sessionId");
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
                    })
                    .catch((error) => console.log(error));

                break;
            }
        }
    };

    return (
        <ApolloProvider client={apolloClient}>
            <View style={gstyles.layout.container_100}>
                <View style={gstyles.layout.container_80}>
                    {loading ? null : (
                        <Text style={gstyles.text.primary_bold_italic}>
                            {sessionId}
                        </Text>
                    )}
                    <CustomButton
                        onPress={onLogoutButtonPress}
                        buttonStyle={{ backgroundColor: colors.error }}
                        text="Logout"
                    />
                </View>
            </View>
        </ApolloProvider>
    );
};

export default HomeScreen;
