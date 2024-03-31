import React, { useState, useEffect } from "react";
import {
    Button,
    Row,
    Col,
    Form,
    FormControl,
    FormLabel,
    Container,
} from "react-bootstrap";

import GetSchool, {
    NewSchool,
    DeleteSchool,
} from "../../../../services/api/school.service";

export default function ManageSchoolForm() {
    const [schoolId, setSchoolId] = useState("");
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
        if (schoolId) {
            formData.id = schoolId;
        }

        const newSchoolResponse = await NewSchool(formData);
        console.log("New school created:", newSchoolResponse);

        setTriggerUseEffect(triggerUseEffect + 1);
    };

    const handleReset = () => {
        console.log("handleReset");
        setSchoolId("");
        setSchoolName("");
        setSchoolAddress("");
    };

    const handleInfoBtnPressed = async (e) => {
        console.log("handleInfoBtnPressed");
        const response = await GetSchool({ id: e.target.value });
        console.log(response);

        setSchoolId(response[0].id);
        setSchoolName(response[0].name);
        setSchoolAddress(response[0].address);
    };

    const handleDeleteBtnPressed = async (e) => {
        console.log("handleDeleteBtnPressed");
        setSchoolId("");

        const response = await DeleteSchool(e.target.value);
        console.log(response);

        setTriggerUseEffect(triggerUseEffect + 1);
    };

    return (
        <Container className="py-5 h-100">
            <Row className="d-flex justify-content-center align-items-start h-100">
                <Col>
                    <h3 className="mb-5">Quản lý trường học</h3>
                    <div className="my-4">
                        <Row>
                            <Col>
                                <div className="card-body p-md-5 text-black">
                                    <Form onSubmit={(e) => handleSubmit(e)}>
                                        {/* ID */}
                                        <Row className="md-6 mb-4">
                                            <div className="form-outline">
                                                <FormLabel>
                                                    ID Trường học
                                                </FormLabel>
                                                <FormControl
                                                    type="text"
                                                    id="schoolID"
                                                    className="lg"
                                                    value={schoolId}
                                                    disabled
                                                />
                                            </div>
                                        </Row>

                                        {/* Name */}
                                        <Row className="md-6 mb-4">
                                            <div className="form-outline">
                                                <FormLabel>
                                                    Tên trường
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
                                                <FormLabel>Địa chỉ</FormLabel>
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
                                                className="btn btn-light btn-lg"
                                                onClick={handleReset}>
                                                Đặt lại
                                            </Button>
                                            <Button
                                                type="submit"
                                                className="btn btn-primary btn-lg ms-2">
                                                Xác nhận
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
                                <Button
                                    value={school.id}
                                    className="btn-sm btn-info text-white"
                                    onClick={handleInfoBtnPressed}>
                                    i
                                </Button>
                                <Button
                                    value={school.id}
                                    className="btn-sm btn-danger text-white"
                                    onClick={handleDeleteBtnPressed}>
                                    x
                                </Button>
                            </div>
                        ))}
                    </Container>
                </Col>
            </Row>
        </Container>
    );
}
