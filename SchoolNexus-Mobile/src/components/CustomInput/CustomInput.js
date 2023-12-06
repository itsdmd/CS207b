import { View, Text, TextInput, StyleSheet } from "react-native";
import React from "react";
import colors from "../../constants/colors";
import * as gstyles from "../../constants/styles";

const CustomInput = ({ value, setValue, placeholder, containerStyle, textStyle, ...props }) => {
	return (
		<View style={[styles.container, containerStyle]}>
			<TextInput
				style={[gstyles.text.primary, textStyle]}
				placeholder={placeholder}
				placeholderTextColor={colors.text_secondary}
				onChangeText={(text) => setValue(text)}
				value={value}
				{...props}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		borderColor: colors.text_primary,
		borderRadius: 10,
		borderWidth: 1,
		height: 45,
		margin: 12,
		padding: 10,
		width: "100%",
	},
});

export default CustomInput;
