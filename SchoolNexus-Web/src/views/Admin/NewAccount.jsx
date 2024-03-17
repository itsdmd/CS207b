import React, { useState, useEffect } from "react";
import {
    Button,
    Row,
    Col,
    Image,
    Form,
    FormControl,
    FormLabel,
    Container,
    FormCheck,
    CloseButton,
} from "react-bootstrap";

import logo from "../../assets/school2.png";
import GetUser, { NewUser, DeleteUser } from "../../services/api/user.service";

export default function AdminNewAccount() {
    const [userId, setUserId] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState();
    const [gender, setGender] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [accountType, setAccountType] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const [filterUserId, setFilterUserId] = useState("");
    const [userList, setUserList] = useState([]);
    const [triggerUseEffect, setTriggerUseEffect] = useState(0);

    useEffect(() => {
        async function fetchData() {
            setUserList([]);
            const allUsers = await GetUser({});
            console.log("fetched user:", allUsers);

            for (let user of allUsers) {
                setUserList((userList) => [...userList, user]);
            }
        }

        fetchData();
    }, [triggerUseEffect]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("handleSubmitButton pressed");

        if (!fullName || !email || !phone || !gender || !accountType) {
            setErrorMessage("Please fill in all required fields.");
            return;
        }

        const formData = {
            id: userId,
            password: password,
            fullName: fullName,
            dateOfBirth: dateOfBirth,
            gender: gender,
            email: email,
            phoneNumber: phone,
            address: address,
            accountType: accountType,
        };

        const response = await NewUser(formData);
        console.log(response);

        setTriggerUseEffect(triggerUseEffect + 1);
    };

    const handleDeleteBtnPressed = async (e) => {
        console.log("handleDeleteBtnPressed");

        const response = await DeleteUser(e.target.value);
        console.log(response);

        setTriggerUseEffect(triggerUseEffect + 1);
    };

    const handleFilterSubmit = async (e) => {
        e.preventDefault();
        console.log("handleFilterSubmit pressed");

        setUserList([]);
        const allUsers = await GetUser({ id: filterUserId });
        console.log("fetched user:", allUsers);

        for (let user of allUsers) {
            setUserList((userList) => [...userList, user]);
        }
    };

    return (
        <Container className="py-5 h-100">
            <Row className="d-flex justify-content-center align-items-start h-100">
                <Col>
                    <h3 className="mb-5">New User Account</h3>
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
                                                    id="userId"
                                                    className="lg"
                                                    value={userId}
                                                    onChange={(e) =>
                                                        setUserId(
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </div>
                                        </Row>

                                        {/* Password */}
                                        <Row className="md-6 mb-4">
                                            <div className="form-outline">
                                                <FormLabel>Password</FormLabel>
                                                <FormControl
                                                    type="password"
                                                    id="password"
                                                    className="lg"
                                                    value={password}
                                                    onChange={(e) =>
                                                        setPassword(
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </div>
                                        </Row>

                                        {/* Full Name */}
                                        <Row className="md-6 mb-4">
                                            <div className="form-outline">
                                                <FormLabel>Full name</FormLabel>
                                                <FormControl
                                                    type="text"
                                                    id="fullname"
                                                    className="lg"
                                                    value={fullName}
                                                    onChange={(e) =>
                                                        setFullName(
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </div>
                                        </Row>

                                        {/* Date of Birth */}
                                        <Row className="md-6 mb-4">
                                            <div className="form-outline">
                                                <FormLabel>
                                                    Date Of Birth{" "}
                                                    <small className="text-secondary">
                                                        <i>(YYYY-MM-DD)</i>
                                                    </small>
                                                </FormLabel>
                                                <FormControl
                                                    type="text"
                                                    for="dateOfBirth"
                                                    className="lg"
                                                    value={dateOfBirth}
                                                    onChange={(e) => {
                                                        setDateOfBirth(
                                                            e.target.value
                                                        );
                                                    }}
                                                    onBlur={(e) => {
                                                        setDateOfBirth(
                                                            new Date(
                                                                e.target.value
                                                            ).toISOString()
                                                        );
                                                        console.log(
                                                            dateOfBirth
                                                        );
                                                    }}
                                                />
                                            </div>
                                        </Row>

                                        {/* Phone number */}
                                        <Row className="md-6 mb-4">
                                            <div className="form-outline">
                                                <FormLabel>
                                                    Phone Number
                                                </FormLabel>
                                                <FormControl
                                                    type="text"
                                                    className="lg"
                                                    onChange={(e) =>
                                                        setPhone(e.target.value)
                                                    }
                                                />
                                            </div>
                                        </Row>

                                        {/* Email */}
                                        <Form.Group
                                            className="mb-4"
                                            controlId="email">
                                            <FormLabel>Email</FormLabel>
                                            <FormControl
                                                type="text"
                                                value={email}
                                                onChange={(e) =>
                                                    setEmail(e.target.value)
                                                }
                                            />
                                        </Form.Group>

                                        {/* Address */}
                                        <Form.Group
                                            className="mb-4"
                                            controlId="address">
                                            <FormLabel>Address </FormLabel>
                                            <FormControl
                                                type="text"
                                                value={address}
                                                onChange={(e) =>
                                                    setAddress(e.target.value)
                                                }
                                            />
                                        </Form.Group>

                                        {/* Gender */}
                                        <div className="d-md-flex justify-content-start align-items-center mb-4 py-2">
                                            <h6 className="mb-0 me-4">
                                                Gender:{" "}
                                            </h6>
                                            <Form.Group
                                                onChange={(e) => {
                                                    setGender(e.target.value);
                                                }}>
                                                <Form.Check
                                                    type="radio"
                                                    id="male"
                                                    name="radioGroup"
                                                    value="MALE"
                                                    label="Male"
                                                />
                                                <Form.Check
                                                    type="radio"
                                                    id="female"
                                                    name="radioGroup"
                                                    value="FEMALE"
                                                    label="Female"
                                                />
                                                <Form.Check
                                                    type="radio"
                                                    id="other"
                                                    name="radioGroup"
                                                    value="OTHER"
                                                    label="Other"
                                                />
                                            </Form.Group>
                                        </div>

                                        {/* Role */}
                                        <Row className="md-6 mb-4">
                                            <Form.Select
                                                className="select"
                                                value={accountType}
                                                onChange={(e) =>
                                                    setAccountType(
                                                        e.target.value
                                                    )
                                                }>
                                                <option value="">Role</option>
                                                <option value="STUDENT">
                                                    Student
                                                </option>
                                                <option value="TEACHER">
                                                    Teacher
                                                </option>
                                                <option value="PRINCIPAL">
                                                    Principal
                                                </option>
                                                <option value="ADMIN">
                                                    Admin
                                                </option>
                                            </Form.Select>
                                        </Row>

                                        <div className="d-flex justify-content-end pt-3">
                                            <Button
                                                type="button"
                                                className="btn btn-light btn-lg btn-secondary">
                                                Reset all
                                            </Button>
                                            <Button
                                                type="submit"
                                                className="btn btn-warning btn-lg ms-2">
                                                Create
                                            </Button>
                                        </div>
                                    </Form>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </Col>

                <Col>
                    <h3 className="mb-5">Manage User Account</h3>
                    <div className="card-body p-md-5 text-black">
                        <Form onSubmit={(e) => handleFilterSubmit(e)}>
                            {/* User ID */}
                            <Row className="md-6 mb-4">
                                <div className="form-outline">
                                    <FormLabel>User ID</FormLabel>
                                    <div className="d-flex justify-content-between">
                                        <FormControl
                                            type="text"
                                            id="filterUserId"
                                            className="lg"
                                            value={filterUserId}
                                            onChange={(e) =>
                                                setFilterUserId(e.target.value)
                                            }
                                        />
                                        <Button
                                            type="submit"
                                            className="btn btn-warning">
                                            Filter
                                        </Button>
                                    </div>
                                </div>
                            </Row>
                        </Form>
                    </div>
                    <Container
                        className="w-80 border text-center "
                        style={{
                            borderColor: "azure",
                            height: "512px",
                            borderRadius: "30px",
                            overflowY: "auto",
                        }}>
                        {userList.map((user) => (
                            <div>
                                <Form.Label className="border mt-3 w-75">
                                    {user.id} - {user.fullName}
                                </Form.Label>
                                <CloseButton
                                    value={user.id}
                                    className="bg-danger"
                                    onClick={handleDeleteBtnPressed}
                                />
                            </div>
                        ))}
                    </Container>
                </Col>
            </Row>
        </Container>
    );
}
