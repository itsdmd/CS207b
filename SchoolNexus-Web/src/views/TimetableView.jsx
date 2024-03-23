import "bootstrap/dist/css/bootstrap.min.css";

import Defaultbar from "../components/layout/navigation/Defaultbar";
import Timetable from "../components/layout/body/Timetable";
import Footer from "../components/layout/footer/Footer";

export default function TimetableView() {
    return (
        <div>
            <Defaultbar />

            <div className="m-5">
                <Timetable userId={localStorage.getItem("userId")} />
            </div>

            <Footer />
        </div>
    );
}
