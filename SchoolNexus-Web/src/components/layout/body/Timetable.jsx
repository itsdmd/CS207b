import React, { useEffect, useState } from "react";
import { Table, Button } from "react-bootstrap";
import { TimetableEntryByUserId } from "../../../services/api/timetable.service";
const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function Timetable() {
    const [response, setResponse] = useState();
    const [tableHtml, setTableHtml] = useState();

    useEffect(() => {
        fetchTTEntry();
        console.log("ttData:", response);
    }, []);

    async function fetchTTEntry() {
        const ttData = await TimetableEntryByUserId("student_0");
        setResponse(ttData);

        let html = "";
        // loop through array of object,
        // object's timeSlot attribute is the row index
        // object's dayOfWeek attribute is the column index
        // object's subjectId attribute is the value
        // each row is placed inside a <tr> tag
        // the first cell of each row is a <th> tag
        // the rest of the cells are <td> tags
        for (let i = 0; i < ttData.length; i++) {
            // console.log(
            //     ttData[i].dayOfWeek,
            //     ttData[i].timeSlot,
            //     ttData[i].subjectName
            // );
            if (ttData[i].dayOfWeek == "0") {
                html += "\n<tr>";
                html +=
                    '\n<th scope="row" width="10%" className="text-center" style={{ fontWeight: "bold" }}> ' +
                    String(parseInt(ttData[i].timeSlot) + 1) +
                    " </th>";
            }

            if (localStorage.getItem("userAccountType") == "TEACHER") {
                html += `\n<td>${ttData[i].classsName}</td>`;
            } else if (localStorage.getItem("userAccountType") == "STUDENT") {
                html += `\n<td>${ttData[i].subjectName}</td>`;
            }

            if (ttData[i].dayOfWeek == "5") {
                html += "\n</tr>";
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
                                style={{ fontWeight: "bold" }}>
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
                Refresh
            </Button>
        </div>
    );
}
