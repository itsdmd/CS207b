import "bootstrap/dist/css/bootstrap.min.css";

import Defaultbar from "../components/layout/navigation/Defaultbar";
import AccountInfo from "../components/layout/body/AccountInfo";
import Footer from "../components/layout/footer/Footer";

export default function Account() {
    return (
        <div>
            <Defaultbar />

            <div className="m-5">
                <AccountInfo />
            </div>

            <Footer />
        </div>
    );
}
