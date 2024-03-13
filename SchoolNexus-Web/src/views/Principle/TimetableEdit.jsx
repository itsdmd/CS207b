import React from "react";

import Defaultbar from "../../components/layout/navigation/Defaultbar";
import TimetableForm from "../../components/layout/body/Principle/TimetableForm";

export default function TimetableEdit() {
    return (
        <div>
            <Defaultbar />
            <div className="m-5 w-50">
                <TimetableForm />
            </div>
        </div>
    );
}
