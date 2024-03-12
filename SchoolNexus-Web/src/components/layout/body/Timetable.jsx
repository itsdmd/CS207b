import React, { useEffect, useState } from "react";
import { Table, Placeholder, Button } from "react-bootstrap";
import TimetableEntryByUserId from "../../../services/api/timetable.service";
import GetUser from "../../../services/api/user.service";
import { getUserGql } from "../../../services/api/schema.constants";
const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const periods = [
    "Period 1",
    "Period 2",
    "Period 3",
    "Period 4",
    "Period 5",
    "Period 6",
    "Period 7",
    "Period 8",
];

export default function Timetable() {
    // let ttData = null;

    // useEffect(() => {
    //     FetchTTData();

    //     console.log("ttData:", ttData);
    // }, []);

    // const FetchTTData = async () => {
    //     // await TimetableEntryByUserId("student_0");
    //     ttData = await apolloClient.query({
    //         query: getUserGql({ id: userId }),
    //     });
    // };

    const RefreshButtonPressed = async () => {
        console.log("Refresh button pressed");
        const ttData = await TimetableEntryByUserId("student_0");
        console.log("ttData:", ttData);
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
                <tbody>
                    {periods.map((period, rowIndex) => (
                        <tr key={rowIndex}>
                            <th
                                scope="row"
                                width="10%"
                                className="text-center"
                                style={{ fontWeight: "bold" }}>
                                {period}
                            </th>
                            {days.map((day, colIndex) => (
                                <td key={`${rowIndex}-${colIndex}`}>Subject</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
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
