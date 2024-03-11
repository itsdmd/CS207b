import logo from "../assets/logo.png";
import React, { useState, useEffect } from "react";
import { Container, Row, Col, Image, Form, Button } from "react-bootstrap";

// import LoginForm from "../components/LoginForm.jsx";

import Login from "../services/api/login.service.js";
import Logout from "../services/api/logout.service.js";
import Authenticate from "../services/api/authenticate.service.js";
import {
    updateLocalStorageFromUserObj,
    userExistsOnLocalStorage,
    resetLocalStorage,
} from "../services/LocalStorage/LocalStorage.service.js";

export default function LoginPage() {
    const [userId, setUserId] = useState("");
    const [password, setPassword] = useState("");
    const [loggedIn, setLoggedIn] = useState(false);

    let user = {};

    useEffect(() => {
        CheckLocalStorage();
    }, []);

    const CheckLocalStorage = async () => {
        console.log("Checking local storage...");
        if (userExistsOnLocalStorage()) {
            console.log("User exists in local storage");

            console.log("userId:", localStorage.getItem("userId"));
            console.log("userCred:", localStorage.getItem("userCred"));

            const AuthResult = await Authenticate(
                localStorage.getItem("userId"),
                localStorage.getItem("userCred")
            );

            console.log("AuthResult:", AuthResult);

            if (AuthResult.success) {
                console.log("User authenticated");
                setLoggedIn(true);
                user.id = localStorage.getItem("userId");
                user.cred = localStorage.getItem("userCred");
                user.fullName = localStorage.getItem("userFullName");
                console.log("User:", user);
            } else {
                console.error("User not authenticated. Logging out...");
                setLoggedIn(false);
                user = {};
                resetLocalStorage();
            }
        }
    };

    const LoginBtnPressed = async (event) => {
        event.preventDefault();
        console.log("Login pressed");

        const LoginResult = await Login(userId, password);

        if (LoginResult.success) {
            updateLocalStorageFromUserObj(LoginResult.data);
            console.log("Login successful");
            window.location.reload(true);
        } else {
            console.error("Login failed");
        }
    };

    const LogoutBtnPressed = async () => {
        console.log("Logout pressed");

        const LogoutResult = await Logout();

        if (LogoutResult.success) {
            setLoggedIn(false);
            user = {};
            resetLocalStorage();
            console.log("Logout successful");
        } else {
            console.error("Logout failed");
        }
    };

    function DisplayLoginForm() {
        if (!loggedIn) {
            return (
                <Form onSubmit={(e) => LoginBtnPressed(e)}>
                    <Form.Group
                        className="mb-3"
                        controlId="formBasicEmail">
                        <Form.Control
                            type="text"
                            placeholder="Enter username"
                            onChange={(e) => setUserId(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group
                        className="mb-3"
                        controlId="formBasicPassword">
                        <Form.Control
                            type="password"
                            placeholder="Password"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </Form.Group>

                    <div className="text-center pt-1 mb-5 pb-1">
                        <Button
                            className="mb-4 w-100 gradient"
                            type="submit">
                            Sign in
                        </Button>
                        <a
                            className="text-muted"
                            href="#!">
                            Forgot password?
                        </a>
                    </div>
                </Form>
            );
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
    }

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
                            <h4
                                className="mt-1 mb-5 pb-1"
                                onClick={LoginBtnPressed}>
                                Login
                            </h4>
                        </div>

                        <DisplayLoginForm />
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
