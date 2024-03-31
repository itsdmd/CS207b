import React, { useEffect, useState } from "react";
import { Table, Button } from "react-bootstrap";
import { TimetableEntryByUserId } from "../../../services/api/timetable.service";
const days = [
    "Monday",
    "Tueday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
];

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
export default function Timetable({ userId }) {
    const [response, setResponse] = useState();
    const [tableHtml, setTableHtml] = useState();

    console.log("userId:", userId);
    useEffect(() => {
        fetchTTEntry();
        // console.log("ttData:", response);
    }, []);

    async function fetchTTEntry() {
        const ttData = await TimetableEntryByUserId(userId);
        const userAccountType = localStorage.getItem("userAccountType");
        setResponse(ttData);
        console.log("ttData:", ttData);

        let html = "";
        // loop through array of object,
        // object's timeSlot attribute is the row index
        // object's dayOfWeek attribute is the column index
        // object's subjectId attribute is the value
        // each row is placed inside a <tr> tag
        // the first cell of each row is a <th> tag
        // the rest of the cells are <td> tags
        let ttDataIter = 0;
        for (let ts = 0; ts < 8; ts++) {
            for (let day = 0; day < 7; day++) {
                const ttObj = ttData.find((obj) => {
                    return obj.timeSlot == ts && obj.dayOfWeek == day;
                });
                // console.log("ttObj:", ttObj);
                // console.log("day:", day, "ts:", ts);
                if (ttObj) {
                    ttDataIter++;

                    if (day == 0) {
                        // console.log("added row");
                        html += "\n<tr>";
                        html +=
                            '\n<th scope="row" className="text-center" style={{ fontWeight: "bold" }}> ' +
                            String(ts + 1) +
                            " </th>";
                    }

                    if (
                        userAccountType == "TEACHER" ||
                        userAccountType == "PRINCIPAL"
                    ) {
                        html += `\n<td>${ttObj.classsName}</td>`;
                    } else if (userAccountType == "STUDENT") {
                        html += `\n<td>${
                            subjectNameVn[ttObj.subjectName]
                        }</td>`;
                    }

                    if (day == 6) {
                        console.log("end of row");
                        html += "\n</tr>";
                    }
                } else {
                    if (day == 6) {
                        // console.log("end of row");
                        html += "\n</tr>";
                    } else if (day == 0) {
                        // console.log("added row");
                        html += "\n<tr>";
                        html +=
                            '\n<th scope="row" className="text-center" style={{ fontWeight: "bold" }}> ' +
                            String(ts + 1) +
                            " </th>";
                        html += `\n<td></td>`;
                    } else {
                        html += `\n<td></td>`;
                    }
                }
            }
        }
        // console.log(html);
        setTableHtml(html);
    }

    const RefreshButtonPressed = async () => {
        console.log("RefreshButtonPressed");
        await fetchTTEntry();
        console.log("ttData:", response);
    };

    return (
        <div>
            <Table
                bordered
                striped
                variant="light"
                hover
                className="text-center">
                <thead>
                    <tr style={{ background: "blue" }}>
                        <th></th>
                        {days.map((day, index) => (
                            <th
                                key={index}
                                scope="col"
                                style={{ fontWeight: "bold", width: "16%" }}>
                                {day}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody dangerouslySetInnerHTML={{ __html: tableHtml }}></tbody>
            </Table>

            <Button
                variant="primary"
                size="lg"
                onClick={RefreshButtonPressed}>
                Tải lại
            </Button>
        </div>
    );
}
