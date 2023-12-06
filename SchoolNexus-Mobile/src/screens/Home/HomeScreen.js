import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";

import { ApolloProvider, gql } from "@apollo/client";
import apolloClient from "../../constants/apollo/client";

import * as mmkv from "../../constants/mmkv";

import colors from "../../constants/colors";
import * as gstyles from "../../constants/styles";

import CustomButton from "../../components/CustomButton";

const HomeScreen = ({ navigation }) => {
	const [sessionId, setSessionId] = useState("");
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		setSessionId(mmkv.settings.getString("sessionId"));
		setLoading(false);
	}, []);

	const onLogoutButtonPress = () => {
		console.log("Logout pressed");

		let username = mmkv.userdata.getString("username");
		let password = mmkv.userdata.getString("password");

		// Request delete sessionId
		apolloClient
			.query({
				query: gql`
					query {
						logout(userId: "${username}", password: "${password}")
					}
				`,
			})
			.then((result) => {
				if (result.data.logout) {
					// Clean MMKV
					mmkv.userdata.delete("username");
					mmkv.userdata.delete("password");
					mmkv.userdata.delete("sessionId");

					// Navigate to login screen
					console.log("Logged out. Navigating to login screen.");
					navigation.navigate("Login");
					return true;
				} else {
					console.error("Logout failed.");
					return false;
				}
			});
	};

	return (
		<ApolloProvider client={apolloClient}>
			<View style={gstyles.layout.container_100}>
				<View style={gstyles.layout.container_80}>
					{loading ? null : <Text style={gstyles.text.primary_bold_italic}>{sessionId}</Text>}
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
