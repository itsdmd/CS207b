import { View, Image, Text, StyleSheet, useWindowDimensions } from "react-native";
import React, { useState } from "react";

import { ApolloClient, ApolloProvider, InMemoryCache, gql } from "@apollo/client";
import { APOLLO_SERVER_URL } from "@env";

const apolloClient = new ApolloClient({
	uri: APOLLO_SERVER_URL,
	cache: new InMemoryCache(),
});

import Logo from "../../../assets/sn-logo-white.png";
import WhiteInput from "../../components/CustomInput";
import ConfirmButton from "../../components/CustomButton/ConfirmButton";
import UnderlinedText from "../../components/CustomText/UnderlinedText";

const LoginScreen = () => {
	const { height, width } = useWindowDimensions();

	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const onLoginButtonPress = () => {
		console.log("Login pressed");
		console.log("Connected to " + APOLLO_SERVER_URL);

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
			.then((result) => console.log(result))
			.catch((error) => console.log(error));
	};

	const onForgotPasswordPress = () => {
		console.log("Forgot password pressed");
	};

	return (
		<ApolloProvider client={apolloClient}>
			<View style={styles.container}>
				<Image
					source={Logo}
					style={[styles.logo, { height: height / 8, width: width / 2 }]}
				/>

				<WhiteInput
					placeholder="Username"
					value={username}
					setValue={setUsername}
				></WhiteInput>
				<WhiteInput
					placeholder="Password"
					value={password}
					setValue={setPassword}
					secureTextEntry={true}
				></WhiteInput>

				<ConfirmButton
					onPress={onLoginButtonPress}
					text="Login"
				></ConfirmButton>

				<Text style={{ margin: 10 }}> </Text>
				<UnderlinedText onPress={onForgotPasswordPress}>Forgot Password?</UnderlinedText>
			</View>
		</ApolloProvider>
	);
};

const styles = StyleSheet.create({
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
