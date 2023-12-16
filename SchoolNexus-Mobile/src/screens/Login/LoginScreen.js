import {
    View,
    Image,
    Text,
    StyleSheet,
    useWindowDimensions,
} from "react-native";
import React, { useState } from "react";

import { ApolloProvider, gql } from "@apollo/client";
import apolloClient from "../../constants/apollo/client";

import * as storageManager from "../../functions/StorageManager";

import color from "../../constants/colors";
import * as gstyles from "../../constants/styles";

import Logo from "../../../assets/sn-logo-white.png";
import CustomInput from "../../components/CustomInput";
import CustomButton from "../../components/CustomButton/CustomButton";

const LoginScreen = ({ navigation }) => {
    const { height, width } = useWindowDimensions();

    const [userId, setUserId] = useState("");
    const [password, setPassword] = useState("");

    const [wrongCredentials, setWrongCredentials] = useState(false);

    const Login = () => {
        console.log("Login pressed");

        // Clear cache
        apolloClient.cache.reset().then(() => {
            // Request new sessionId
            apolloClient
                .query({
                    query: gql`
                query {
                    login(userId: "${userId}", password: "${password}") {
                        sessionId
                    }
                }
                `,
                })
                .then((result) => {
                    if (
                        result.data.login === null ||
                        result.data.login === undefined
                    ) {
                        console.error("Login failed");
                        setWrongCredentials(true);
                        return false;
                    } else {
                        setWrongCredentials(false);
                    }

                    // Save session info to secure store
                    storageManager
                        .set("userId", userId)
                        .then(() => {
                            storageManager.set("password", password);
                        })
                        .then(() => {
                            storageManager.set(
                                "sessionId",
                                result.data.login.sessionId
                            );
                        })
                        // Navigate to home screen
                        .then(() => {
                            console.log(
                                "Login successful. Navigating to home screen."
                            );
                            navigation.navigate("Home");
                        })
                        .catch((error) => {
                            console.error(
                                "Unable to save credential to local storage: " +
                                    error
                            );
                        });
                })
                .catch((error) => {
                    console.log(error);
                });
        });
    };

    const onForgotPasswordPress = () => {
        console.log("Forgot password pressed");
    };

    return (
        <ApolloProvider client={apolloClient}>
            <View style={gstyles.layout.container_100}>
                <View style={[gstyles.layout.container_80, { maxWidth: 300 }]}>
                    <Image
                        source={Logo}
                        style={[
                            _styles.logo,
                            { height: height / 8, width: width / 2 },
                        ]}
                    />

                    <CustomInput
                        placeholder="Username"
                        value={userId}
                        setValue={setUserId}></CustomInput>
                    <CustomInput
                        placeholder="Password"
                        value={password}
                        setValue={setPassword}
                        secureTextEntry={true}></CustomInput>

                    {wrongCredentials ? (
                        <Text style={{ color: color.error }}>
                            Wrong userId or password
                        </Text>
                    ) : null}

                    <CustomButton
                        onPress={Login}
                        buttonStyle={{
                            backgroundColor: color.primary,
                            maxWidth: 150,
                        }}
                        text="Login"
                    />

                    <Text style={{ margin: 10 }}> </Text>
                    <Text
                        onPress={onForgotPasswordPress}
                        style={gstyles.text.secondary_italic_underlined}>
                        Forgot Password?
                    </Text>
                </View>
            </View>
        </ApolloProvider>
    );
};

const _styles = StyleSheet.create({
    container: {
        alignItems: "center",
        justifyContent: "center",
        width: "60%",
    },

    logo: {
        marginBottom: 50,
        maxWidth: 300,
        maxHeight: 300,
        objectFit: "contain",
    },
});

export default LoginScreen;
