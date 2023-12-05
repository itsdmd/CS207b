import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";

import { ApolloProvider, gql } from "@apollo/client";
import apolloClient from "../../constants/apollo/client";

import * as ss from "../../components/SecureStore";

import colors from "../../constants/colors";
import * as gstyles from "../../constants/styles";

import CustomButton from "../../components/CustomButton";

const HomeScreen = ({ navigation }) => {
	const [sessionId, setSessionId] = useState("");
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		ss.get("sessionId")
			.then((value) => {
				setSessionId(value);
			})
			.then(() => {
				setLoading(false);
			});
	}, []);

	const onLogoutButtonPress = () => {
		console.log("Logout pressed");

		let username = "";
		let password = "";

		ss.get("username")
			.then((value) => {
				username = value;
			})
			.then(() => {
				ss.get("password");
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
							ss.remove("username");
							return result;
						})
						.then((result) => {
							ss.remove("password");
							return result;
						})
						.then((result) => {
							ss.remove("sessionId");
							return result;
						})
						// Navigate to login screen
						.then((result) => {
							if (result.data.logout) {
								console.log("Logged out. Navigating to login screen.");
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
	};

	return (
		<ApolloProvider client={apolloClient}>
			<View style={gstyles.layout.container_100}>
				<View style={gstyles.layout.container_80}>
					{loading ? null : <Text style={gstyles.text.primary_bold_italic}>{sessionId}</Text>}
					<CustomButton
						onPress={onLogoutButtonPress}
						buttonStyle={(backgroundColor = colors.error)}
						text="Logout"
					/>
				</View>
			</View>
		</ApolloProvider>
	);
};

export default HomeScreen;
