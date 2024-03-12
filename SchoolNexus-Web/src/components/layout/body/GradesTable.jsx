import React from 'react';
import { Table } from 'react-bootstrap';

const subjects = ['Biology', 'Chemistry', 'Foreign Language', 'Geography', 'History', 'Literature', 'Maths', 'Physics'];
const gradeTypes = ['Quiz', 'Exam', 'Test', 'Average'];

const Gradestable = () => {
  return (
    <Table bordered striped variant='light' hover className='text-center'>
        <thead >
            <tr  style={{background: 'blue'}}>
                <th></th>
                {gradeTypes.map((type, index) => (
                    <th key={index} scope="col" style={{fontWeight: 'bold'}}>{type}</th>
                ))}
            </tr>
        </thead>

        <tbody>
            {subjects.map((subject, rowIndex) => (
                <tr key = {rowIndex}>
                    <th scope="row" width='10%' className='text-center' style={{fontWeight: 'bold'}}>{subject}</th>

                    {gradeTypes.map((type, colIndex) => (
                        <td key={`${rowIndex}-${colIndex}`}>
                            10                              
                        </td>
                    ))}
                </tr>
            ))}
        </tbody>

    </Table>
  );
};

export default Gradestable;