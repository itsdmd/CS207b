import React, { useEffect, useState } from "react";
import {
    Form,
    Row,
    Col,
    Button,
    FormGroup,
    FormCheck,
    Container,
} from "react-bootstrap";

import GetUser, {
    UserBySchoolId,
    SchoolByUserId,
} from "../../../../services/api/user.service";

const TimetableForm = () => {
    const [selectedUserAccountType, setUserAccountType] = useState("TEACHER");
    const [selectedUserId, setUserId] = useState("");
    const [selectedClasssName, setSelectedClass] = useState("");
    const [selectedDayOfWeek, setDayOfWeek] = useState("");
    const [selectedTimeSlot, setTimeSlot] = useState("");

    const [users, setUserIds] = useState([]);
    const [classses, setClasssIds] = useState([]);

    const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const timeSlots = [...Array(8).keys()].map((i) => i + 1);

    useEffect(() => {
        console.log("Fetching data...");
        async function fetchData() {
            setUserIds([]);

            const schoolId = (
                await SchoolByUserId(localStorage.getItem("userId"))
            ).id;

            const fetchedUserIds = (await UserBySchoolId(schoolId)).map(
                (obj) => obj.id
            );
            console.log("fetchedUserIds", fetchedUserIds);

            const temp = [];

            for (let i = 0; i < fetchedUserIds.length; i++) {
                const response = (
                    await GetUser({
                        id: fetchedUserIds[i],
                    })
                )[0];

                if (response.accountType === selectedUserAccountType) {
                    temp.push(response.id);
                }
            }
            console.log("temp", temp);
            setUserIds(temp);
        }
        fetchData();
    }, [selectedUserAccountType]);

    const handleUserTypeChange = (event) => {
        setUserAccountType(event.target.value);
        setSelectedClass("");
        setDayOfWeek("");
        setTimeSlot("");
    };

    const handleUserChange = (event) => {
        setUserId(event.target.value);
    };

    const handleClassChange = (event) => {
        setSelectedClass(event.target.value);
    };

    const handleDayOfWeekChange = (event) => {
        setDayOfWeek(event.target.value);
    };

    const handleTimeSlotChange = (event) => {
        setTimeSlot(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (selectedUserAccountType === "STUDENT") {
            setDayOfWeek("");
            setTimeSlot("");
        }

        setUserAccountType("");
        setUserId("");
        setSelectedClass("");
        setDayOfWeek("");
        setTimeSlot("");
    };

    return (
        <Form
            onSubmit={handleSubmit}
            style={{ fontWeight: "bold" }}
            className="border p-5">
            <div className="d-flex ">
                <FormGroup>
                    <FormCheck
                        inline
                        label="Teacher"
                        type="radio"
                        id="teacherRadio"
                        value="TEACHER"
                        checked={selectedUserAccountType === "TEACHER"}
                        onChange={handleUserTypeChange}
                    />
                    <FormCheck
                        inline
                        label="Student"
                        type="radio"
                        id="studentRadio"
                        value="STUDENT"
                        checked={selectedUserAccountType === "STUDENT"}
                        onChange={handleUserTypeChange}
                    />
                </FormGroup>
            </div>
            <Form.Group
                as={Row}
                className="mt-3">
                <Col
                    sm="6"
                    lg="6">
                    <Form.Label>User:</Form.Label>
                    <Form.Select
                        value={selectedUserId}
                        title={selectedUserId || "Select User"}
                        onChange={handleUserChange}>
                        {selectedUserAccountType &&
                            (selectedUserAccountType === "TEACHER"
                                ? users.map((option) => (
                                      <option
                                          key={option}
                                          value={option}>
                                          {option}
                                      </option>
                                  ))
                                : users.map((option) => (
                                      <option
                                          key={option}
                                          value={option}>
                                          {option}
                                      </option>
                                  )))}
                    </Form.Select>
                </Col>

                <Col
                    sm="6"
                    lg="6">
                    <Form.Label>Class:</Form.Label>
                    <Form.Select
                        value={selectedClasssName}
                        title={selectedClasssName || "Select Class"}
                        onChange={handleClassChange}>
                        {selectedUserAccountType &&
                            classses.map((id) => (
                                <option
                                    key={id}
                                    value={id}>
                                    {id}
                                </option>
                            ))}
                    </Form.Select>
                </Col>
            </Form.Group>

            {selectedUserAccountType === "TEACHER" && (
                <Form.Group
                    as={Row}
                    className="mt-4">
                    <Col
                        sm="6"
                        lg="6">
                        <Form.Label>Day of Week</Form.Label>
                        <Form.Select
                            value={selectedDayOfWeek}
                            title={selectedDayOfWeek || "Select day of week"}
                            onChange={handleDayOfWeekChange}>
                            {daysOfWeek.map((id) => (
                                <option
                                    key={id}
                                    value={id}>
                                    {id}
                                </option>
                            ))}
                        </Form.Select>
                    </Col>

                    <Col
                        sm="6"
                        lg="6">
                        <Form.Label>Time Slot</Form.Label>
                        <Form.Select
                            value={selectedTimeSlot}
                            title={selectedTimeSlot || "Select Time Slot"}
                            onChange={handleTimeSlotChange}>
                            {timeSlots.map((id) => (
                                <option
                                    key={id}
                                    value={id}>
                                    {id}
                                </option>
                            ))}
                        </Form.Select>
                    </Col>
                </Form.Group>
            )}

            <p></p>
            <Button
                variant="outline-info"
                size="lg"
                type="submit">
                Submit
            </Button>
        </Form>
    );
};

export default TimetableForm;
