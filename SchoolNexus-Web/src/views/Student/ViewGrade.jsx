import React from "react";

import "bootstrap/dist/css/bootstrap.min.css";
import Defaultbar from "../../components/layout/navigation/Defaultbar";
import GradesTable from "../../components/layout/body/GradesTable";
import PageFooter from "../../components/layout/footer/Footer";

export default function ViewGrade() {
    return (
        <div>
            <Defaultbar />
            <div className="m-5">
                <GradesTable />
            </div>
            <PageFooter />
        </div>
    );
}
