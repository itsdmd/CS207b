import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SS from "expo-secure-store";

export async function set(key, value) {
    const compat = await SS.isAvailableAsync();

    switch (compat) {
        case true:
            // console.log("Accessing SecureStore");
            return await SS.setItemAsync(key, value);
        case false:
            // console.warn("Accessing unencrypted AsyncStorage");
            return await AsyncStorage.setItem(key, value);
        default:
            console.error("SecureStore availability check failed");
            break;
    }
}

export async function get(key) {
    const compat = await SS.isAvailableAsync();

    switch (compat) {
        case true:
            // console.log("Accessing SecureStore");
            return await SS.getItemAsync(key);
        case false:
            // console.warn("Accessing unencrypted AsyncStorage");
            return await AsyncStorage.getItem(key);
        default:
            console.error("SecureStore availability check failed");
            break;
    }
}

export async function del(key) {
    const compat = await SS.isAvailableAsync();

    switch (compat) {
        case true:
            // console.log("Accessing SecureStore");
            return await SS.deleteItemAsync(key);
        case false:
            // console.warn("Accessing unencrypted AsyncStorage");
            return await AsyncStorage.removeItem(key);
        default:
            console.error("SecureStore availability check failed");
            break;
    }
}
