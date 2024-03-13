import "bootstrap/dist/css/bootstrap.min.css";
import { Col, Row, Nav } from "react-bootstrap";
import PageCard from "./HomepageCard";
import img from "../../../assets/cardphoto.png";
import { Link } from "react-router-dom";

const Cards = () => {
    return (
        <div>
            <Row>
                <Col
                    xs={6}
                    md={4}
                    lg={3}>
                    <Nav.Link href="timetable">
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
                    <Nav.Link to="/viewgrades">
                        <PageCard
                            img={img}
                            title="View Grades"
                        />
                    </Nav.Link>
                </Col>

                <Col
                    xs={6}
                    md={4}
                    lg={3}
                    disabled>
                    <Nav.Link to="/viewschedules">
                        <PageCard
                            img={img}
                            title="View Teaching Schedules"
                        />
                    </Nav.Link>
                </Col>

                <Col
                    xs={6}
                    md={4}
                    lg={3}>
                    <Nav.Link to="/assigngrade">
                        <PageCard
                            img={img}
                            title="Assign/Change Grades"
                        />
                    </Nav.Link>
                </Col>

                <Col
                    xs={6}
                    md={4}
                    lg={3}>
                    <Nav.Link to="/assigngrade">
                        <PageCard
                            img={img}
                            title="Assign/Change Grades"
                        />
                    </Nav.Link>
                </Col>

                <Col
                    xs={6}
                    md={4}
                    lg={3}>
                    <Link to="/createnewuser">
                        <PageCard
                            img={img}
                            title="Create new user"
                        />
                    </Link>
                </Col>
            </Row>
        </div>
    );
};

export default Cards;
