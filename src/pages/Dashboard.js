import React from "react";
import { Container, Card, Button } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

import Menubar from './Menubar';


const Dashboard = (props) => {

  return (
    <div>
      <Menubar />
      <Container className="mt-5" style={{ paddingTop: '70px' }}>
        <div className="row justify-content-center">
          <div className="col-md-4 mb-4">
            <Card>
              <Card.Body className="text-center">
                <Card.Title>Product List</Card.Title>
                <Card.Text>
                  The list of Product that imported.
                </Card.Text>
                <NavLink to="/products" className="text-decoration-none">
                  <Button variant="primary">Go</Button>
                </NavLink>
              </Card.Body>
            </Card>
          </div>
          <div className="col-md-4 mb-4">
            <Card>
              <Card.Body className="text-center">
                <Card.Title>Import Product</Card.Title>
                <Card.Text>
                  The Import the Product using csv file.
                </Card.Text>
                <NavLink to="/product-import" className="text-decoration-none">
                  <Button variant="primary">Go</Button>
                </NavLink>
              </Card.Body>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Dashboard;