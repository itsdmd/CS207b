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
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [gender, setGender] = useState("");
    const [role, setRole] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!firstname || !lastname || !email || !phone || !gender || !role) {
            setErrorMessage("Please fill in all required fields.");
            return;
        }

        const formData = {
            firstname,
            lastname,
            email,
            phone,
            address,
            gender,
            role,
            errorMessage,
        };
    };

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

                                    <Row>
                                        <Col className="md-6 mb-4">
                                            <div class="form-outline">
                                                <FormControl
                                                    type="text"
                                                    for="firstname"
                                                    className="lg"
                                                />
                                                <FormLabel htmlFor="firstname">
                                                    First name{" "}
                                                </FormLabel>
                                            </div>
                                        </Col>
                                        <Col className="md-6 mb-4">
                                            <div class="form-outline">
                                                <FormControl
                                                    type="text"
                                                    for="lastname"
                                                    className="lg"
                                                />
                                                <FormLabel htmlFor="lastname">
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
                                                />
                                                <FormLabel htmlFor="dateOfBirth">
                                                    Date Of Birth
                                                </FormLabel>
                                            </div>
                                        </Col>
                                        <Col className="md-6 mb-4">
                                            <div class="form-outline">
                                                <FormControl
                                                    type="text"
                                                    for="phone"
                                                    className="lg"
                                                />
                                                <FormLabel htmlFor="phone">
                                                    Phone Number{" "}
                                                </FormLabel>
                                            </div>
                                        </Col>
                                    </Row>

                                    <Form.Group
                                        className="mb-4"
                                        controlId="email">
                                        <FormControl type="text" />
                                        <FormLabel htmlFor="email">
                                            {" "}
                                            Email{" "}
                                        </FormLabel>
                                    </Form.Group>
                                    <Form.Group
                                        className="mb-4"
                                        controlId="address">
                                        <FormControl type="text" />
                                        <FormLabel htmlFor="address">
                                            {" "}
                                            Address{" "}
                                        </FormLabel>
                                    </Form.Group>

                                    <Form.Group
                                        className="mb-4"
                                        controlId="schoolName">
                                        <FormControl type="text" />
                                        <FormLabel htmlFor="schoolName">
                                            {" "}
                                            School Name{" "}
                                        </FormLabel>
                                    </Form.Group>

                                    <div class="d-md-flex justify-content-start align-items-center mb-4 py-2">
                                        <h6 class="mb-0 me-4">Gender: </h6>

                                        <FormCheck
                                            className="inline mb-0 me-4"
                                            id="male">
                                            <FormCheckInput />
                                            <FormCheckLabel htmlFor="maleGender">
                                                Male{" "}
                                            </FormCheckLabel>
                                        </FormCheck>

                                        <FormCheck
                                            className="inline mb-0 me-4"
                                            id="female">
                                            <FormCheckInput />
                                            <FormCheckLabel htmlFor="femaleGender">
                                                Female{" "}
                                            </FormCheckLabel>
                                        </FormCheck>

                                        <FormCheck
                                            className="inline mb-0 me-4"
                                            id="other">
                                            <FormCheckInput />
                                            <FormCheckLabel htmlFor="otherGender">
                                                Female{" "}
                                            </FormCheckLabel>
                                        </FormCheck>
                                    </div>

                                    <Row>
                                        <Col className="md-6 mb-4">
                                            <select class="select">
                                                <option value="1">Role</option>
                                                <option value="2">
                                                    Student
                                                </option>
                                                <option value="3">
                                                    Teacher
                                                </option>
                                                <option value="4">
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
                                            type="button"
                                            class="btn btn-warning btn-lg ms-2">
                                            Submit form
                                        </button>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}
