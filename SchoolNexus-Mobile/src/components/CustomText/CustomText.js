import { Text, StyleSheet } from "react-native";

const CustomText = ({ children, style, ...props }) => {
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
		color: "#fff",
	},
});

export default CustomText;
