import React, { useState,useEffect } from "react";
import { useNavigate,Link } from 'react-router-dom';
import { Navbar, Container, Card, Form, Button, Alert } from 'react-bootstrap';

import axios from 'axios';

const Signup = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "",user_name: "",mobile_number: "" });
  const [message, setMessage] = useState('');
  const [apiError, setApiError] = useState('');
  const [errors, setErrors] = useState({});

  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      navigate("/");
    }
  }, [navigate]);


  const validateForm = () => {
    let validationErrors = {};
    let isValid = true;
  
    if (!formData.name) {
      validationErrors.name = "Please fill the Name!.";
      isValid = false;
    } else if (formData.name.length > 100) {
      validationErrors.name = "Name Must be les than 100 Characters!.";
      isValid = false;
    }

    if (!formData.email) {
      validationErrors.email = "Please fill the Email !.";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      validationErrors.email = "Please Enter a valid Email!.";
      isValid = false;
    }
  
    if (!formData.password) {
      validationErrors.password = "Please fill the Password!.";
      isValid = false;
    } else if(formData.password.length < 8){
      validationErrors.password = "Password Must be 8 characters or longer!.";
      isValid = false;
    }
    
    if (!formData.user_name) {
      validationErrors.user_name = "Please fill the User Name!.";
      isValid = false;
    }

    if (formData.mobile_number && !formData.mobile_number.length===10) {
      validationErrors.mobile_number = "Mobile Number Must be 10 characters or longer!.";
      isValid = false;
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsSubmitting(false);
    }
    return isValid;
  };

  const handleNameKeyPress = (e) => {
    const charCode = e.keyCode || e.which;
    const charStr = String.fromCharCode(charCode);
    if (!/^[a-zA-Z]+$/.test(charStr) && e.key !== "Backspace" && e.key !== "Delete") {
        e.preventDefault();
    }
  };

  const handleMobileKeyPress = (e) => {
      const charCode = e.keyCode || e.which;
      const charStr = String.fromCharCode(charCode);
      if (!/^\d+$/.test(charStr) && e.key !== "Backspace" && e.key !== "Delete") {
          e.preventDefault();
      }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
      e.preventDefault();
      setErrors({});
      setIsSubmitting(true);
      if (validateForm()) {
        try {
          const response = await axios.post(process.env.REACT_APP_API_URL+'/api/register', formData);
          console.log(response);
          if (response.data.status===1) {
            setMessage('Register Successfully!');
            const timer = setTimeout(() => {
              navigate("/login")
            }, 1000);
            return () => clearTimeout(timer);
          } else {
            setApiError(response.data.error); 
          }
        } catch (error) {
            setApiError('Something went error on Sign Up, Please try again!.');
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
      <Container className="d-flex justify-content-center align-items-center mt-5" style={{ paddingTop: '70px'}}>
      <Card style={{ width: '100%', maxWidth: '400px' }} className="p-4">
        <Card.Body>
          <h3 className="text-center">Sign Up</h3>
          <hr className="my-2" style={{ border: '1px solid #007bff', margin: '0 auto' }} />
          <Form onSubmit={handleSubmit}>
            <Form.Group size="lg" controlId="formName" className="mb-1">
              <Form.Label>Name<span style={{ color: 'red' }}>*</span></Form.Label>
              <Form.Control
                autoFocus
                type="text"
                name="name"
                placeholder="Enter email"
                value={formData.name}
                onKeyDown={(e) => handleNameKeyPress(e)}
                onChange={(e) => handleInputChange(e)}
                // isInvalid={!!errors.name}
              />
                {errors.name && <Form.Text className="text-danger">{errors.name}</Form.Text>}
            </Form.Group>
            <Form.Group size="lg" controlId="formEmail" className="mb-1">
              <Form.Label>Email<span style={{ color: 'red' }}>*</span></Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="Enter email"
                value={formData.email}
                onChange={(e) => handleInputChange(e)}
              />
              {errors.email && <Form.Text className="text-danger">{errors.email}</Form.Text>}
            </Form.Group>
            <Form.Group size="lg" controlId="formPassword" className="mb-1">
              <Form.Label>Password<span style={{ color: 'red' }}>*</span></Form.Label>
              <Form.Control
                type="password"
                name="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={(e) => handleInputChange(e)}
              />
              {errors.password && <Form.Text className="text-danger">{errors.password}</Form.Text>}
            </Form.Group>
            <Form.Group size="lg" controlId="formUser_name" className="mb-1">
              <Form.Label>User Name<span style={{ color: 'red' }}>*</span></Form.Label>
              <Form.Control
                type="text"
                name="user_name"
                placeholder="Enter User name"
                value={formData.user_name}
                onChange={(e) => handleInputChange(e)}
              />
              {errors.user_name && <Form.Text className="text-danger">{errors.user_name}</Form.Text>}
            </Form.Group>
            <Form.Group size="lg" controlId="formMobile_number" className="mb-1">
              <Form.Label>Mobile Number</Form.Label>
              <Form.Control
                type="text"
                name="mobile_number"
                value={formData.mobile_number}
                onKeyDown={(e) => handleMobileKeyPress(e)}
                onChange={(e) => handleInputChange(e)}
              />
              {errors.mobile_number && <Form.Text className="text-danger">{errors.mobile_number}</Form.Text>}
            </Form.Group>
            <div className="btn-div">
              <Button
                variant="primary"
                type="submit"
                disabled={isSubmitting}
              >
              {isSubmitting ? 'Submitting...' : 'Register'}
              </Button>
            </div>
            {message && <Alert variant="success">{message}</Alert>}
          </Form>
          {apiError && (
            <Alert variant="danger" className="mt-3">
              {apiError}
            </Alert>
          )}
          <div className="signup-link">
            <p>Alreay have an account? <Link to="/login"> Login </Link></p>
          </div>
        </Card.Body>
      </Card>
      </Container>
    </div>
  );
};

export default Signup;