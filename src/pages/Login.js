import React, { useState,useEffect } from "react";
import { useNavigate, Link } from 'react-router-dom';
import { Navbar, Container, Card, Form, Button, Alert } from 'react-bootstrap';

import axios from 'axios';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [apiError, setApiError] = useState('');
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      navigate("/");
    }
  }, [navigate]);

  const validateForm = () => {
    let validationErrors = {};
    let isValid = true;
  
    if (!formData.email) {
      validationErrors.email = "Email is required!.";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      validationErrors.email = "Please Enter a valid Email!.";
      isValid = false;
    }
  
    if (!formData.password) {
      validationErrors.password = "Password is required!.";
      isValid = false;
    } else if(formData.password.length < 8){
      validationErrors.password = "Password Must be 8 characters or longer!.";
      isValid = false;
    }
  
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsSubmitting(false);
    }

    return isValid;
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
      e.preventDefault();
      setErrors({});
      setApiError(''); 
      setMessage(''); 
      setIsSubmitting(true);
      if (validateForm()) {
        try {
          const response = await axios.post(process.env.REACT_APP_API_URL+'/api/login', formData);
          if (response.data.status===1) {
            localStorage.setItem('tokenType', response.data.token_type);
            localStorage.setItem('accessToken', response.data.access_token);
            localStorage.setItem('user_deatils', JSON.stringify(response.data.user_deatils));
            setMessage('Login successful!');
            const timer = setTimeout(() => {
              navigate("/")
            }, 1000);
            return () => clearTimeout(timer);
          } else {
            setApiError(response.data.status); 
          }
        } catch (error) {
          console.log(error.response)
            if (error.response.status===401) {
              const res_data = error.response.data
              if(res_data.status===0){
                setApiError(res_data.error); 
              } else {
                  setApiError(['Something went error on Login, Please try again!']);
              }
          } else {
              setApiError(['Something went error on Login, Please try again!']);
          }

        }
      }
      setIsSubmitting(false);
  };

  return (
    <div>
      <Navbar bg="dark" variant="dark" expand="lg" fixed="top">
        <Container style={{ height: '50px'}}>
        </Container>
      </Navbar>
      <Container className="d-flex justify-content-center align-items-center mt-5" style={{ paddingTop: '70px' }}>
      <Card style={{ width: '100%', maxWidth: '400px'}} className="p-4">
        <Card.Body>
          <h3 className="text-center">Login</h3>
          <hr className="my-2" style={{ border: '1px solid #007bff', margin: '0 auto' }} />
          <Form onSubmit={handleSubmit}>
            <Form.Group size="lg" controlId="formEmail" className="mb-1">
              <Form.Label>Email</Form.Label>
              <Form.Control
                autoFocus
                type="text"
                name="email"
                placeholder="Enter email"
                value={formData.email}
                onChange={(e) => handleInputChange(e)}
              />
              {errors.email && <Form.Text className="text-danger">{errors.email}</Form.Text>}
            </Form.Group>

            <Form.Group size="lg" controlId="formPassword" className="mb-1">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={(e) => handleInputChange(e)}
              />
              {errors.password && <Form.Text className="text-danger">{errors.password}</Form.Text>}
            </Form.Group>
            <div className="btn-div">
              <Button
                variant="primary"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Login'}
              </Button>
            </div>
          </Form>
          {message && (
            <Alert variant="success" className="mt-3">
              {message}
            </Alert>
          )}
          {apiError && (
            <Alert variant="danger" className="mt-3">
              {apiError}
            </Alert>
          )}
          <div className="signup-link">
            <p>Don't have an account? <Link to="/signup"> Sign Up </Link>
             </p>
          </div>
        </Card.Body>
      </Card>
      </Container>
    </div>
  );
};

export default Login;