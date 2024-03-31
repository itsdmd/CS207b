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

import GetUser, {
    NewUser,
    DeleteUser,
} from "../../../../services/api/user.service";
import GetSchool, {
    GetUSA,
    NewUSA,
} from "../../../../services/api/school.service";
import GetSubject, { NewTSA } from "../../../../services/api/subject.service";

export default function ManageAccountForm() {
    const [userId, setUserId] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState();
    const [gender, setGender] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [selectedSchoolId, setSelectedSchoolId] = useState("");
    const [selectedAccountType, setSelectedAccountType] = useState("");
    const [selectedSubjectId, setSelectedSubjectId] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const [filterUserId, setFilterUserId] = useState("");
    const [filterSchoolId, setFilterSchoolId] = useState("");
    const [filterAccountType, setFilterAccountType] = useState("");
    const [userList, setUserList] = useState([]);
    const [schoolList, setSchoolList] = useState([]);
    const [subjectList, setSubjectList] = useState([]);
    const [triggerUseEffect, setTriggerUseEffect] = useState(0);

    useEffect(() => {
        async function fetchData() {
            /* -------------- User -------------- */
            setUserList([]);
            const allUsers = await GetUser({});
            console.log("fetched users:", allUsers);
            setUserList(allUsers);

            /* -------------- School -------------- */
            setSchoolList([]);
            const allSchools = await GetSchool({});
            console.log("fetched schools:", allSchools);
            setSchoolList(allSchools);

            /* -------------- Subject -------------- */
            setSubjectList([]);
            const allSubjects = await GetSubject({});
            console.log("fetched subjects:", allSubjects);
            setSubjectList(allSubjects);
        }

        fetchData();
    }, [triggerUseEffect]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("handleSubmitButton pressed");

        if (
            !userId ||
            !fullName ||
            !gender ||
            !email ||
            !phone ||
            !address ||
            !gender ||
            !selectedAccountType
        ) {
            setErrorMessage("Vui lòng điền thông tin vào tất cả các trường.");
            return;
        } else {
            setErrorMessage("");
        }

        const formData = {
            id: userId,
            password: password,
            fullName: fullName,
            dateOfBirth: dateOfBirth,
            gender: gender,
            email: email,
            phoneNumber: phone,
            address: address,
            accountType: selectedAccountType,
        };
        const newUserResponse = await NewUser(formData);
        console.log("New user created:", newUserResponse);

        setSuccessMessage("Tạo người dùng mới thành công!");

        const usaData = {
            userId: newUserResponse.id,
            schoolId: selectedSchoolId,
        };
        const newUSAResponse = await NewUSA(usaData);
        console.log("New USA created:", newUSAResponse);

        if (selectedAccountType === "TEACHER" && selectedSubjectId) {
            const tsaData = {
                userId: newUserResponse.id,
                subjectId: selectedSubjectId,
            };
            const newTSAResponse = await NewTSA(tsaData);
            console.log("New TSA created:", newTSAResponse);
        }

        setTriggerUseEffect(triggerUseEffect + 1);
    };

    const handleResetBtnPressed = async (e) => {
        setErrorMessage("");
        setSuccessMessage("");

        setUserId("");
        setPassword("");
        setFullName("");
        setDateOfBirth("");
        setGender("");
        setEmail("");
        setPhone("");
        setAddress("");
        setSelectedAccountType("");
        setSelectedSubjectId("");
        setSelectedSchoolId("");
    };

    const handleDeleteBtnPressed = async (e) => {
        console.log("handleDeleteBtnPressed");

        const response = await DeleteUser(e.target.value);
        console.log(response);

        setSuccessMessage("Xóa người dùng thành công!");

        setTriggerUseEffect(triggerUseEffect + 1);
    };

    const handleInfoBtnPressed = async (e) => {
        console.log("handleInfoBtnPressed");

        const response = await GetUser({ id: e.target.value });
        console.log(response);

        setUserId(response[0].id);
        setPassword("");
        setFullName(response[0].fullName);
        setDateOfBirth(new Date(response[0].dateOfBirth).toISOString());
        setGender(response[0].gender);
        setEmail(response[0].email);
        setPhone(response[0].phoneNumber);
        setAddress(response[0].address);
        setSelectedAccountType(response[0].accountType);
        try {
            setSelectedSubjectId(response[0].tsa[0].subjectId);
        } catch (e) {
            setSelectedSubjectId("");
        }
        try {
            setSelectedSchoolId(response[0].usa[0].schoolId);
        } catch (e) {
            setSelectedSchoolId("");
        }
    };

    const handleFilterSubmit = async (e) => {
        e.preventDefault();
        console.log("handleFilterSubmit pressed");

        const filteredUserIdList = [];

        if (filterSchoolId) {
            const usa = await GetUSA({ schoolId: filterSchoolId });
            usa.forEach((u) => {
                filteredUserIdList.push(u.userId);
            });
        }

        const filterObj = {};

        if (filterUserId) {
            filterObj.id = filterUserId;
        }

        if (filterAccountType) {
            filterObj.accountType = filterAccountType;
        }

        setUserList([]);
        const allUsers = await GetUser(filterObj);
        console.log("fetched user:", allUsers);

        if (filterSchoolId) {
            const filteredUsers = allUsers.filter((user) =>
                filteredUserIdList.includes(user.id)
            );
            setUserList(filteredUsers);
            console.log("filteredUsers:", filteredUsers);
        } else {
            setUserList(allUsers);
        }
    };

    const printSchoolName = (user) => {
        try {
            return (
                " - " +
                schoolList[
                    schoolList.map((s) => s.id).indexOf(user.usa[0].schoolId)
                ].name
            );
        } catch (e) {
            return "";
        }
    };

    return (
        <Container className="py-5 h-100">
            <Row className="d-flex justify-content-center align-items-start h-100">
                <Col>
                    <h3 className="mb-5">New User Account</h3>
                    <div className="my-4">
                        <Row>
                            <Col>
                                <div className="card-body p-md-5 text-black">
                                    <Form onSubmit={(e) => handleSubmit(e)}>
                                        {/* User ID */}
                                        <Row className="md-6 mb-4">
                                            <div className="form-outline">
                                                <FormLabel>
                                                    ID Người dùng
                                                </FormLabel>
                                                <FormControl
                                                    type="text"
                                                    id="userId"
                                                    className="lg"
                                                    value={userId}
                                                    onChange={(e) =>
                                                        setUserId(
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </div>
                                        </Row>

                                        {/* Password */}
                                        <Row className="md-6 mb-4">
                                            <div className="form-outline">
                                                <FormLabel>Mật khẩu</FormLabel>
                                                <FormControl
                                                    type="password"
                                                    id="password"
                                                    className="lg"
                                                    value={password}
                                                    onChange={(e) =>
                                                        setPassword(
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </div>
                                        </Row>

                                        {/* Full Name */}
                                        <Row className="md-6 mb-4">
                                            <div className="form-outline">
                                                <FormLabel>Họ tên</FormLabel>
                                                <FormControl
                                                    type="text"
                                                    id="fullname"
                                                    className="lg"
                                                    value={fullName}
                                                    onChange={(e) =>
                                                        setFullName(
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </div>
                                        </Row>

                                        {/* Gender */}
                                        <Row className="md-6 mb-4">
                                            <div className="form-outline">
                                                <FormLabel>Giới tính</FormLabel>

                                                <Form.Select
                                                    id="accountTypeSelect"
                                                    className="select"
                                                    value={gender}
                                                    onChange={(e) =>
                                                        setGender(
                                                            e.target.value
                                                        )
                                                    }>
                                                    <option value="">
                                                        Chọn một
                                                    </option>
                                                    <option value="MALE">
                                                        Nam
                                                    </option>
                                                    <option value="FEMALE">
                                                        Nữ
                                                    </option>
                                                </Form.Select>
                                            </div>
                                        </Row>

                                        {/* Date of Birth */}
                                        <Row className="md-6 mb-4">
                                            <div className="form-outline">
                                                <FormLabel>
                                                    Ngày sinh{" "}
                                                    <small className="text-secondary">
                                                        <i>(YYYY-MM-DD)</i>
                                                    </small>
                                                </FormLabel>
                                                <FormControl
                                                    type="text"
                                                    for="dateOfBirth"
                                                    className="lg"
                                                    value={dateOfBirth}
                                                    onChange={(e) => {
                                                        setDateOfBirth(
                                                            e.target.value
                                                        );
                                                    }}
                                                    onBlur={(e) => {
                                                        setDateOfBirth(
                                                            new Date(
                                                                e.target.value
                                                            ).toISOString()
                                                        );
                                                        console.log(
                                                            dateOfBirth
                                                        );
                                                    }}
                                                />
                                            </div>
                                        </Row>

                                        {/* Account type */}
                                        <Row className="md-6 mb-4">
                                            <div className="form-outline">
                                                <FormLabel>
                                                    Loại tài khoản
                                                </FormLabel>

                                                <Form.Select
                                                    id="accountTypeSelect"
                                                    className="select"
                                                    value={selectedAccountType}
                                                    onChange={(e) =>
                                                        setSelectedAccountType(
                                                            e.target.value
                                                        )
                                                    }>
                                                    <option value="">
                                                        Chọn một
                                                    </option>
                                                    <option value="STUDENT">
                                                        Học sinh
                                                    </option>
                                                    <option value="TEACHER">
                                                        Giáo viên
                                                    </option>
                                                    <option value="PRINCIPAL">
                                                        Hiệu trưởng
                                                    </option>
                                                    <option value="ADMIN">
                                                        Quản trị viên
                                                    </option>
                                                </Form.Select>
                                            </div>
                                        </Row>

                                        {/* For Teacher: Subject Assignment */}
                                        {selectedAccountType === "TEACHER" ? (
                                            <Row className="md-6 mb-4">
                                                <div className="form-outline">
                                                    <FormLabel>
                                                        Bộ môn giảng dạy
                                                    </FormLabel>
                                                    <Form.Select
                                                        id="subjectSelect"
                                                        className="select"
                                                        value={
                                                            selectedSubjectId
                                                        }
                                                        onChange={(e) =>
                                                            setSelectedSubjectId(
                                                                e.target.value
                                                            )
                                                        }>
                                                        <option value="">
                                                            Chọn một
                                                        </option>
                                                        {subjectList.map(
                                                            (subject) => (
                                                                <option
                                                                    value={
                                                                        subject.id
                                                                    }>
                                                                    {
                                                                        subject.name
                                                                    }
                                                                </option>
                                                            )
                                                        )}
                                                    </Form.Select>
                                                </div>
                                            </Row>
                                        ) : null}

                                        {/* Phone number */}
                                        <Row className="md-6 mb-4">
                                            <div className="form-outline">
                                                <FormLabel>
                                                    Số điện thoại
                                                </FormLabel>
                                                <FormControl
                                                    type="text"
                                                    className="lg"
                                                    value={phone}
                                                    onChange={(e) =>
                                                        setPhone(e.target.value)
                                                    }
                                                />
                                            </div>
                                        </Row>

                                        {/* Email */}
                                        <Form.Group
                                            className="mb-4"
                                            controlId="email">
                                            <FormLabel>Email</FormLabel>
                                            <FormControl
                                                type="text"
                                                value={email}
                                                onChange={(e) =>
                                                    setEmail(e.target.value)
                                                }
                                            />
                                        </Form.Group>

                                        {/* Address */}
                                        <Form.Group
                                            className="mb-4"
                                            controlId="address">
                                            <FormLabel>Địa chỉ</FormLabel>
                                            <FormControl
                                                type="text"
                                                value={address}
                                                onChange={(e) =>
                                                    setAddress(e.target.value)
                                                }
                                            />
                                        </Form.Group>

                                        {/* School */}
                                        <Row className="md-6 mb-4">
                                            <div className="form-outline">
                                                <FormLabel>
                                                    Trường học
                                                </FormLabel>
                                                <Form.Select
                                                    id="schoolSelect"
                                                    className="select"
                                                    value={selectedSchoolId}
                                                    onChange={(e) =>
                                                        setSelectedSchoolId(
                                                            e.target.value
                                                        )
                                                    }>
                                                    <option value="">
                                                        Chọn một
                                                    </option>
                                                    {schoolList.map(
                                                        (school) => (
                                                            <option
                                                                value={
                                                                    school.id
                                                                }>
                                                                {school.name}
                                                            </option>
                                                        )
                                                    )}
                                                </Form.Select>
                                            </div>
                                        </Row>

                                        <div className="d-flex justify-content-end pt-3">
                                            <Button
                                                type="button"
                                                className="btn btn-light btn-lg"
                                                onClick={(e) =>
                                                    handleResetBtnPressed(e)
                                                }>
                                                Đặt lại
                                            </Button>
                                            <Button
                                                type="submit"
                                                className="btn btn-primary btn-lg ms-2">
                                                Xác nhận
                                            </Button>
                                        </div>
                                    </Form>

                                    {/* Error message */}
                                    {errorMessage === "" ? null : (
                                        <div
                                            class="alert alert-danger alert-dismissible fade show mt-3"
                                            role="alert">
                                            {errorMessage}
                                        </div>
                                    )}

                                    {/* Success message */}
                                    {successMessage === "" ? null : (
                                        <div
                                            class="alert alert-success alert-dismissible fade show mt-3"
                                            role="alert">
                                            {successMessage}
                                        </div>
                                    )}
                                </div>
                            </Col>
                        </Row>
                    </div>
                </Col>

                <Col>
                    <h3 className="mb-5">Quản lý tài khoản</h3>
                    <div className="card-body p-md-5 text-black">
                        <Form onSubmit={(e) => handleFilterSubmit(e)}>
                            {/* User ID */}
                            <Row className="md-6 mb-4">
                                <div className="form-outline">
                                    <FormLabel>ID Người dùng</FormLabel>
                                    <div className="d-flex justify-content-between">
                                        <FormControl
                                            type="text"
                                            id="filterUserId"
                                            className="lg"
                                            value={filterUserId}
                                            onChange={(e) =>
                                                setFilterUserId(e.target.value)
                                            }
                                        />
                                    </div>
                                </div>
                            </Row>

                            {/* School */}
                            <Row className="md-6 mb-4">
                                <div className="form-outline">
                                    <FormLabel>Trường học</FormLabel>
                                    <Form.Select
                                        className="select"
                                        value={filterSchoolId}
                                        onChange={(e) =>
                                            setFilterSchoolId(e.target.value)
                                        }>
                                        <option value="">Chọn một</option>
                                        {schoolList.map((school) => (
                                            <option value={school.id}>
                                                {school.name}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </div>
                            </Row>

                            {/* Account type */}
                            <Row className="md-6 mb-4">
                                <div className="form-outline">
                                    <FormLabel>Loại tài khoản</FormLabel>
                                    <Form.Select
                                        className="select"
                                        value={filterAccountType}
                                        onChange={(e) =>
                                            setFilterAccountType(e.target.value)
                                        }>
                                        <option value="">Chọn một</option>
                                        <option value="STUDENT">
                                            Học sinh
                                        </option>
                                        <option value="TEACHER">
                                            Giáo viên
                                        </option>
                                        <option value="PRINCIPAL">
                                            Hiệu trưởng
                                        </option>
                                        <option value="ADMIN">
                                            Quản trị viên
                                        </option>
                                    </Form.Select>
                                </div>
                            </Row>

                            <Row className="md-6 mb-4">
                                <div className="form-outline d-flex justify-content-around">
                                    <Button
                                        type="submit"
                                        className="btn-lg btn-light"
                                        onClick={(e) => {
                                            setFilterUserId("");
                                            setFilterSchoolId("");
                                            setFilterAccountType("");
                                            setTriggerUseEffect(
                                                triggerUseEffect + 1
                                            );
                                        }}>
                                        Đặt lại
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="btn-lg btn-primary">
                                        Lọc
                                    </Button>
                                </div>
                            </Row>
                        </Form>
                    </div>
                    <Container
                        className="w-80 border text-center "
                        style={{
                            borderColor: "azure",
                            height: "512px",
                            borderRadius: "30px",
                            overflowY: "auto",
                        }}>
                        {userList.map((user) => (
                            <div>
                                <Form.Label className="border mt-3 w-75">
                                    {user.id} - {user.fullName}
                                    {" | "}
                                    {user.accountType}
                                    {printSchoolName(user)}
                                </Form.Label>
                                <Button
                                    value={user.id}
                                    className="btn-info btn-sm text-white"
                                    onClick={handleInfoBtnPressed}>
                                    i
                                </Button>
                                <Button
                                    value={user.id}
                                    className="btn-danger btn-sm text-white"
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
