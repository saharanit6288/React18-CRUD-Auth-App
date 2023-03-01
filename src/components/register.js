import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { Form, Alert } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { useUserAuth } from '../context/userAuthContext';
import { LoaderContainer, loader } from "react-global-loader";
import FidgetLoader from "../images/loader.gif";

const Register = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const {register} = useUserAuth();

    const showLoader = () => {
        loader.show();
    }

    const hideLoader = () => {
        loader.hide();
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        showLoader();
        setError("");
        try{
            await register(email,password);
            hideLoader();
            navigate('/login');
        }
        catch(err){
            setError(err.message);
            hideLoader();
        }
    }

    return (
        <>
            <LoaderContainer>
                <img src={FidgetLoader} alt="loading" />
            </LoaderContainer>
            <div className="p-4 box">
                <h2 className="mb-3">Register</h2>
                {error && <Alert variant="danger" className=' col-4'>{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3 col-4" controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control
                        type="email"
                        placeholder="Enter Email"
                        onChange={(e) => setEmail(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3 col-4" controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                        type="password"
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)}
                        />
                    </Form.Group>

                    <Button variant="primary" type="Submit">
                        Register
                    </Button>
                </Form>
            </div>
            <div className="p-4 box mt-3 text-center col-4">
                Already have an account? <Link to="/login">LogIn</Link>
            </div>
        </>
    )
}

export default Register;