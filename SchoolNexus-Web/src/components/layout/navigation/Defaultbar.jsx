import { useNavigate } from "react-router-dom";
import { Container, Nav, Navbar, Image } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

import logo from "../../../assets/logo.png";
import Logout from "../../../services/api/logout.service";

export default function Defaultbar() {
    const navigate = useNavigate();

    async function LogoutBtnPressed() {
        console.log("Logout pressed");

        console.log(localStorage.getItem("userId"));

        const LogoutResult = await Logout();

        if (LogoutResult.success) {
            console.log("Logout successful");
            navigate("/");
        } else {
            console.error("Logout failed");
        }
    }
    return (
        <div>
            <Navbar
                expand="lg"
                className="bg-light fixed border-bottom shadow ">
                <Container>
                    <Container>
                        <Navbar.Brand className="d-flex align-center">
                            <Nav.Link href="/home">
                                <Image
                                    src={logo}
                                    width={70}
                                    height={70}
                                />
                            </Nav.Link>
                        </Navbar.Brand>
                    </Container>

                    <Nav variant="underline">
                        <Nav.Link href="/home">
                            <b class="bi bi-house"> </b>
                            <br />
                            Trang chủ
                        </Nav.Link>

                        <Nav.Link href="/account">
                            <b class="bi bi-person"> </b>
                            <br />
                            Tài khoản
                        </Nav.Link>

                        <Nav.Link
                            href="/"
                            onClick={(e) => LogoutBtnPressed(e)}>
                            <b class="bi bi-box-arrow-right"> </b>
                            <br />
                            Đăng xuất
                        </Nav.Link>
                    </Nav>
                </Container>
            </Navbar>
        </div>
    );
}
