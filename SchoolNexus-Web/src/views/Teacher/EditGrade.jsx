import React from "react";

import "bootstrap/dist/css/bootstrap.min.css";
import Defaultbar from "../../components/layout/navigation/Defaultbar";
import GradingForm from "../../components/layout/body/Teacher/GradingForm";
import PageFooter from "../../components/layout/footer/Footer";

export default function ViewGrade() {
    return (
        <div>
            <Defaultbar />
            <div className="m-5 d-flex justify-content-center">
                <GradingForm />
            </div>
            <PageFooter />
        </div>
    );
}
