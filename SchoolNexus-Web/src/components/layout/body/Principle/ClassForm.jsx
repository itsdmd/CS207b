import React, { useState } from "react";
import { Button, Container, Form, Row, Col, Alert } from "react-bootstrap";

const ClassForm = () => {
    const [className, setClassName] = useState("");
    const [selectedGrade, setSelectedGrade] = useState("");
    const [selectedFormTeacherID, setSelectedFormTeacher] = useState("");
    const [validationErrors, setValidationErrors] = useState([]);

    const teachers = [
        { id: "13", name: "Taylor" },
        { id: "2", name: "Jisoo" },
    ];

    const grades = [...Array(12).keys()].map((i) => i + 1);

    const handleClassnameChange = (event) => {
        setClassName(event.target.value);
    };

    const handleGradeChange = (event) => {
        setSelectedGrade(event.target.value);
    };

    const handleFormTeacherChange = (event) => {
        setSelectedFormTeacher(event.target.value);
    };

    const handleSubmit = (event) => {
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
                `Class submitted: Class: ${className},
        Grade: ${selectedGrade},
        Form teacher: ${selectedFormTeacherID}`
            );

            // Reset the form after successful submission (optional)
            setClassName("");
            setSelectedGrade("");
            setSelectedFormTeacher("");
        }
    };

    return (
        <Form
            onSubmit={handleSubmit}
            className="border p-3 w-50"
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
                                {teacher.id} - {teacher.name}
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

export default ClassForm;
