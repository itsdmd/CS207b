import React, { useState, useEffect } from "react";
import { Button, Container, Form, Row, Col } from "react-bootstrap";

import { TimetableEntryByUserId } from "../../../../services/api/timetable.service";
import { UserByClassId } from "../../../../services/api/user.service";
import GetStudentGrades, {
    GetGradeTypes,
    NewStudentGrade,
} from "../../../../services/api/studentGrade.service";
import { GetTSAs } from "../../../../services/api/subject.service";

const GradingForm = () => {
    const [selectedClasssName, setSelectedClasssName] = useState("");
    const [selectedClasssId, setSelectedClasssId] = useState("");
    const [selectedStudentName, setSelectedStudentName] = useState("");
    const [selectedStudentId, setSelectedStudentId] = useState("");
    const [selectedGradeTypeName, setSelectedGradeTypeName] = useState("");
    const [selectedGradeTypeId, setSelectedGradeTypeId] = useState("");
    const [gradeValue, setGradeValue] = useState("");

    const [classsNames, setClasssNames] = useState([]);
    const [classsIds, setClasssIds] = useState([]);
    const [studentNames, setStudentNames] = useState([]);
    const [studentIds, setStudentIds] = useState([]);
    const [gradeTypeNames, setGradeTypeNames] = useState([]);
    const [gradeTypeIds, setGradeTypeIds] = useState([]);
    const [subjectId, setSubjectId] = useState("");
    const [triggerUseEffect, setTriggerUseEffect] = useState(0);

    const semester =
        new Date().getFullYear() +
        "-" +
        (new Date().getMonth() < 6 ? "01" : "02");

    useEffect(() => {
        const userId = localStorage.getItem("userId");

        async function fetchData() {
            const tteObjs = await TimetableEntryByUserId(userId);
            console.log("tteObjs", tteObjs);

            for (let i = 0; i < tteObjs.length; i++) {
                if (classsNames.indexOf(tteObjs[i].classsName) === -1) {
                    setClasssNames([...classsNames, tteObjs[i].classsName]);
                    setClasssIds([...classsIds, tteObjs[i].classsId]);
                }
            }

            const gradeTypes = await GetGradeTypes({});
            setGradeTypeNames(gradeTypes.map((type) => type.name));
            setGradeTypeIds(gradeTypes.map((type) => type.id));

            setSubjectId((await GetTSAs({ teacherId: userId }))[0].subjectId);
        }

        fetchData();
    }, []);

    useEffect(() => {
        async function fetchStudents() {
            const uca = await UserByClassId(selectedClasssId);
            console.log("uca", uca);

            const names = [];
            const ids = [];
            for (let i = 0; i < uca.length; i++) {
                if (uca[i].accountType === "STUDENT") {
                    names.push(uca[i].fullName);
                    ids.push(uca[i].id);
                }
            }
            setStudentNames(names);
            setStudentIds(ids);
        }

        async function fetchStudentGrade() {
            const studentGrades = await GetStudentGrades({
                studentId: selectedStudentId,
                graderId: localStorage.getItem("userId"),
                semesterId: semester,
                typeId: selectedGradeTypeId,
            });
            console.log("studentGrades", studentGrades);
            setGradeValue(studentGrades[0].value);
        }

        if (selectedClasssId && selectedStudentId === "") {
            fetchStudents();
        } else if (
            selectedClasssId &&
            selectedStudentId &&
            selectedGradeTypeName
        ) {
            fetchStudentGrade();
        }
    }, [triggerUseEffect]);

    const handleClassChange = (event) => {
        setSelectedClasssName(event.target.value);
        setSelectedClasssId(classsIds[classsNames.indexOf(event.target.value)]);
        console.log("selectedClasssId", selectedClasssId);

        setTriggerUseEffect(triggerUseEffect + 1);
    };

    const handleStudentChange = (event) => {
        setSelectedStudentId(event.target.value);
        setSelectedStudentName(
            studentNames[studentIds.indexOf(event.target.value)]
        );
    };

    const handleGradeTypeChange = (event) => {
        setSelectedGradeTypeId(event.target.value);
        setSelectedGradeTypeName(
            gradeTypeNames[gradeTypeIds.indexOf(event.target.value)]
        );
        setTriggerUseEffect(triggerUseEffect + 1);
    };

    const handleGradeValueChange = (event) => {
        setGradeValue(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const response = await NewStudentGrade({
            studentId: selectedStudentId,
            graderId: localStorage.getItem("userId"),
            semesterId: semester,
            typeId: selectedGradeTypeId,
            subjectId: subjectId,
            value: String(gradeValue),
        });

        console.log("response", response);

        setSelectedClasssName("");
        setSelectedStudentName("");
        setSelectedGradeTypeName("");
        setGradeValue("");
    };

    return (
        <Form
            onSubmit={handleSubmit}
            className="border p-3">
            <Container>
                <Container>
                    <Form.Label>Class</Form.Label>
                    <Form.Select
                        value={selectedClasssName}
                        onChange={handleClassChange}>
                        <option value="">Select class</option>
                        {classsNames.map((option) => (
                            <option
                                key={option}
                                value={option}>
                                {option}
                            </option>
                        ))}
                    </Form.Select>
                </Container>
                <Container>
                    <Form.Label>Student</Form.Label>
                    <Form.Select
                        value={selectedStudentId}
                        onChange={handleStudentChange}>
                        <option value="">Select student</option>
                        {studentIds.map((id) => (
                            <option
                                key={id}
                                value={id}>
                                {studentNames[studentIds.indexOf(id)]}
                            </option>
                        ))}
                    </Form.Select>
                </Container>
                <Container>
                    <Row>
                        <Col
                            xs="6"
                            lg="6">
                            <Form.Label>Grade type</Form.Label>
                            <Form.Select
                                value={selectedGradeTypeId}
                                onChange={handleGradeTypeChange}>
                                <option value="">Select type</option>
                                {gradeTypeIds.map((id) => (
                                    <option
                                        key={id}
                                        value={id}>
                                        {
                                            gradeTypeNames[
                                                gradeTypeIds.indexOf(id)
                                            ]
                                        }
                                    </option>
                                ))}
                            </Form.Select>
                        </Col>

                        <Col
                            xs="6"
                            lg="6">
                            <Form.Label>Value</Form.Label>
                            <Form.Control
                                type="number"
                                value={gradeValue}
                                onChange={handleGradeValueChange}
                            />
                        </Col>

                        <p></p>

                        <Button
                            variant="outline-info"
                            size="lg"
                            type="submit">
                            Submit Grade
                        </Button>
                    </Row>
                </Container>
            </Container>
        </Form>
    );
};

export default GradingForm;

