import React, { useState } from "react";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import "bootstrap/dist/css/bootstrap.min.css";
import Defaultbar from "../../components/layout/navigation/Defaultbar";
import { Col, Container, Row, Image, CloseButton } from "react-bootstrap";
import classRoom from "../../assets/classroom.jpg";
import PageFooter from "../../components/layout/footer/Footer";

export default function AssignUser() {
    const [selectedAccountType, setSelectedAccountType] = useState("");
    const [userIds, setUserIds] = useState([""]);
    const [classsIds, setClasssIds] = useState([""]);

    return (
        <div>
            <Defaultbar />

            <Container
                className="mb-5 mt-5"
                style={{ borderRadius: "30px" }}>
                <Row>
                    <Col className="w-75">
                        <Image
                            src={classRoom}
                            className="w-100 h-100"
                            style={{ borderRadius: "30px" }}
                        />
                    </Col>
                    <Col className="w-75">
                        <Form.Group className="mb-3 w-80">
                            <Form.Label
                                style={{
                                    fontSize: "20px",
                                    fontWeight: "bold",
                                }}>
                                <i class="bi bi-person-circle"></i> User
                            </Form.Label>
                            <Container>
                                <Form.Select>
                                    <option
                                        disabled={true}
                                        value=""
                                        selected>
                                        --Choose and option--
                                    </option>
                                    <option value="teacher">Teacher</option>
                                    <option value="student">Student</option>
                                </Form.Select>
                            </Container>
                        </Form.Group>

                        <Form.Group className="mb-3 w-80 mr-3">
                            <Form.Label
                                style={{
                                    fontSize: "20px",
                                    fontWeight: "bold",
                                }}>
                                <i class="bi bi-easel2-fill"></i> Class
                            </Form.Label>
                            <Container className="d-flex">
                                <Form.Select>
                                    <option
                                        disabled={true}
                                        value=""
                                        selected>
                                        --Choose and option--
                                    </option>
                                    <option value="1">Class A</option>
                                    <option value="2">Class B</option>
                                    <option value="3">Class C</option>
                                    <option value="4">Class D</option>
                                </Form.Select>
                                <Button className="bg-info w-15 h-50">
                                    <i class="bi bi-plus"></i>
                                </Button>
                            </Container>
                        </Form.Group>

                        <Container
                            className="w-80 border text-center "
                            style={{
                                borderColor: "azure",
                                height: "512px",
                                borderRadius: "30px",
                            }}>
                            <div>
                                <Form.Label className="border mt-3 w-75">
                                    User #1
                                </Form.Label>
                                <CloseButton className="bg-danger" />
                            </div>
                            <div>
                                <Form.Label className="border mt-3 w-75">
                                    User #2
                                </Form.Label>
                                <CloseButton className="bg-danger" />
                            </div>
                        </Container>
                    </Col>
                </Row>
            </Container>
            <PageFooter />
        </div>
    );
}
