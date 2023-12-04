import { View, Text, StyleSheet } from "react-native";
import React from "react";

import colors from "../../constants/colors";

const UnderlinedText = ({ children, style, ...props }) => {
	return (
		<Text
			style={[styles.text, style]}
			{...props}
		>
			{children}
		</Text>
	);
};

const styles = StyleSheet.create({
	text: {
		color: colors.color_text_primary,
		fontStyle: "italic",
		textDecorationLine: "underline",
	},
});

export default UnderlinedText;
