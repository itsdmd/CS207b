import React, { useState, useEffect } from "react";
import {
    Button,
    Container,
    Form,
    Row,
    Col,
    CloseButton,
} from "react-bootstrap";

import { GetNonFormTeachersOfSchool } from "../../../../services/api/user.service";
import {
    GetClasss,
    NewClasss,
    DeleteClasss,
} from "../../../../services/api/classs.service";

const grades = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];

const ManageClassForm = () => {
    const [allClasses, setAllClasses] = useState([]);

    const [className, setClassName] = useState("");
    const [selectedGrade, setSelectedGrade] = useState("");
    const [selectedFormTeacherID, setSelectedFormTeacher] = useState("");
    const [validationErrors, setValidationErrors] = useState([]);
    const [triggerUseEffect, setTriggerUseEffect] = useState(0);

    const [teachers, setTeachers] = useState([]);

    useEffect(() => {
        // fetch non-form teachers of schoolId
        async function fetchData() {
            setTeachers([]);

            let schoolId = localStorage.getItem("schoolId");
            if (schoolId == null) {
                schoolId = (
                    await SchoolByUserId(localStorage.getItem("userId"))
                ).id;
                localStorage.setItem("schoolId", schoolId);
                schoolId = localStorage.getItem("schoolId");
            }

            const result = await GetNonFormTeachersOfSchool(schoolId);
            console.log(
                "fetched non-form teachers:",
                result.map((teacher) => teacher.id)
            );

            setTeachers(result);
        }

        fetchData();
    }, []);

    useEffect(() => {
        // fetch all classes of schoolId
        async function fetchData() {
            setAllClasses([]);

            let schoolId = localStorage.getItem("schoolId");
            if (schoolId == null) {
                schoolId = (
                    await SchoolByUserId(localStorage.getItem("userId"))
                ).id;
                localStorage.setItem("schoolId", schoolId);
                schoolId = localStorage.getItem("schoolId");
            }

            const result = await GetClasss({ schoolId: schoolId });
            console.log(
                "fetched classes:",
                result.map((classs) => classs.name)
            );

            setAllClasses(result);
        }

        fetchData();
    }, [triggerUseEffect]);

    const handleClassnameChange = (event) => {
        setClassName(event.target.value);
    };

    const handleGradeChange = (event) => {
        setSelectedGrade(event.target.value);
    };

    const handleFormTeacherChange = (event) => {
        setSelectedFormTeacher(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const errors = []; // Array to store any validation errors

        if (!className) {
            errors.push("Class Name is required.");
        }

        if (!selectedGrade) {
            errors.push("Grade Level is required.");
        }

        if (!selectedFormTeacherID) {
            errors.push("Form Teacher is required.");
        }

        setValidationErrors(errors); // Update state with validation errors

        if (errors.length === 0) {
            // Submit only if there are no errors
            console.log(
                "Form submitted. Class Name: ",
                className,
                "SchoolId:",
                localStorage.getItem("schoolId"),
                "Grade: ",
                selectedGrade,
                "Form Teacher: ",
                selectedFormTeacherID
            );

            // Create new class
            const classsObj = {
                name: className,
                schoolId: localStorage.getItem("schoolId"),
                grade: selectedGrade,
                formTeacherId: selectedFormTeacherID,
            };

            const newClasss = await NewClasss(classsObj);
            console.log("New class created:", newClasss);

            setTriggerUseEffect(triggerUseEffect + 1);

            // Reset the form after successful submission (optional)
            // setClassName("");
            // setSelectedGrade("");
            // setSelectedFormTeacher("");
        }
    };

    const handleDeleteBtnPressed = async (event) => {
        const classsId = event.target.value;

        const result = await DeleteClasss(classsId);
        console.log("Deleted class:", result);

        setTriggerUseEffect(triggerUseEffect + 1);
    };

    return (
        <Form
            onSubmit={handleSubmit}
            className="border p-3"
            style={{ fontWeight: "bold" }}>
            <Form.Group as={Row}>
                <Col
                    sm="6"
                    lg="12">
                    <Form.Label>Tên lớp</Form.Label>
                    <Form.Control
                        type="text"
                        value={className}
                        onChange={handleClassnameChange}
                        placeholder="Enter classname..."
                        isInvalid={validationErrors.includes(
                            "Class Name is required."
                        )}
                    />
                    <Form.Control.Feedback type="invalid">
                        Cần cung cấp tên lớp.
                    </Form.Control.Feedback>
                </Col>

                <Col
                    sm="6"
                    lg="12"
                    className="mt-2">
                    <Form.Label>Khối lớp</Form.Label>
                    <Form.Select
                        value={selectedGrade}
                        onChange={handleGradeChange}
                        isInvalid={validationErrors.includes(
                            "Grade Level is required."
                        )}>
                        <option value="">Chọn một</option>
                        {grades.map((option) => (
                            <option
                                key={option}
                                value={option}>
                                {option}
                            </option>
                        ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                        Cần chọn khối lớp.
                    </Form.Control.Feedback>
                </Col>

                <Col
                    sm="6"
                    lg="12"
                    className="mt-2">
                    <Form.Label>Giáo viên chủ nhiệm</Form.Label>
                    <Form.Select
                        value={selectedFormTeacherID}
                        onChange={handleFormTeacherChange}
                        isInvalid={validationErrors.includes(
                            "Form Teacher is required."
                        )}>
                        <option value="">Chọn một</option>
                        {teachers.map((teacher) => (
                            <option
                                key={teacher.id}
                                value={teacher.id}>
                                {teacher.id}
                            </option>
                        ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                        Cần chỉ định một giáo viên chủ nhiệm.
                    </Form.Control.Feedback>
                </Col>

                <Col
                    sm="6"
                    lg="12"
                    className="mt-2 mb-5">
                    <Button
                        variant="primary"
                        style={{ width: "100%" }}
                        type="submit">
                        Xác nhận
                    </Button>
                </Col>
            </Form.Group>

            <Container
                className="w-80 border text-center "
                style={{
                    borderColor: "azure",
                    height: "512px",
                    borderRadius: "30px",
                    overflowY: "auto",
                }}>
                {allClasses.map((classs) => (
                    <div>
                        <Form.Label className="border mt-3 w-75">
                            {classs.name}
                            <br />
                            {classs.formTeacherId}
                        </Form.Label>
                        <CloseButton
                            value={classs.id}
                            className="bg-danger"
                            onClick={handleDeleteBtnPressed}
                        />
                    </div>
                ))}
            </Container>
        </Form>
    );
};

export default ManageClassForm;
