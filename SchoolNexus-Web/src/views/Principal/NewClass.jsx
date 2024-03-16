import { Col, Container, Row, Image, CloseButton } from "react-bootstrap";

import ImgClassroom from "../../assets/classroom.jpg";
import Defaultbar from "../../components/layout/navigation/Defaultbar";
import NewClassForm from "../../components/layout/body/Principal/NewClassForm";
import PageFooter from "../../components/layout/footer/Footer";

export default function NewClass() {
    return (
        <div>
            <Defaultbar />
            <Container
                className="mb-5 mt-5"
                style={{ borderRadius: "30px" }}>
                <Row>
                    <Col className="w-75">
                        <Image
                            src={ImgClassroom}
                            className="w-100 h-100"
                            style={{ borderRadius: "30px" }}
                        />
                    </Col>
                    <Col>
                        <NewClassForm />
                    </Col>
                </Row>
            </Container>
            <PageFooter />
        </div>
    );
}
