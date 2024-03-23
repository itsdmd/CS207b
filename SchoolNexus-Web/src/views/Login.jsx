import logo from "../assets/logo.png";
import React, { useState, useEffect } from "react";
import { Container, Row, Col, Image, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import Login from "../services/api/login.service.js";
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
    const navigate = useNavigate();

    let user = {};

    useEffect(() => {
        CheckLocalStorage();

        if (loggedIn) {
            navigate("/home");
        }
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
            // window.location.reload(true);
            navigate("/home");
        } else {
            console.error("Login failed");
        }
    };

    return (
        <Container className="align-center mt-5 mb-5 col-4">
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

                <Form onSubmit={(e) => LoginBtnPressed(e)}>
                    <Form.Group
                        className="mb-3"
                        controlId="formBasicEmail">
                        <Form.Control
                            type="text"
                            placeholder="Enter username"
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group
                        className="mb-3"
                        controlId="formBasicPassword">
                        <Form.Control
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </Form.Group>

                    <div className="text-center pt-1 mb-5 pb-1">
                        <Button
                            className="mb-4 w-100 gradient"
                            type="submit">
                            Login
                        </Button>
                    </div>
                </Form>
            </div>
        </Container>
    );
}
