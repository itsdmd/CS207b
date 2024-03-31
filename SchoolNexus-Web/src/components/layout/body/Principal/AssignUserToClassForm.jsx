import React, { useState, useEffect } from "react";
import {
    Button,
    Col,
    Container,
    Form,
    Row,
    Image,
    CloseButton,
} from "react-bootstrap";

import {
    GetClasss,
    GetUCA,
    NewUCA,
    DeleteUCA,
} from "../../../../services/api/classs.service";
import ImgClassroom from "../../../../assets/classroom.jpg";
import { UserBySchoolId } from "../../../../services/api/user.service";

const AssignUserToClassForm = () => {
    const [selectedUserId, setSelectedUserId] = useState("");
    const [selectedClasssName, setSelectedClasssName] = useState("");
    const [userIds, setUserIds] = useState([""]);
    const [classsNames, setClasssNames] = useState([""]);
    const [classsIds, setClasssIds] = useState([""]);
    const [ucaList, setUCAList] = useState([]);

    const [triggerUseEffect, setTriggerUseEffect] = useState(0);

    useEffect(() => {
        async function fetchData() {
            const usersFromSchool = await UserBySchoolId(
                localStorage.getItem("schoolId")
            );
            console.log("fetched user:", usersFromSchool);
            setUserIds(usersFromSchool.map((user) => user.id));

            const classsesFromSchool = await GetClasss({
                schoolId: localStorage.getItem("schoolId"),
            });
            console.log("fetched class:", classsesFromSchool);
            setClasssIds(classsesFromSchool.map((classs) => classs.id));
            setClasssNames(classsesFromSchool.map((classs) => classs.name));
        }
        fetchData();
    }, []);

    useEffect(() => {
        async function fetchData() {
            if (selectedUserId === "" && selectedClasssName === "") {
                setUCAList([]);
                return;
            }

            const selectedClasssId =
                classsIds[classsNames.indexOf(selectedClasssName)];

            const result = await GetUCA({
                userId: selectedUserId,
                classsId: selectedClasssId,
            });
            console.log("fetched UCA:", result);

            setUCAList(result);
        }
        fetchData();
    }, [selectedUserId, selectedClasssName, triggerUseEffect]);

    const handleClasssChange = (event) => {
        setSelectedClasssName(event.target.value);
    };

    const handleUserChange = (event) => {
        console.log("selected user:", event.target.value);
        setSelectedUserId(event.target.value);
    };

    const handleAssignBtnPressed = async (event) => {
        event.preventDefault();

        console.log("Assign button pressed");
        const response = await NewUCA({
            userId: selectedUserId,
            classsId: classsIds[classsNames.indexOf(selectedClasssName)],
        });
        console.log("New UCA:", response);

        setTriggerUseEffect(triggerUseEffect + 1);
    };

    const handleDeleteBtnPressed = async (event) => {
        console.log("Delete button pressed");

        const response = await DeleteUCA(event.target.value);
        console.log("Deleted UCA:", response);

        setTriggerUseEffect(triggerUseEffect + 1);
    };

    return (
        <Container
            className="mb-5 mt-5"
            style={{ borderRadius: "30px" }}>
            <h1>Assign user to class</h1>
            <Row>
                <Col className="w-75">
                    <Image
                        src={ImgClassroom}
                        className="w-100 h-100"
                        style={{ borderRadius: "30px" }}
                    />
                </Col>
                <Col>
                    <Form.Group className="mb-3 w-80 mr-3 d-flex">
                        <Col>
                            <Form.Label
                                style={{
                                    fontSize: "20px",
                                    fontWeight: "bold",
                                }}>
                                <i class="bi bi-easel2-fill"></i> Class
                            </Form.Label>
                            <Container className="d-flex">
                                <Form.Select
                                    value={selectedClasssName}
                                    onChange={handleClasssChange}>
                                    <option
                                        key="None"
                                        value="">
                                        None
                                    </option>
                                    {classsNames.map((classsId) => (
                                        <option
                                            key={classsId}
                                            value={classsId}>
                                            {classsId}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Container>
                        </Col>

                        <Col>
                            <Form.Label
                                style={{
                                    fontSize: "20px",
                                    fontWeight: "bold",
                                }}>
                                <i class="bi bi-person-circle"></i> User
                            </Form.Label>
                            <Container>
                                <Form.Select onChange={handleUserChange}>
                                    <option
                                        key="None"
                                        value="">
                                        None
                                    </option>
                                    {userIds.map((userId) => (
                                        <option
                                            key={userId}
                                            value={userId}>
                                            {userId}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Container>
                        </Col>

                        <Button
                            className="mt-3"
                            type="submit"
                            onClick={handleAssignBtnPressed}>
                            Assign
                        </Button>
                    </Form.Group>

                    <Container
                        className="w-80 border text-center mt-3"
                        style={{
                            borderColor: "azure",
                            height: "512px",
                            borderRadius: "30px",
                            overflowY: "auto",
                        }}>
                        {ucaList.map((uca) => (
                            <div>
                                <Form.Label className="border mt-3 w-75">
                                    {uca.userId} - {uca.classs.name}
                                </Form.Label>
                                <CloseButton
                                    value={uca.id}
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
};

export default AssignUserToClassForm;
