import React from "react";
import {
    Row,
    Col,
    Image,
    Form,
    FormControl,
    FormLabel,
    Container,
    FormCheck,
} from "react-bootstrap";
import logo from "../../assets/school2.png";
import FormCheckLabel from "react-bootstrap/esm/FormCheckLabel";
import FormCheckInput from "react-bootstrap/esm/FormCheckInput";
import { useState } from "react";

export default function AdminNewAccount() {
    const [firstname, setFirstName] = useState("");
    const [lastname, setLastName] = useState("");
    const [dateOfBirth, setdateOfBirth] = useState();
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [schoolName, setschoolName] = useState("");
    const [gender, setGender] = useState("");
    const [role, setRole] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("handleSubmitButton pressed");

        // if (!firstname || !lastname || !email || !phone || !gender || !role) {
        //     setErrorMessage("Please fill in all required fields.");
        //     return;
        // }

        const formData = {
            firstname,
            lastname,
            dateOfBirth,
            email,
            phone,
            address,
            schoolName,
            gender,
            role,
            errorMessage,
        };

        console.log(formData);
    };

    const submitButtonPressed = async (event) => {
        event.preventDefault();
        console.log("Submit button pressed");

        // const LoginResult = await Login(userId, password);

        // if (LoginResult.success) {
        //     updateLocalStorageFromUserObj(LoginResult.data);
        //     console.log("Login successful");
        //     // window.location.reload(true);
        //     navigate("/home");
        // } else {
        //     console.error("Login failed");
        // }
    };

    // const handleRoleSubmitted = async (event) => {
    //     event.preventDefault();
    //     console.log(event);
    //     const roleChoosed = event.target.value;
    //     console.log(roleChoosed);
    //     if (roleChoosed != "-1") setRole(roleChoosed);
    //     else {
    //         console.log("need Role choose");
    //         setErrorMessage("Please choose the role for user!");
    //     }
    // };
    return (
        <Container className="py-5 h-100">
            <Row className="d-flex justify-content-center align-items-center h-100">
                <Col>
                    <div class="my-4">
                        <Row>
                            <Col>
                                <Image
                                    src={logo}
                                    fluid
                                />
                            </Col>

                            <Col>
                                <div class="card-body p-md-5 text-black">
                                    <h3 class="mb-5 text-uppercase">
                                        Registration form
                                    </h3>

                                    <Form onSubmit={(e) => handleSubmit(e)}>
                                        <Row>
                                            <Col className="md-6 mb-4">
                                                <div class="form-outline">
                                                    <FormControl
                                                        type="text"
                                                        //for="firstname"
                                                        id="firstname"
                                                        className="lg"
                                                        value={firstname}
                                                        onChange={(e) =>
                                                            setFirstName(
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                    <FormLabel
                                                    //controlId="firstname"
                                                    >
                                                        First name{" "}
                                                    </FormLabel>
                                                </div>
                                            </Col>
                                            <Col className="md-6 mb-4">
                                                <div class="form-outline">
                                                    <FormControl
                                                        type="text"
                                                        id="lastname"
                                                        for="lastname"
                                                        className="lg"
                                                        value={lastname}
                                                        onChange={(e) =>
                                                            setLastName(
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                    <FormLabel
                                                    //controlId="lastname"
                                                    >
                                                        Last name{" "}
                                                    </FormLabel>
                                                </div>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col className="md-6 mb-4">
                                                <div class="form-outline">
                                                    <FormControl
                                                        type="text"
                                                        for="dateOfBirth"
                                                        className="lg"
                                                        value={dateOfBirth}
                                                        onChange={(e) =>
                                                            setdateOfBirth(
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                    <FormLabel>
                                                        Date Of Birth
                                                    </FormLabel>
                                                </div>
                                            </Col>
                                            <Col className="md-6 mb-4">
                                                <div class="form-outline">
                                                    <FormControl
                                                        type="text"
                                                        className="lg"
                                                        onChange={(e) =>
                                                            setPhone(
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                    <FormLabel>
                                                        Phone Number{" "}
                                                    </FormLabel>
                                                </div>
                                            </Col>
                                        </Row>

                                        <Form.Group
                                            className="mb-4"
                                            controlId="email">
                                            <FormControl
                                                type="text"
                                                value={email}
                                                onChange={(e) =>
                                                    setEmail(e.target.value)
                                                }
                                            />
                                            <FormLabel>Email </FormLabel>
                                        </Form.Group>
                                        <Form.Group
                                            className="mb-4"
                                            controlId="address">
                                            <FormControl
                                                type="text"
                                                value={address}
                                                onChange={(e) =>
                                                    setAddress(e.target.value)
                                                }
                                            />
                                            <FormLabel>Address </FormLabel>
                                        </Form.Group>

                                        <Form.Group
                                            className="mb-4"
                                            controlId="schoolName">
                                            <FormControl
                                                type="text"
                                                value={schoolName}
                                                onChange={(e) =>
                                                    setschoolName(
                                                        e.target.value
                                                    )
                                                }
                                            />
                                            <FormLabel>School Name </FormLabel>
                                        </Form.Group>

                                        <div class="d-md-flex justify-content-start align-items-center mb-4 py-2">
                                            <h6 class="mb-0 me-4">Gender: </h6>

                                            <FormCheck
                                                className="inline mb-0 me-4"
                                                id="male">
                                                <FormCheckInput
                                                    value={"male"}
                                                    onClick={(e) =>
                                                        setGender(
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                                <FormCheckLabel>
                                                    Male{" "}
                                                </FormCheckLabel>
                                            </FormCheck>

                                            <FormCheck
                                                className="inline mb-0 me-4"
                                                id="female">
                                                <FormCheckInput
                                                    value={"female"}
                                                    onClick={(e) =>
                                                        setGender(
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                                <FormCheckLabel>
                                                    Female{" "}
                                                </FormCheckLabel>
                                            </FormCheck>

                                            <FormCheck
                                                className="inline mb-0 me-4"
                                                id="other">
                                                <FormCheckInput
                                                    value={"other"}
                                                    onClick={(e) =>
                                                        setGender(
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                                <FormCheckLabel>
                                                    Other{" "}
                                                </FormCheckLabel>
                                            </FormCheck>
                                        </div>

                                        <Row>
                                            <Col className="md-6 mb-4">
                                                <select
                                                    class="select"
                                                    value={role}
                                                    onChange={(e) =>
                                                        handleRoleSubmitted(e)
                                                    }>
                                                    <option value="-1">
                                                        Role
                                                    </option>
                                                    <option value="STUDENT">
                                                        Student
                                                    </option>
                                                    <option value="TEACHER">
                                                        Teacher
                                                    </option>
                                                    <option value="PRINCIPLE">
                                                        Principle
                                                    </option>
                                                </select>
                                            </Col>
                                        </Row>

                                        <div class="d-flex justify-content-end pt-3">
                                            <button
                                                type="button"
                                                class="btn btn-light btn-lg">
                                                Reset all
                                            </button>
                                            <button
                                                type="submit"
                                                class="btn btn-warning btn-lg ms-2">
                                                Submit form
                                            </button>
                                        </div>
                                    </Form>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}
