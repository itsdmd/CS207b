import "bootstrap/dist/css/bootstrap.min.css";
import { Container } from "react-bootstrap";

import Defaultbar from "../components/layout/navigation/Defaultbar";
import PageFooter from "../components/layout/footer/Footer";
import Cards from "../components/layout/body/CardsContainer";

import checkNeedRelogin from "../services/router/checkNeedRelogin.services";

export default function HomePage() {
    const needRelogin = checkNeedRelogin();

    if (needRelogin) {
        return (
            <div>
                <div>
                    <Defaultbar />
                </div>

                <Container>
                    <div className="mb-5 mt-5">
                        <h2>
                            Welcome to SchoolNexus,
                            <span className=".text-primary-emphasis">
                                {/* {name} */}
                            </span>
                            .
                        </h2>
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
    } else {
        return null;
    }
}
