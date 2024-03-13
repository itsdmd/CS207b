import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

import Authenticate from "../api/authenticate.service";
import GetUser from "../api/user.service";
import { userExistsOnLocalStorage } from "../LocalStorage/LocalStorage.service";

const ProtectedRoute = ({ allowedAccountTypes, children }) => {
    const [render, setRender] = useState(false);

    if (!userExistsOnLocalStorage()) {
        setRender(
            <Navigate
                to="/login"
                replace
            />
        );
    }

    useEffect(() => {
        console.log("Checking if user is allowed to access route...");
        async function renderRoute() {
            const authStatus = await Authenticate(
                localStorage.getItem("userId"),
                localStorage.getItem("userCred")
            );

            if (!authStatus.success) {
                console.error(
                    "User not authenticated. Redirect to login screen..."
                );
                setRender(
                    <Navigate
                        to="/login"
                        replace
                    />
                );
            }

            const user = await GetUser({ id: localStorage.getItem("userId") });

            if (allowedAccountTypes.indexOf(user.accountType) !== -1) {
                console.log("User allowed to view page");
                setRender(children);
            } else {
                console.error(
                    "User not authorized. Redirect to login screen..."
                );
                setRender(
                    <Navigate
                        to="/login"
                        replace
                    />
                );
            }
        }

        renderRoute();
    }, []);

    return render;
};
export default ProtectedRoute;
