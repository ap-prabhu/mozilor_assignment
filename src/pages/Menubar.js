import React, { useState } from "react";
import { Navbar, Nav, Container, Button,Modal } from 'react-bootstrap';
import { useNavigate ,NavLink } from 'react-router-dom'

import './Menubar.css';

const Menubar = () => {
  const user_deatils = JSON.parse(localStorage.getItem('user_deatils'));  
  const profile_name = user_deatils.name;  
  
  const navigate = useNavigate();
  
  const [showModal, setShowModal] = useState(false);

  const openModal = () => {
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
  };

  const handleLogout = () => {

      localStorage.removeItem("tokenType");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user_deatils");  
      navigate("/login");
  };

  return (
    <div>
      <Navbar bg="dark" variant="dark" expand="lg" fixed="top">
        <Container>
          <Navbar.Brand >Product Assignment</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ml-auto">
              <Nav.Item>
                <NavLink 
                  to="/" 
                  className="nav-link" 
                  activeclassname="active"
                > Home </NavLink>
              </Nav.Item>
              <Nav.Item>
                <NavLink 
                  to="/products" 
                  className="nav-link" 
                  activeclassname="active"
                > Product List </NavLink>
              </Nav.Item>
              <Nav.Item>
                <NavLink 
                  to="/product-import" 
                  className="nav-link" 
                  activeclassname="active"
                > Product Import </NavLink>
              </Nav.Item>
            </Nav>

            <Nav className="mr-auto">
              <Nav.Item className="mr-3">
                <span className="text-white">Hello, {profile_name}</span>
              </Nav.Item>
              <Nav.Item>
                <Button variant="outline-light" onClick={openModal}>Log Out</Button>
              </Nav.Item>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>


      {/* Model - Log Out */}
      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Logout</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to log out?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>Cancel</Button>
          <Button variant="danger" onClick={handleLogout}>Log Out</Button>
        </Modal.Footer>
      </Modal>

    </div>
  );
}

export default Menubar;