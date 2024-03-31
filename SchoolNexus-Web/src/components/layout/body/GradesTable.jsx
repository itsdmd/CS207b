import React, { useState, useEffect } from "react";
import { Table, Button } from "react-bootstrap";

import GetStudentGrades, {
    GetGradeTypes,
} from "../../../services/api/studentGrade.service.js";
import GetSubjects from "../../../services/api/subject.service.js";

const subjectNameVn = {
    "Maths": "Toán",
    "Physics": "Vật lý",
    "Chemistry": "Hóa học",
    "Biology": "Sinh học",
    "History": "Lịch sử",
    "Geography": "Địa lý",
    "Literature": "Ngữ văn",
    "Foreign Language": "Ngoại ngữ",
    "": "",
};

const GradesTable = () => {
    const [gradeTypeObjs, setGradeTypeObjs] = useState([]);
    const [gradeObjs, setGradeObjs] = useState([]);
    const [subjectObjs, setSubjectObjs] = useState([]);

    const [tableHtml, setTableHtml] = useState("");
    const [triggerUseEffect, setTriggerUseEffect] = useState(0);

    useEffect(() => {
        async function fetchData() {
            // gradeTypes
            const gradeTypes = await GetGradeTypes({});
            setGradeTypeObjs(gradeTypes);
            console.log("gradeTypeObjs", gradeTypes);

            // subjects
            const subjects = await GetSubjects({});
            setSubjectObjs(subjects);
            console.log("subjectObjs", subjects);

            // grades
            const grades = await GetStudentGrades({
                studentId: localStorage.getItem("userId"),
            });
            setGradeObjs(grades);
            console.log("gradeObjs", grades);

            let html = "";
            for (let i = 0; i < subjects.length; i++) {
                html += "<tr key={" + i + "}>";
                html +=
                    "<th scope='row' width='10%' className='text-left' style={{fontWeight: 'bold'}}>" +
                    subjectNameVn[subjects[i].name] +
                    "</th>";
                console.log("subject", subjects[i].id);

                let avgVal = 0.0;
                let avgCount = 0.0;
                for (let j = 0; j < gradeTypes.length; j++) {
                    console.log("gradeType", gradeTypes[j].name);
                    let grade = grades.find(
                        (grade) =>
                            grade.subjectId === subjects[i].id &&
                            grade.typeId === gradeTypes[j].id
                    );
                    if (grade) {
                        console.log("grade", grade.value);
                        html +=
                            "<td key={" +
                            i +
                            "-" +
                            j +
                            "}>" +
                            String(grade.value) +
                            "</td>";
                        avgVal += grade.value * grade.type.multiplier;
                        avgCount += grade.type.multiplier;
                    } else {
                        html +=
                            "<td key={" +
                            i +
                            "-" +
                            j +
                            ">" +
                            grade.value +
                            "</td>";
                    }
                }

                if (avgCount > 0) {
                    console.log("avgVal", avgVal);
                    console.log("avgCount", avgCount);
                    html +=
                        "<td>" +
                        String((avgVal / avgCount).toFixed(2)) +
                        "</td>";
                } else {
                    html += "<td></td>";
                }

                html += "</tr>";
            }

            setTableHtml(html);
        }

        fetchData();
    }, [triggerUseEffect]);

    const RefreshButtonPressed = async () => {
        console.log("RefreshButtonPressed");
        setTriggerUseEffect(triggerUseEffect + 1);
    };

    return (
        <Table
            bordered
            striped
            variant="light"
            hover
            className="text-center">
            <thead>
                <tr style={{ background: "blue" }}>
                    <th></th>
                    {gradeTypeObjs.map((type, index) => (
                        <th
                            key={index}
                            scope="col"
                            style={{ fontWeight: "bold" }}>
                            {type.name}
                        </th>
                    ))}
                    <th
                        scope="col"
                        style={{ fontWeight: "bold" }}>
                        Trung bình
                    </th>
                </tr>
            </thead>

            <tbody dangerouslySetInnerHTML={{ __html: tableHtml }}></tbody>

            <Button
                variant="primary"
                size="lg"
                className="mt-3"
                onClick={RefreshButtonPressed}>
                Tải lại
            </Button>
        </Table>
    );
};

export default GradesTable;
