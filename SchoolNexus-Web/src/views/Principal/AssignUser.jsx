import React from "react";

import "bootstrap/dist/css/bootstrap.min.css";
import Defaultbar from "../../components/layout/navigation/Defaultbar";
import AssignUserToClassForm from "../../components/layout/body/Principal/AssignUserToClassForm";
import PageFooter from "../../components/layout/footer/Footer";

export default function AssignUser() {
    return (
        <div>
            <Defaultbar />
            <AssignUserToClassForm />
            <PageFooter />
        </div>
    );
}
