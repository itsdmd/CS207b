import React, { useEffect, useState } from "react";
import { Form, Row, Col, Button, FormGroup, FormCheck } from "react-bootstrap";

import GetUser, {
    UserBySchoolId,
    SchoolByUserId,
} from "../../../../services/api/user.service";
import { GetClasss } from "../../../../services/api/classs.service";
import {
    TimetableEntry,
    TimetableEntryByUserId,
    NewTimetableEntry,
    TimetableEntryAttendence,
    NewTimetableEntryAttendence,
} from "../../../../services/api/timetable.service";

const TimetableForm = () => {
    const [selectedUserAccountType, setUserAccountType] = useState("");
    const [selectedUserId, setSelectedUserId] = useState("");
    const [selectedClasssName, setSelectedClasssName] = useState("");
    const [selectedDayOfWeek, setSelectedDayOfWeek] = useState("Mon");
    const [selectedTimeSlot, setSelectedTimeSlot] = useState("1");

    const [users, setUserIds] = useState([]);
    const [classsNames, setClasssNames] = useState([]);
    const [classsIds, setClasssIds] = useState([]);

    const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const timeSlots = [...Array(8).keys()].map((i) => i + 1);

    useEffect(() => {
        console.log("Fetching data...");
        async function fetchData() {
            setUserIds([]);
            setClasssNames([]);

            /* -------------- User -------------- */
            const schoolId = (
                await SchoolByUserId(localStorage.getItem("userId"))
            ).id;
            localStorage.setItem("schoolId", schoolId);

            const fetchedUserIds = (await UserBySchoolId(schoolId)).map(
                (obj) => obj.id
            );
            console.log("fetchedUserIds", fetchedUserIds);

            const tempUsers = [];

            for (let i = 0; i < fetchedUserIds.length; i++) {
                const response = (
                    await GetUser({
                        id: fetchedUserIds[i],
                    })
                )[0];

                if (response.accountType === selectedUserAccountType) {
                    tempUsers.push(response.id);
                }
            }
            setUserIds(tempUsers);

            /* -------------- Class -------------- */
            const fetchedClassses = await GetClasss({ schoolId: schoolId });
            console.log(
                "fetchedClasssIds",
                fetchedClassses.map((obj) => obj.id)
            );
            setClasssIds(fetchedClassses.map((obj) => obj.id));

            console.log(
                "fetchedClasssNames",
                fetchedClassses.map((obj) => obj.name)
            );
            setClasssNames(fetchedClassses.map((obj) => obj.name));

            setSelectedClasssName(fetchedClassses[0].name);

            if (selectedDayOfWeek == "") {
                setSelectedDayOfWeek(daysOfWeek[0]);
            }

            if (selectedTimeSlot == "") {
                setSelectedTimeSlot(timeSlots[0]);
            }
        }
        fetchData();
    }, [selectedUserAccountType]);

    const handleUserTypeChange = (event) => {
        setUserAccountType(event.target.value);
        setSelectedClasssName("");
        setSelectedDayOfWeek("");
        setSelectedTimeSlot("");
    };

    const handleUserChange = (event) => {
        setSelectedUserId(event.target.value);
    };

    const handleClassChange = (event) => {
        setSelectedClasssName(event.target.value);
    };

    const handleDayOfWeekChange = (event) => {
        setSelectedDayOfWeek(event.target.value);
    };

    const handleTimeSlotChange = (event) => {
        setSelectedTimeSlot(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        console.log("selectedUserId", selectedUserId);
        console.log("schoolId", localStorage.getItem("schoolId"));
        // console.log("classsNames", classsNames);
        // console.log("selectedClasssName", selectedClasssName);
        console.log(
            "classsId",
            classsIds[classsNames.indexOf(selectedClasssName)]
        );
        console.log("selectedDayOfWeek", daysOfWeek.indexOf(selectedDayOfWeek));
        console.log("selectedTimeSlot", parseInt(selectedTimeSlot) - 1);

        if (selectedUserId === "") {
            console.error("Please select a user");
            return;
        }

        const semesterId =
            new Date().getFullYear().toString() +
            "-" +
            (new Date().getMonth() < 6 ? "01" : "02");
        console.log("semesterId", semesterId);

        // create timetableEntry
        const tteObj = {
            semesterId: semesterId,
            schoolId: localStorage.getItem("schoolId"),
            classsId: classsIds[classsNames.indexOf(selectedClasssName)],
            dayOfWeek: String(daysOfWeek.indexOf(selectedDayOfWeek)),
            timeSlot: String(parseInt(selectedTimeSlot) - 1),
        };
        console.log("tteObj", tteObj);
        const timetableEntry = await NewTimetableEntry(tteObj);
        console.log("timetableEntry", timetableEntry);

        // create timetableEntryAttendence
        const tea = await NewTimetableEntryAttendence({
            timetableEntryId: timetableEntry.id,
            userId: selectedUserId,
        });
        console.log("tea", tea);

        if (tea) {
            console.log("Timetable Entry Attendence created successfully");
        }
    };

    return (
        <Form
            onSubmit={handleSubmit}
            style={{ fontWeight: "bold", width: "550px", background: "white" }}
            className="border shadow p-5">
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
                        <option
                            key="None"
                            value="">
                            None
                        </option>
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
                            classsNames.map((id) => (
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

            <Form.Group as={Row}>
                <Button
                    variant="outline-info"
                    size="lg"
                    type="submit"
                    className="mt-4">
                    Submit
                </Button>
            </Form.Group>
        </Form>
    );
};

export default TimetableForm;
