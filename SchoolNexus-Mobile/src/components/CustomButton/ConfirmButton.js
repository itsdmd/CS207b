import { View, Text, StyleSheet, Pressable } from "react-native";
import React from "react";
import colors from "../../constants/colors";

const ConfirmButton = ({ onPress, text }) => {
	return (
		<Pressable
			onPress={onPress}
			style={styles.button}
		>
			<Text style={styles.text}>{text}</Text>
		</Pressable>
	);
};

const styles = StyleSheet.create({
	button: {
		backgroundColor: colors.color_primary,

		width: "100%",

		padding: 10,
		marginVertical: 10,

		alignItems: "center",
		borderRadius: 10,
	},

	text: {
		color: colors.color_text_primary,
		fontWeight: "bold",
	},
});

export default ConfirmButton;
