import Defaultbar from "../../components/layout/navigation/Defaultbar";
import PageFooter from "../../components/layout/footer/Footer";
import "bootstrap/dist/css/bootstrap.min.css";
import {
    Row,
    Container,
    Col,
    Image,
    Button,
    CloseButton,
    Form
} from "react-bootstrap";
import Library from "../../assets/library.jpg";

export default function DeleteUser() {
    return (
        <div>
            <Defaultbar />
            <Container className="mt-5 mb-5">
                <Row>
                    <Col className="w-75">
                        <Form.Group>
                            <Form.Label
                                style={{
                                    fontSize: "20px",
                                    fontWeight: "bold",
                                }}>
                                <i class="bi bi-person-circle"></i> UserID
                            </Form.Label>
                            <Form.Control placeholder="Input user ID here"></Form.Control>
                            <Button className="bg-info mt-3 mb-3">Submit</Button>
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

                    <Col className="w-75">
                        <Image
                            src={Library}
                            className="w-100 h-75"
                            style={{ borderRadius: "30px" }}
                        />
                    </Col>
                </Row>
            </Container>
            <PageFooter />
        </div>
    );
}
