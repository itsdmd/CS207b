import "bootstrap/dist/css/bootstrap.min.css";
import { Col, Row, Nav } from "react-bootstrap";
import PageCard from "./HomepageCard";
import img from "../../../assets/cardphoto.png";
import { useState } from "react";
import { useEffect } from "react";
const Cards = () => {
    const [typeUser, settypeUser] = useState([]);
    useEffect(() => {
        const user = localStorage.getItem("userAccountType");
        settypeUser(user);
    }, []);

    return (
        <div>
            {typeUser === "ADMIN" && (
                <Row>
                    <Col
                        xs={6}
                        md={4}
                        lg={3}>
                        <Nav.Link href="user/new">
                            <PageCard
                                img={img}
                                title="Manage user"
                            />
                        </Nav.Link>
                    </Col>
                </Row>
            )}
            {typeUser === "PRINCIPAL" && (
                <Row>
                    <Col
                        xs={6}
                        md={4}
                        lg={3}>
                        <Nav.Link href="class/new">
                            <PageCard
                                img={img}
                                title="New class"
                            />
                        </Nav.Link>
                    </Col>

                    <Col
                        xs={6}
                        md={4}
                        lg={3}>
                        <Nav.Link href="class/assign">
                            <PageCard
                                img={img}
                                title="Assign user to class"
                            />
                        </Nav.Link>
                    </Col>

                    <Col
                        xs={6}
                        md={4}
                        lg={3}>
                        <Nav.Link href="timetable/edit">
                            <PageCard
                                img={img}
                                title="Edit Timetable"
                            />
                        </Nav.Link>
                    </Col>
                </Row>
            )}

            {typeUser === "TEACHER" && (
                <Row>
                    <Col
                        xs={6}
                        md={4}
                        lg={3}>
                        <Nav.Link to="/grade/new">
                            <PageCard
                                img={img}
                                title="New Student Grade"
                            />
                        </Nav.Link>
                    </Col>

                    <Col
                        xs={6}
                        md={4}
                        lg={3}>
                        <Nav.Link href="timetable/view">
                            <PageCard
                                img={img}
                                title="View Timetable"
                            />
                        </Nav.Link>
                    </Col>
                </Row>
            )}

            {typeUser === "STUDENT" && (
                <Row>
                    <Col
                        xs={6}
                        md={4}
                        lg={3}>
                        <Nav.Link href="timetable/view">
                            <PageCard
                                img={img}
                                title="View Timetable"
                            />
                        </Nav.Link>
                    </Col>

                    <Col
                        xs={6}
                        md={4}
                        lg={3}>
                        <Nav.Link to="/grade/view">
                            <PageCard
                                img={img}
                                title="View Grades"
                            />
                        </Nav.Link>
                    </Col>
                </Row>
            )}
        </div>
    );
};

export default Cards;
