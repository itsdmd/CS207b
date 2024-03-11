import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";

import Login from "../services/api/login.service.js";
import { updateLocalStorageFromUserObj } from "../services/LocalStorage/LocalStorage.service.js";

export default function LoginForm() {
    const [userId, setUserId] = useState("");
    const [password, setPassword] = useState("");

    const LoginBtnPressed = async (event) => {
        event.preventDefault();
        console.log("Login pressed");

        const LoginResult = await Login(userId, password);

        if (LoginResult.success) {
            updateLocalStorageFromUserObj(LoginResult.user);
            console.log("Login successful");
        } else {
            console.error("Login failed");
        }
    };

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
}
