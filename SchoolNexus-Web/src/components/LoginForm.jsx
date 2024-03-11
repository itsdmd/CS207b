import logo from "../assets/logo.png"
import axios from "axios";
import React, { useState } from "react";
import { useEffect } from 'react';
import {Form, Button,Container,Row,Col,InputGroup,Image} from 'react-bootstrap';
export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const {user,setUser} =  useState()
  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      const foundUser = JSON.parse(loggedInUser);
      setUser(foundUser);
    }
  }, []);
  const handleSubmit = async e => {
    e.preventDefault();
    const user = { username, password };
    // send the username and password to the server
    const response = await axios.post(
      "http://blogservice.herokuapp.com/api/login",
      user
    );
    // set the state of the user
    setUser(response.data)
    // store the user in localStorage
    localStorage.setItem('user', response.data)
    console.log(response.data)
  };
  if (user) {
      return <div>{user.name} is loggged in</div>;
  }
  return (
    <Container className="align-center mt-5 mb-5">

      <Row className="align-center align-items-center">

        <Col col='6' className="mb-5">
          <div className="d-flex flex-column ms-5">

            <div className="text-center">
              <Image src={logo} width={300} height={350} />
              <h4 className="mt-1 mb-5 pb-1">Login</h4>
            </div>

            <Form>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Control type="email" placeholder="Enter email" />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Control type="password" placeholder="Password" />
              </Form.Group>
            </Form>


            <div className="text-center pt-1 mb-5 pb-1">
              <Button className="mb-4 w-100 gradient">Sign in</Button>
              <a className="text-muted" href="#!">Forgot password?</a>
            </div>

            <div className="d-flex flex-row align-items-center justify-content-center pb-4 mb-4">
              <p className="mb-0">Don't have an account?</p>
              <Button className='mx-2 outline'>
                Sign In
              </Button>
            </div>

          </div>

        </Col>

        <Col col='6' className="mb-5 align-center">
          <div className="d-flex flex-column  justify-content-center gradient h-100 mb-4">

            <div className="text-black px-3 py-4 p-md-5 mx-md-4 text-center">
              <h4 className="mb-4">School Nexus is  the future</h4>
              <p className="small mb-0">School Nexus App offers a comprehensive solution for streamlining various administrative tasks in educational institutions.
              </p>
            </div>

          </div>

        </Col>

      </Row>

    </Container>
  );
}
