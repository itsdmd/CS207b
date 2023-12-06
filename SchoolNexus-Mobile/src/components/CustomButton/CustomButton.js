import { View, Text, StyleSheet, Pressable } from "react-native";
import React from "react";
import colors from "../../constants/colors";
import * as gstyles from "../../constants/styles";

const CustomButton = ({ onPress, text, buttonStyle, textStyle }) => {
	return (
		<Pressable
			onPress={onPress}
			style={[styles.button, buttonStyle]}
		>
			<Text style={[gstyles.text.primary_bold, textStyle]}>{text}</Text>
		</Pressable>
	);
};

const styles = StyleSheet.create({
	button: {
		backgroundColor: colors.primary,

		width: "100%",

		padding: 10,
		marginVertical: 10,

		alignItems: "center",
		borderRadius: 10,
	},
});

export default CustomButton;
