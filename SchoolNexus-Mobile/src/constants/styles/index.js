import { StyleSheet } from "react-native";
import colors from "../colors";

export const layout = StyleSheet.create({
	container_100: {
		width: "100%",
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: colors.bg,
	},
	container_90: {
		width: "90%",
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: colors.bg,
	},
	container_80: {
		width: "80%",
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: colors.bg,
	},
});

export const text = StyleSheet.create({
	primary: {
		color: colors.text_primary,
	},
	secondary: {
		color: colors.text_secondary,
	},

	primary_bold: {
		color: colors.text_primary,
		fontWeight: "bold",
	},
	secondary_bold: {
		color: colors.text_secondary,
		fontWeight: "bold",
	},

	primary_italic: {
		color: colors.text_primary,
		fontStyle: "italic",
	},
	secondary_italic: {
		color: colors.text_secondary,
		fontStyle: "italic",
	},

	primary_bold_italic: {
		color: colors.text_primary,
		fontWeight: "bold",
		fontStyle: "italic",
	},
	secondary_bold_italic: {
		color: colors.text_secondary,
		fontWeight: "bold",
		fontStyle: "italic",
	},

	primary_underlined: {
		color: colors.text_primary,
		textDecorationLine: "underline",
	},
	secondary_underlined: {
		color: colors.text_secondary,
		textDecorationLine: "underline",
	},

	primary_bold_underlined: {
		color: colors.text_primary,
		fontWeight: "bold",
		textDecorationLine: "underline",
	},
	secondary_bold_underlined: {
		color: colors.text_secondary,
		fontWeight: "bold",
		textDecorationLine: "underline",
	},

	primary_italic_underlined: {
		color: colors.text_primary,
		fontStyle: "italic",
		textDecorationLine: "underline",
	},
	secondary_italic_underlined: {
		color: colors.text_secondary,
		fontStyle: "italic",
		textDecorationLine: "underline",
	},

	primary_bold_italic_underlined: {
		color: colors.text_primary,
		fontWeight: "bold",
		fontStyle: "italic",
		textDecorationLine: "underline",
	},
	secondary_bold_italic_underlined: {
		color: colors.text_secondary,
		fontWeight: "bold",
		fontStyle: "italic",
		textDecorationLine: "underline",
	},
});
