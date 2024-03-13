import React, { useState } from 'react';
import { Button,  Container, Form, Row, Col } from 'react-bootstrap'

const ClassForm = () => {
  const [submitClassname, setSubmiClassname] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedFormTeacherID, setSelectedFormTeacher] = useState('');


  //placeholder
  const teachers = [
    {id : '13', name: 'Taylor'},
    {id: '2', name:'Jisoo'}
  ];

  const grades = [...Array(12).keys()].map((i) => i + 1);

  const handleClassnameChange = (event) => {
    setSubmiClassname(event.target.value);
  };

  const handleGradeChange = (event) => {
    setSelectedGrade(event.target.value);
  };

  const handleFormTeacherChange = (event) => {
    setSelectedFormTeacher(event.target.value);
  };


  const handleSubmit = (event) => {
    event.preventDefault();

    console.log(
        `Class submitted: Class: ${submitClassname},
         Grade: ${selectedGrade},
         Form teacher: ${selectedFormTeacherID}`
        );

    setSelectedFormTeacher('')
    setSubmiClassname('')
    setSelectedGrade('')
  };

  return (
    <Form onSubmit={handleSubmit} className='border p-3 w-50' style={{ fontWeight: 'bold' }}>
        <Form.Group as={Row}>
            <Col sm='6' lg='12'>
                <Form.Label>Class name: </Form.Label>
                <Form.Control type='text' value={submitClassname} onChange={handleClassnameChange} placeholder='Enter classname...' />
            </Col>

            <Col sm='6' lg='12' className='mt-2'>
                <Form.Label>Grade: </Form.Label>
                <Form.Select value={selectedGrade} onChange={handleGradeChange}>
                    <option value="">Select Grade</option>
                    {grades.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                    ))}
                </Form.Select>
            </Col>
            
            <Col sm='6' lg='12' className='mt-2'>
                <Form.Label>Form Teacher: </Form.Label>
                <Form.Select value={selectedFormTeacherID} onChange={handleFormTeacherChange}>
                    <option value="">Select Form Teacher</option>
                    {teachers.map((teacher) => (
                        <option value={teacher.id} key={teacher.id} >
                            {teacher.id} - {teacher.name}
                        </option>
                    ))}
                </Form.Select>
            </Col>
            
            <Col sm='6' lg='12' className='mt-4'>
                <Button variant="outline-info" type="submit"  style={{ width: '100%'} }>
                    Submit
                </Button>
            </Col>
        </Form.Group>
        <p></p>
       
    </Form>
  );
};

export default ClassForm;