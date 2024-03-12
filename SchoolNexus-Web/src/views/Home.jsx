import "bootstrap/dist/css/bootstrap.min.css";
import { Container } from "react-bootstrap";

import Defaultbar from "../components/layout/navigation/Defaultbar";
import PageFooter from "../components/layout/footer/Footer";
import Cards from "../components/layout/body/CardsContainer";

import checkNeedRelogin from "../services/router/checkNeedRelogin.services";

export default function HomePage() {
    checkNeedRelogin();

    return (
        <div>
            <div>
                <Defaultbar />
            </div>

            <Container>
                <div className="mb-5 mt-5">
                    <h3>
                        <i className="text-secondary">
                            Welcome to SchoolNexus,
                        </i>
                        <br />
                        <b>
                            <h1 className=".text-primary-emphasis">
                                {localStorage.getItem("userFullName")}
                            </h1>
                        </b>
                    </h3>
                </div>

                <Container className="menu mb-5">
                    <Cards />
                </Container>
            </Container>

            <div>
                <PageFooter />
            </div>
        </div>
    );
}
