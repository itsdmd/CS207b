import React, { useState, useEffect } from "react";
import { Button, Container, Form, Row, Col, Alert } from "react-bootstrap";

import { GetNonFormTeachersOfSchool } from "../../../../services/api/user.service";
import { NewClasss } from "../../../../services/api/classs.service";

const NewClassForm = () => {
    const [className, setClassName] = useState("");
    const [selectedGrade, setSelectedGrade] = useState("");
    const [selectedFormTeacherID, setSelectedFormTeacher] = useState("");
    const [validationErrors, setValidationErrors] = useState([]);

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

    const grades = [
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "11",
        "12",
    ];

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

            // Reset the form after successful submission (optional)
            // setClassName("");
            // setSelectedGrade("");
            // setSelectedFormTeacher("");
        }
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
                    <Form.Label>Class name: </Form.Label>
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
                        Class Name is required.
                    </Form.Control.Feedback>
                </Col>

                <Col
                    sm="6"
                    lg="12"
                    className="mt-2">
                    <Form.Label>Grade: </Form.Label>
                    <Form.Select
                        value={selectedGrade}
                        onChange={handleGradeChange}
                        isInvalid={validationErrors.includes(
                            "Grade Level is required."
                        )}>
                        <option value="">Select Grade</option>
                        {grades.map((option) => (
                            <option
                                key={option}
                                value={option}>
                                {option}
                            </option>
                        ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                        Grade Level is required.
                    </Form.Control.Feedback>
                </Col>

                <Col
                    sm="6"
                    lg="12"
                    className="mt-2">
                    <Form.Label>Form Teacher: </Form.Label>
                    <Form.Select
                        value={selectedFormTeacherID}
                        onChange={handleFormTeacherChange}
                        isInvalid={validationErrors.includes(
                            "Form Teacher is required."
                        )}>
                        <option value="">Select Form Teacher</option>
                        {teachers.map((teacher) => (
                            <option
                                key={teacher.id}
                                value={teacher.id}>
                                {teacher.id}
                            </option>
                        ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                        Form Teacher is required.
                    </Form.Control.Feedback>
                </Col>

                <Col
                    sm="6"
                    lg="12"
                    className="mt-2">
                    <Button
                        variant="outline-info"
                        style={{ width: "100%" }}
                        type="submit">
                        Submit
                    </Button>
                </Col>
            </Form.Group>
        </Form>
    );
};

export default NewClassForm;
