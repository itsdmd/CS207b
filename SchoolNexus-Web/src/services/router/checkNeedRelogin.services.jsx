import Authenticate from "../api/authenticate.service";
import { resetLocalStorage } from "../LocalStorage/LocalStorage.service";

// Return true if user is NOT authenticated,
// false if is authenticated
export default async function checkNeedRelogin() {
    console.log("Checking if user is authenticated");

    try {
        console.log("userId:", localStorage.getItem("userId"));
        console.log("userCred:", localStorage.getItem("userCred"));

        const authStatus = (
            await Authenticate(
                localStorage.getItem("userId"),
                localStorage.getItem("userCred")
            )
        ).success;

        console.log("authStatus:", authStatus);

        if (!authStatus) {
            console.log("User not authenticated. Logging out...");
            window.location.href = "/";
            return true;
        } else {
            console.log("User authenticated");
            return false;
        }
    } catch (e) {
        console.warn("Unable to authenticate user. Logging out...");
        resetLocalStorage();
        window.location.href = "/";
        return true;
    }
}
