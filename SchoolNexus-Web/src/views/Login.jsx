import logo from "../assets/logo.png";
import React, { useState, useEffect } from "react";
import { Container, Row, Col, Image } from "react-bootstrap";

import LoginForm from "../components/LoginForm.jsx";
import Logout from "../services/api/logout.service.js";
import Authenticate from "../services/api/authenticate.service.js";
import GetUser from "../services/api/user.service.js";
import {
    userExistsOnLocalStorage,
    resetLocalStorage,
} from "../services/LocalStorage/LocalStorage.service.js";

export default function Login() {
    const [user, setUser] = useState({});
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        if (userExistsOnLocalStorage()) {
            if (
                Authenticate(
                    localStorage.getItem("userId"),
                    localStorage.getItem("userCred")
                )
            ) {
                setLoggedIn(true);
                setUser({
                    id: localStorage.getItem("userId"),
                    cred: localStorage.getItem("userCred"),
                    fullName: GetUser({ id: localStorage.getItem("userId") })
                        .fullName,
                });
            } else {
                console.error("User not authenticated. Logging out...");
                setLoggedIn(false);
                setUser({});
                resetLocalStorage();
            }
        }
    }, []);

    const LogoutBtnPressed = async () => {
        console.log("Logout pressed");

        const LogoutResult = await Logout(user.id);

        if (LogoutResult.success) {
            setLoggedIn(false);
            setUser({});
            console.log("Logout successful");
        } else {
            console.error("Logout failed");
        }
    };

    const DisplayLoginForm = (display) => {
        if (display) {
            return <LoginForm />;
        } else {
            return (
                <div>
                    <p className="text-center">Welcome {user.fullName}</p>
                    <button
                        className="btn btn-primary"
                        onClick={LogoutBtnPressed}>
                        Logout
                    </button>
                </div>
            );
        }
    };

    return (
        <Container className="align-center mt-5 mb-5">
            <Row className="align-center align-items-center">
                <Col
                    col="6"
                    className="mb-5">
                    <div className="d-flex flex-column ms-5">
                        <div className="text-center">
                            <Image
                                src={logo}
                                width={300}
                                height={350}
                            />
                            <h4 className="mt-1 mb-5 pb-1">Login</h4>
                        </div>

                        <DisplayLoginForm display={!loggedIn} />
                    </div>
                </Col>

                <Col
                    col="6"
                    className="mb-5 align-center">
                    <div className="d-flex flex-column  justify-content-center gradient h-100 mb-4">
                        <div className="text-black px-3 py-4 p-md-5 mx-md-4 text-center">
                            <h4 className="mb-4">SchoolNexus is the future</h4>
                            <p className="small mb-0">
                                SchoolNexus App offers a comprehensive solution
                                for streamlining various administrative tasks in
                                educational institutions.
                            </p>
                        </div>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}
