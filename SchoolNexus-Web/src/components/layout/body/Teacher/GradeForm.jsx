import React, { useState } from 'react';
import { Button,  Container, Form, Row, Col } from 'react-bootstrap'

const GradingForm = () => {
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [gradeType, setGradeType] = useState('');
  const [gradeValue, setGradeValue] = useState('');


  //placeholder
  const classes = ['Math', 'Science', 'History']; 
  const students = [ 'Taylor', 'Jisoo' ]; 
  const gradeTypes = ['Assignment', 'Quiz', 'Midterm', 'Final'];


  const handleClassChange = (event) => {
    setSelectedClass(event.target.value);
  };

  const handleStudentChange = (event) => {
    setSelectedStudent(event.target.value);
  };

  const handleGradeTypeChange = (event) => {
    setGradeType(event.target.value);
  };

  const handleGradeValueChange = (event) => {
    setGradeValue(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    console.log(
        `Grade submitted: Class: ${selectedClass},
         Student: ${selectedStudent}, 
         Grade Type: ${gradeType}, 
         Grade Value: ${gradeValue}`);

    setSelectedClass('');
    setSelectedStudent('');
    setGradeType('');
    setGradeValue('');
  };

  return (
    <Form onSubmit={handleSubmit} className='border p-3'>
        <Container>
            <Container>
                <Form.Label>Class:</Form.Label>
                <Form.Select value={selectedClass} onChange={handleClassChange}>
                    <option value="">Select Class</option>
                    {classes.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                    ))}
                </Form.Select>
            </Container>
            <Container>
                
              <Form.Label>Student:</Form.Label>
              <Form.Select value={selectedStudent} onChange={handleStudentChange}>
                <option value="">Select Student</option>
                {selectedClass &&
                  students.map((student) => (
                    <option key={student} value={student}>
                      {student}
                    </option>
                  ))}
              </Form.Select>
            </Container>
            <Container>
                <Row>
                    <Col xs='6' lg='6'>
                        <Form.Label>Grade type:</Form.Label>
                        <Form.Select value={gradeType} onChange={handleGradeTypeChange}>
                            <option value="">Select type</option>
                            {
                                gradeTypes.map((type) => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                        </Form.Select>
                    </Col>

                    <Col xs='6' lg='6'>
                        <Form.Label>Grade Value:</Form.Label>
                        <Form.Control type="number" value={gradeValue} onChange={handleGradeValueChange} />
                    </Col>

                    <p></p>

                    <Button variant="outline-info" size='lg' type="submit">
                        Submit Grade
                    </Button>
                </Row>
            </Container>
        </Container>
    </Form>
  );
};

export default GradingForm;