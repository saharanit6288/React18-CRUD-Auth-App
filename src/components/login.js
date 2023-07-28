import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { Form, Alert } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { useUserAuth } from '../context/userAuthContext';
import { LoaderContainer, loader } from "react-global-loader";
import { RotatingLines } from 'react-loader-spinner';

const Login = () => {

    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");

    const showLoader = () => {
        loader.show();
    }

    const hideLoader = () => {
        loader.hide();
    }
    const navigate = useNavigate();

    const {login} = useUserAuth();

    const handleSubmit = async (e) => {
      e.preventDefault();
      showLoader();
      setError("");
      try{
          await login(email,password);
          hideLoader();
          navigate('/');
      }
      catch(err){
          setError(err.message);
          hideLoader();
      }
    }

    return (
        <>
            <LoaderContainer>
                <RotatingLines
                    strokeColor="green"
                    strokeWidth="5"
                    animationDuration="0.75"
                    width="96"
                    visible={true}
                />
            </LoaderContainer>
            <div className="p-4 box">
                <h2 className="mb-3">Login</h2>
                {error && <Alert variant="danger" className=' col-4'>{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3 col-4" controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type="email" placeholder="Enter Email"
                        onChange={(e) => setEmail(e.target.value)} />
                    </Form.Group>

                    <Form.Group className="mb-3 col-4" controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)} />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        LogIn
                    </Button>
                </Form> 
            </div>
            {/* <div className="p-4 box mt-3 text-center col-4">
                Don't have an account? <Link to="/register">Register</Link>
            </div> */}
        </>
    )
}

export default Login;