import React from "react";

import Defaultbar from "../../components/layout/navigation/Defaultbar";
import TimetableForm from "../../components/layout/body/Principal/TimetableForm";
import { Container, Navbar } from "react-bootstrap";

export default function TimetableEdit() {
    return (
        <div
            style={{
                background:
                    "url(https://t4.ftcdn.net/jpg/01/68/20/47/360_F_168204719_aWhXPHpnQGmwyZ9BSaZAdfMcvNWqle7B.jpg)",
                backgroundSize: "cover",
                height: "100vh",
            }}>
            <Defaultbar />
            <Container className="d-flex text-center align-center flex-column mt-5">
                <h2 style={{ color: "white" }}>Edit Timetable</h2>
                <Container className="d-flex justify-content-center  mt-3 ">
                    <TimetableForm />
                </Container>
            </Container>
        </div>
    );
}
