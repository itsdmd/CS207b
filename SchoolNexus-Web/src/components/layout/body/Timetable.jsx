import React from 'react';
import { Table, Placeholder } from 'react-bootstrap';
import TimetableEntryByUserId from '../../../services/api/timetable.service';
import GetUser from '../../../services/api/user.service';
const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const periods = ['Period 1', 'Period 2', 'Period 3', 'Period 4', 'Period 5', 'Period 6', 'Period 7', 'Period 8'];

const Timetable = () => {
  TimetableEntryByUserId("student_0");
  GetUser("student_0");
  return (
    <Table bordered striped variant='light' hover className='text-center'>
        <thead>
            <tr  style={{background: 'blue'}}>
                <th></th>
                {days.map((day, index) => (
                    <th key={index} scope="col" style={{fontWeight: 'bold'}}>{day}</th>
                ))}
            </tr>
        </thead>

        <tbody>
            {periods.map((period, rowIndex) => (
                <tr key = {rowIndex}>
                    <th scope="row" width='10%' className='text-center' style={{fontWeight: 'bold'}}>{period}</th>
                    
                    {days.map((day, colIndex) => (
                        <td key={`${rowIndex}-${colIndex}`}>
                            Subject
                        </td>
                    ))}
                </tr>
            ))}
        </tbody>

    </Table>
  );
};

export default Timetable;