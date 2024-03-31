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
                        <Nav.Link href="user/manage">
                            <PageCard
                                img={img}
                                title="Quản lý người dùng"
                            />
                        </Nav.Link>
                    </Col>
                    <Col
                        xs={6}
                        md={4}
                        lg={3}>
                        <Nav.Link href="school/manage">
                            <PageCard
                                img={img}
                                title="Quản lý trường học"
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
                        <Nav.Link href="class/manage">
                            <PageCard
                                img={img}
                                title="Quản lý lớp học"
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
                                title="Xếp lớp"
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
                                title="Chỉnh sửa thời khóa biểu"
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
                        <Nav.Link href="grade/edit">
                            <PageCard
                                img={img}
                                title="Chỉnh sửa điểm số"
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
                                title="Xem thời khóa biểu"
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
                                title="Xem thời khóa biểu"
                            />
                        </Nav.Link>
                    </Col>

                    <Col
                        xs={6}
                        md={4}
                        lg={3}>
                        <Nav.Link href="grade/view">
                            <PageCard
                                img={img}
                                title="Xem điểm số"
                            />
                        </Nav.Link>
                    </Col>
                </Row>
            )}
        </div>
    );
};

export default Cards;
