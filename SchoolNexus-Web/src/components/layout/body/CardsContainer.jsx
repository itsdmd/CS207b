import "bootstrap/dist/css/bootstrap.min.css";
import { Col, Row, Nav } from "react-bootstrap";
import PageCard from "./HomepageCard";
import img from "../../../assets/cardphoto.png";

const Cards = () => {
    return (
        <div>
            <Row>
                <Col
                    xs={6}
                    md={4}
                    lg={3}>
                    <Nav.Link href="user/new">
                        <PageCard
                            img={img}
                            title="New user"
                        />
                    </Nav.Link>
                </Col>

                <Col
                    xs={6}
                    md={4}
                    lg={3}>
                    <Nav.Link href="user/del">
                        <PageCard
                            img={img}
                            title="Delete user"
                        />
                    </Nav.Link>
                </Col>

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
                    <Nav.Link to="/grade/view">
                        <PageCard
                            img={img}
                            title="View Grades"
                        />
                    </Nav.Link>
                </Col>
            </Row>
        </div>
    );
};

export default Cards;
