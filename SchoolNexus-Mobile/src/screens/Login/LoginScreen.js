import { View, Image, Text, StyleSheet, useWindowDimensions } from "react-native";
import React, { useState } from "react";

import { ApolloProvider, gql } from "@apollo/client";
import apolloClient from "../../constants/apollo/client";

import * as mmkv from "../../constants/mmkv";

import color from "../../constants/colors";
import * as gstyles from "../../constants/styles";

import Logo from "../../../assets/sn-logo-white.png";
import CustomInput from "../../components/CustomInput";
import CustomButton from "../../components/CustomButton/CustomButton";

const LoginScreen = ({ navigation }) => {
	const { height, width } = useWindowDimensions();

	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const onLoginPress = () => {
		console.log("Login pressed");

		// Clear cache
		apolloClient.cache.reset().then(() => {
			// Request new sessionId
			apolloClient
				.query({
					query: gql`
				query {
					login(userId: "${username}", password: "${password}") {
						sessionId
					}
				}
				`,
				})
				.then((result) => {
					if (result.data.login === null || result.data.login === undefined) {
						console.error("Login failed");
						return false;
					}
					try {
						// Save session info to MMKV
						mmkv.userdata.set("username", username);
						mmkv.userdata.set("password", password);
						mmkv.userdata.set("sessionId", result.data.login.sessionId);

						// Navigate to home screen
						console.log("Login successful. Navigating to home screen.");
						navigation.navigate("Home");
					} catch (error) {
						console.error(error);
					}
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
						style={[_styles.logo, { height: height / 8, width: width / 2 }]}
					/>

					<CustomInput
						placeholder="Username"
						value={username}
						setValue={setUsername}
					></CustomInput>
					<CustomInput
						placeholder="Password"
						value={password}
						setValue={setPassword}
						secureTextEntry={true}
					></CustomInput>

					<CustomButton
						onPress={onLoginPress}
						buttonStyle={{ backgroundColor: color.primary, maxWidth: 150 }}
						text="Login"
					/>

					<Text style={{ margin: 10 }}> </Text>
					<Text
						onPress={onForgotPasswordPress}
						style={gstyles.text.secondary_italic_underlined}
					>
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
		maxWidth: "50%",
		maxHeight: "100%",
		objectFit: "contain",
	},
});

export default LoginScreen;
