import "bootstrap/dist/css/bootstrap.min.css";

import Defaultbar from "../components/layout/navigation/Defaultbar";
import Timetable from "../components/layout/body/Timetable";

export default function TimetableView() {
    return (
        <div>
            <div>
                <Defaultbar />
            </div>

            <div className="m-5">
                <Timetable userId={localStorage.getItem("userId")} />
            </div>
        </div>
    );
}
