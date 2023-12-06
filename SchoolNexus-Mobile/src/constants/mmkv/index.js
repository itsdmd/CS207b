import { MMKV } from "react-native-mmkv";

let tester = null;

try {
	tester = new MMKV({
		encryptionKey: process.env.MMKV_ENCRYPTION_KEY,
	});
} catch (e) {
	console.error("Encrypted MMKV failed to initialize. Using unencrypted MMKV.");
	tester = new MMKV();
}

export const userdata = tester;

export const settings = new MMKV();
