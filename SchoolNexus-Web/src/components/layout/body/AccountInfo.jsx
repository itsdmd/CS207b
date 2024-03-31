import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Button,
    Row,
    Col,
    Form,
    FormControl,
    FormLabel,
    Container,
    FormGroup,
} from "react-bootstrap";

import GetUser, { NewUser } from "../../../services/api/user.service";
import Login from "../../../services/api/login.service";
import Logout from "../../../services/api/logout.service";

export default function AccountInfo() {
    const navigate = useNavigate();

    const [userId, setUserId] = useState("");
    const [fullName, setFullName] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState();
    const [gender, setGender] = useState("");
    const [accountType, setAccountType] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [schoolName, setSchoolName] = useState("");
    const [subjectName, setSubjectName] = useState("");

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        async function fetchData() {
            const user = (
                await GetUser({ id: localStorage.getItem("userId") })
            )[0];

            console.log("user:", user);

            setUserId(user.id);
            setFullName(user.fullName);
            setDateOfBirth(user.dateOfBirth);
            setGender(user.gender);
            setAccountType(user.accountType);
            setEmail(user.email);
            setPhone(user.phoneNumber);
            setAddress(user.address);
            setSchoolName(user.usa[0].school.name);
            setSubjectName(user.tsa[0].subject.name);
        }

        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setErrorMessage("Passwords do not match");
            return;
        }

        const LoginResult = await Login(userId, currentPassword);

        if (LoginResult.success) {
            const newUser = {
                id: userId,
                password: newPassword,
                fullName: fullName,
                dateOfBirth: dateOfBirth,
                gender: gender,
                accountType: accountType,
                email: email,
                phoneNumber: phone,
                address: address,
            };
            const response = await NewUser(newUser);
            if (response.id) {
                console.log("response:", response);
                Logout();
                navigate("/login");
            }
        } else {
            setErrorMessage("Incorrect password");
            return;
        }
    };

    return (
        <Container className="py-5 h-100">
            <Row className="d-flex justify-content-center align-items-start h-100">
                <h3 className="mb-5">Account Information</h3>
                <div className="my-4">
                    <Row>
                        <Col>
                            <div className="card-body p-md-5 text-black">
                                <Form onSubmit={(e) => handleSubmit(e)}>
                                    {/* User ID */}
                                    <Row className="md-6 mb-4">
                                        <div className="form-outline">
                                            <FormLabel>User ID</FormLabel>
                                            <FormControl
                                                type="text"
                                                className="lg"
                                                value={userId}
                                                disabled
                                            />
                                        </div>
                                    </Row>

                                    {/* Full Name */}
                                    <Row className="md-6 mb-4">
                                        <div className="form-outline">
                                            <FormLabel>Full Name</FormLabel>
                                            <FormControl
                                                type="text"
                                                className="lg"
                                                value={fullName}
                                                disabled
                                            />
                                        </div>
                                    </Row>

                                    {/* Date of Birth*/}
                                    <Row className="md-6 mb-4">
                                        <div className="form-outline">
                                            <FormLabel>
                                                Date of Birth{" "}
                                                <small className="text-secondary">
                                                    <i>(YYYY-MM-DD)</i>
                                                </small>
                                            </FormLabel>
                                            <FormControl
                                                type="text"
                                                className="lg"
                                                value={dateOfBirth}
                                                disabled
                                            />
                                        </div>
                                    </Row>

                                    {/* Gender */}
                                    <Row className="md-6 mb-4">
                                        <div className="form-outline">
                                            <FormLabel>Gender</FormLabel>
                                            <FormControl
                                                type="text"
                                                className="lg"
                                                value={gender}
                                                disabled
                                            />
                                        </div>
                                    </Row>

                                    {/* Account Type */}
                                    <Row className="md-6 mb-4">
                                        <div className="form-outline">
                                            <FormLabel>Account Type</FormLabel>
                                            <FormControl
                                                type="text"
                                                className="lg"
                                                value={accountType}
                                                disabled
                                            />
                                        </div>
                                    </Row>

                                    {/* Teacher's subject assignment */}
                                    {localStorage.getItem("userAccountType") ===
                                        "TEACHER" && (
                                        <Row className="md-6 mb-4">
                                            <div className="form-outline">
                                                <FormLabel>
                                                    Teaching Subject
                                                </FormLabel>
                                                <FormControl
                                                    type="text"
                                                    className="lg"
                                                    value={subjectName}
                                                    disabled
                                                />
                                            </div>
                                        </Row>
                                    )}

                                    {/* Phone number */}
                                    <Row className="md-6 mb-4">
                                        <div className="form-outline">
                                            <FormLabel>Phone Number</FormLabel>
                                            <FormControl
                                                type="text"
                                                className="lg"
                                                value={phone}
                                                disabled
                                            />
                                        </div>
                                    </Row>

                                    {/* Email */}
                                    <Form.Group className="mb-4">
                                        <FormLabel>Email</FormLabel>
                                        <FormControl
                                            type="text"
                                            value={email}
                                            disabled
                                        />
                                    </Form.Group>

                                    {/* Address */}
                                    <Form.Group className="mb-4">
                                        <FormLabel>Address </FormLabel>
                                        <FormControl
                                            type="text"
                                            value={address}
                                            disabled
                                        />
                                    </Form.Group>

                                    {/* School */}
                                    <Form.Group className="mb-4">
                                        <FormLabel>School </FormLabel>
                                        <FormControl
                                            type="text"
                                            value={schoolName}
                                            disabled
                                        />
                                    </Form.Group>

                                    {/* Password */}
                                    <Form.Group className="mb-4">
                                        <FormLabel>Current Password </FormLabel>
                                        <FormControl
                                            type="password"
                                            value={currentPassword}
                                            onChange={(e) =>
                                                setCurrentPassword(
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-4">
                                        <FormLabel>New Password </FormLabel>
                                        <FormControl
                                            type="password"
                                            value={newPassword}
                                            onChange={(e) =>
                                                setNewPassword(e.target.value)
                                            }
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-4">
                                        <FormLabel>Confirm Password </FormLabel>
                                        <FormControl
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) =>
                                                setConfirmPassword(
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </Form.Group>

                                    <Button
                                        variant="primary"
                                        type="submit">
                                        Reset Password
                                    </Button>

                                    {/* Error message */}
                                    {errorMessage === "" ? null : (
                                        <div
                                            class="alert alert-danger alert-dismissible fade show mt-3"
                                            role="alert">
                                            {errorMessage}
                                        </div>
                                    )}
                                </Form>
                            </div>
                        </Col>
                    </Row>
                </div>
            </Row>
        </Container>
    );
}
