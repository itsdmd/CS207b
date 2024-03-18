import React, { useState, useEffect } from "react";
import {
    Button,
    Row,
    Col,
    Form,
    FormControl,
    FormLabel,
    Container,
    CloseButton,
} from "react-bootstrap";

import GetSchool, {
    NewSchool,
    DeleteSchool,
} from "../../../../services/api/school.service";

export default function ManageSchoolForm() {
    const [schoolName, setSchoolName] = useState("");
    const [schoolAddress, setSchoolAddress] = useState("");

    const [schoolList, setSchoolList] = useState([]);
    const [triggerUseEffect, setTriggerUseEffect] = useState(0);

    useEffect(() => {
        async function fetchData() {
            /* -------------- School -------------- */
            setSchoolList([]);
            const allSchools = await GetSchool({});
            console.log("fetched schools:", allSchools);
            setSchoolList(allSchools);
        }

        fetchData();
    }, [triggerUseEffect]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("handleSubmitButton pressed");

        if (!schoolName || !schoolAddress) {
            setErrorMessage("Please fill in all required fields.");
            return;
        }

        const formData = {
            name: schoolName,
            address: schoolAddress,
        };
        const newSchoolResponse = await NewSchool(formData);
        console.log("New school created:", newSchoolResponse);

        setTriggerUseEffect(triggerUseEffect + 1);
    };

    const handleDeleteBtnPressed = async (e) => {
        console.log("handleDeleteBtnPressed");

        const response = await DeleteSchool(e.target.value);
        console.log(response);

        setTriggerUseEffect(triggerUseEffect + 1);
    };

    return (
        <Container className="py-5 h-100">
            <Row className="d-flex justify-content-center align-items-start h-100">
                <Col>
                    <h3 className="mb-5">New School</h3>
                    <div className="my-4">
                        <Row>
                            <Col>
                                <div className="card-body p-md-5 text-black">
                                    <Form onSubmit={(e) => handleSubmit(e)}>
                                        {/* Name */}
                                        <Row className="md-6 mb-4">
                                            <div className="form-outline">
                                                <FormLabel>
                                                    School name
                                                </FormLabel>
                                                <FormControl
                                                    type="text"
                                                    id="schoolName"
                                                    className="lg"
                                                    value={schoolName}
                                                    onChange={(e) =>
                                                        setSchoolName(
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </div>
                                        </Row>

                                        {/* Address */}
                                        <Row className="md-6 mb-4">
                                            <div className="form-outline">
                                                <FormLabel>Address</FormLabel>
                                                <FormControl
                                                    type="text"
                                                    id="schoolAddress"
                                                    className="lg"
                                                    value={schoolAddress}
                                                    onChange={(e) =>
                                                        setSchoolAddress(
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </div>
                                        </Row>

                                        <div className="d-flex justify-content-end pt-3">
                                            <Button
                                                type="button"
                                                className="btn btn-light btn-lg">
                                                Reset
                                            </Button>
                                            <Button
                                                type="submit"
                                                className="btn btn-warning btn-lg ms-2">
                                                Create
                                            </Button>
                                        </div>
                                    </Form>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </Col>

                <Col>
                    <h3 className="mb-5">Manage Schools</h3>
                    <Container
                        className="w-80 border text-center "
                        style={{
                            borderColor: "azure",
                            height: "512px",
                            borderRadius: "30px",
                            overflowY: "auto",
                        }}>
                        {schoolList.map((school) => (
                            <div>
                                <Form.Label className="border mt-3 w-75">
                                    {school.name}
                                    {" | "}
                                    {school.address}
                                </Form.Label>
                                <CloseButton
                                    value={school.id}
                                    className="bg-danger"
                                    onClick={handleDeleteBtnPressed}
                                />
                            </div>
                        ))}
                    </Container>
                </Col>
            </Row>
        </Container>
    );
}
