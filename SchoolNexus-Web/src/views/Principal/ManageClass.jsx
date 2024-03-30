import { Col, Container, Row, Image, CloseButton } from "react-bootstrap";

import ImgClassroom from "../../assets/classroom.jpg";
import Defaultbar from "../../components/layout/navigation/Defaultbar";
import ManageClassForm from "../../components/layout/body/Principal/ManageClassForm";
import PageFooter from "../../components/layout/footer/Footer";

export default function ManageClass() {
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
                        <ManageClassForm />
                    </Col>
                </Row>
            </Container>
            <PageFooter />
        </div>
    );
}
