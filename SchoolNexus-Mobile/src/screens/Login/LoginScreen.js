import { View, Image, Text, StyleSheet, useWindowDimensions } from "react-native";
import React, { useState } from "react";

import Logo from "../../../assets/sn-logo-white.png";
import WhiteInput from "../../components/CustomInput";
import ConfirmButton from "../../components/CustomButton/ConfirmButton";
import UnderlinedText from "../../components/CustomText/UnderlinedText";

const LoginScreen = () => {
	const { height, width } = useWindowDimensions();

	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const onLoginButtonPress = () => {
		console.log("Login button pressed");
	};

	const onForgotPasswordPress = () => {
		console.log("Forgot password pressed");
	};

	return (
		<View style={styles.container}>
			<Image
				source={Logo}
				style={[styles.logo, { height: height / 8, width: width / 2 }]}
			/>

			<WhiteInput
				placeholder="Username"
				value={username}
				setValue={setUsername}
			></WhiteInput>
			<WhiteInput
				placeholder="Password"
				value={password}
				setValue={setPassword}
				secureTextEntry={true}
			></WhiteInput>

			<ConfirmButton
				onPress={onLoginButtonPress}
				text="Login"
			></ConfirmButton>

			<Text style={{ margin: 10 }}> </Text>
			<UnderlinedText onPress={onForgotPasswordPress}>Forgot Password?</UnderlinedText>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		alignItems: "center",
		justifyContent: "center",
		width: "60%",
	},

	logo: {
		marginBottom: 50,
		maxWidth: 200,
		maxHeight: 200,
	},
});

export default LoginScreen;
