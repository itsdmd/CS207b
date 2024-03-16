import React, { useState, useEffect } from "react";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import "bootstrap/dist/css/bootstrap.min.css";
import Defaultbar from "../../components/layout/navigation/Defaultbar";
import { Col, Container, Row, Image, CloseButton } from "react-bootstrap";

import ImgClassroom from "../../assets/classroom.jpg";
import PageFooter from "../../components/layout/footer/Footer";
import { GetClasss, GetUCA, NewUCA } from "../../services/api/classs.service";
import { UserBySchoolId } from "../../services/api/user.service";

export default function AssignUser() {
    const [selectedUserId, setSelectedUserId] = useState("");
    const [selectedClasssName, setSelectedClasssName] = useState("");
    const [userIds, setUserIds] = useState([""]);
    const [classsNames, setClasssNames] = useState([""]);
    const [classsIds, setClasssIds] = useState([""]);
    const [ucaList, setUCAList] = useState([]);

    useEffect(() => {
        async function fetchData() {
            if (selectedUserId === "" && selectedClasssName === "") {
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
    }, [selectedUserId, selectedClasssName]);

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

    const handleClasssChange = (event) => {
        setSelectedClasssName(event.target.value);
    };

    const handleUserChange = (event) => {
        setSelectedUserId(event.target.value);
    };

    return (
        <div>
            <Defaultbar />

            <Container
                className="mb-5 mt-5"
                style={{ borderRadius: "30px" }}>
                <Row>
                    <Col className="w-75">
                        <Image
                            src={ImgClassroom}
                            className="w-100 h-100"
                            style={{ borderRadius: "30px" }}
                        />
                    </Col>
                    <Col>
                        <Form.Group className="mb-3 w-80 mr-3">
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
                            <Form.Label
                                style={{
                                    fontSize: "20px",
                                    fontWeight: "bold",
                                }}>
                                <i class="bi bi-person-circle"></i> User
                            </Form.Label>
                            <Container>
                                <Form.Select>
                                    <option
                                        key="None"
                                        value=""
                                        onChange={handleUserChange}>
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
                        </Form.Group>

                        <Container
                            className="w-80 border text-center "
                            style={{
                                borderColor: "azure",
                                height: "512px",
                                borderRadius: "30px",
                            }}>
                            {/* <div>
                                <Form.Label className="border mt-3 w-75">
                                    User #1
                                </Form.Label>
                                <CloseButton className="bg-danger" />
                            </div>
                            <div>
                                <Form.Label className="border mt-3 w-75">
                                    User #2
                                </Form.Label>
                                <CloseButton className="bg-danger" />
                            </div> */}
                            {ucaList.map((uca) => (
                                <div>
                                    <Form.Label className="border mt-3 w-75">
                                        {uca.userId} - {uca.classs.name}
                                    </Form.Label>
                                    <CloseButton className="bg-danger" />
                                </div>
                            ))}
                        </Container>
                    </Col>
                </Row>
            </Container>
            <PageFooter />
        </div>
    );
}
