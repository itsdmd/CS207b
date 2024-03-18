import React from "react";

import "bootstrap/dist/css/bootstrap.min.css";
import Defaultbar from "../../components/layout/navigation/Defaultbar";
import ManageSchoolForm from "../../components/layout/body/Admin/ManageSchoolForm";
import PageFooter from "../../components/layout/footer/Footer";

export default function ManageSchool() {
    return (
        <div>
            <Defaultbar />
            <ManageSchoolForm />
            <PageFooter />
        </div>
    );
}
