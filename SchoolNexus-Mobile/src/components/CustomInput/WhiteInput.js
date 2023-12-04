import { View, Text, TextInput, StyleSheet } from "react-native";
import React from "react";
import colors from "../../constants/colors";

const WhiteInput = ({ value, setValue, placeholder, secureTextEntry = false }) => {
	return (
		<View style={styles.container}>
			<TextInput
				style={styles.text_input}
				placeholder={placeholder}
				placeholderTextColor="#aaa"
				onChangeText={(text) => setValue(text)}
				value={value}
				secureTextEntry={secureTextEntry}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		height: 45,
		width: "100%",
		margin: 12,
		padding: 10,
		borderWidth: 1,
		borderColor: colors.color_text_primary,
	},

	text_input: {
		color: colors.color_text_primary,
	},
});

export default WhiteInput;
