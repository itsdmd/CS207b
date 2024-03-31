import React from "react";
import { Container, Row, Col, Image, Nav, Button } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";
import logo from "../../../assets/logo.png";

const PageFooter = () => {
    return (
        <footer className="bg-light border-top text-dark py-3 bottom">
            <Container fluid>
                <Container className="mt-5">
                    <Row className="d-flex justify-content-end">
                        <Col
                            xs={12}
                            md={6}
                            lg={9}>
                            <Nav.Link
                                href="/home"
                                className="d-flex justify-content-end text.dark text-decoration-none">
                                <Image
                                    src={logo}
                                    alt="logo"
                                    width={70}
                                    height={70}
                                />
                            </Nav.Link>
                        </Col>

                        {/* <Col xs={12} md={6} lg={3} className='d-flex justify-content-end'  >
                        <div height={10}>
                            <Button variant="dark" className="me-3">
                                <i className="bi bi-facebook"></i>
                            </Button>
                        </div>
                        <div height={10}>
                            <Button variant="dark" className="me-3">
                                <i className="bi bi-instagram"></i>
                            </Button>
                        </div>
                        <div height={10}>
                            <Button variant="dark">
                                <i className="bi bi-envelope"></i>
                            </Button>
                        </div>
                    </Col> */}
                    </Row>
                </Container>

                <hr className="my-5 bg-white" />
                <Row className="justify-content-center">
                    <Col
                        xs={12}
                        className="text-center">
                        <small>
                            <i class="bi bi-at"></i> 2024. All rights reserved.
                        </small>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
};

export default PageFooter;
