export async function userExistsOnLocalStorage() {
    if (localStorage.getItem("userId") && localStorage.getItem("userCred")) {
        console.log("User exists in local storage");
        return true;
    } else {
        console.log("User does not exist in local storage");
        return false;
    }
}

export async function updateUserObjFromLocalStorage(userObj) {
    if (userExistsOnLocalStorage()) {
        userObj.id = localStorage.getItem("userId");
        userObj.cred = localStorage.getItem("userCred");
        userObj.fullName = localStorage.getItem("userFullName");
        return userObj;
    } else {
        console.error("User does not exist in local storage");
        return null;
    }
}

export async function updateLocalStorageFromUserObj(userObj) {
    try {
        localStorage.setItem("userId", userObj.id);
        localStorage.setItem("userCred", userObj.cred);
        localStorage.setItem("userFullName", userObj.fullName);
        return true;
    } catch (e) {
        console.error(e);
        return false;
    }
}

export async function resetLocalStorage() {
    try {
        localStorage.removeItem("userId");
        localStorage.removeItem("userCred");
        localStorage.removeItem("userFullName");
        return true;
    } catch (e) {
        console.error(e);
        return false;
    }
}
