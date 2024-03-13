import React, { useState } from "react";
import {
    Form,
    Row,
    Col,
    Button,
    FormGroup,
    FormCheck,
    Container,
} from "react-bootstrap";

const ScheduleForm = () => {
    const [selecteduserType, setUserType] = useState("");
    const [selecteduserId, setUserId] = useState("");
    const [selectedClass, setSelectedClass] = useState("");
    const [selecteddayOfWeek, setDayOfWeek] = useState("");
    const [selectedtimeSlot, setTimeSlot] = useState("");

    const studentIds = ["123", "456"];
    const teacherIds = ["abc", "def", "ghi"];
    const classId = ["1", "2", "3"];
    const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const timeSlots = [...Array(8).keys()].map((i) => i + 1);

    const handleUserTypeChange = (event) => {
        setUserType(event.target.value);
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

        if (selecteduserType === "student") {
            setDayOfWeek("");
            setTimeSlot("");
        }

        console.log(`Schedule: User Type: ${selecteduserType},
     User ID: ${selecteduserId}, 
     Class ID: ${selectedClass},
     Day: ${selecteddayOfWeek}, 
     Time Slot: ${selectedtimeSlot}`);

        setUserType("");
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
                        value="teacher"
                        checked={selecteduserType === "teacher"}
                        onChange={handleUserTypeChange}
                    />
                    <FormCheck
                        inline
                        label="Student"
                        type="radio"
                        id="studentRadio"
                        value="student"
                        checked={selecteduserType === "student"}
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
                        value={selecteduserId}
                        title={selecteduserId || "Select User"}
                        onChange={handleUserChange}>
                        {selecteduserType &&
                            (selecteduserType === "teacher"
                                ? teacherIds.map((option) => (
                                      <option
                                          key={option}
                                          value={option}>
                                          {option}
                                      </option>
                                  ))
                                : studentIds.map((option) => (
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
                        value={selectedClass}
                        title={selectedClass || "Select Class"}
                        onChange={handleClassChange}>
                        {selecteduserType &&
                            classId.map((id) => (
                                <option
                                    key={id}
                                    value={id}>
                                    {id}
                                </option>
                            ))}
                    </Form.Select>
                </Col>
            </Form.Group>

            {selecteduserType === "teacher" && (
                <Form.Group
                    as={Row}
                    className="mt-4">
                    <Col
                        sm="6"
                        lg="6">
                        <Form.Label>Day of Week</Form.Label>
                        <Form.Select
                            value={selecteddayOfWeek}
                            title={selecteddayOfWeek || "Select day of week"}
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
                            value={selectedtimeSlot}
                            title={selectedtimeSlot || "Select Time Slot"}
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

export default ScheduleForm;
