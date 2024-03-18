import React from "react";

import "bootstrap/dist/css/bootstrap.min.css";
import Defaultbar from "../../components/layout/navigation/Defaultbar";
import ManageAccountForm from "../../components/layout/body/Admin/ManageAccountForm";
import PageFooter from "../../components/layout/footer/Footer";

export default function ManageAccount() {
    return (
        <div>
            <Defaultbar />
            <ManageAccountForm />
            <PageFooter />
        </div>
    );
}
