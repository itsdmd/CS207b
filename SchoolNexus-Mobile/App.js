import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { ApolloProvider } from "@apollo/client";

import colors from "./src/constants/colors";

import LoginScreen from "./src/screens/Login";

export default function App() {
	return (
		<View
			style={[
				styles.container,
				{
					backgroundColor: colors.color_bg,
				},
			]}
		>
			<LoginScreen />
			<StatusBar style="auto" />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
	},
});
