import React from "react";

import "bootstrap/dist/css/bootstrap.min.css";
import Defaultbar from "../../components/layout/navigation/Defaultbar";
import NewAccountForm from "../../components/layout/body/Admin/NewAccountForm";
import PageFooter from "../../components/layout/footer/Footer";

export default function NewAccount() {
    return (
        <div>
            <Defaultbar />
            <NewAccountForm />
            <PageFooter />
        </div>
    );
}
