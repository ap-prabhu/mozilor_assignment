import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Form, Pagination, Alert } from 'react-bootstrap';

import axios from 'axios';

import Menubar from './Menubar';

const ProductList = () => {
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState(false);
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);

    useEffect(() => {
    const fetchProducts = async () => {
        setLoading(true);
        try {
            let url = process.env.REACT_APP_API_URL+`/api/products?`;

            if (search && search!=='') {
                url += `search=${encodeURIComponent(search)}&`;
            }
            url += `page=${page}`;

            const response = await axios.get(url);

            setProducts(response.data.data);
            setTotalPages(response.data.last_page);
            setTotalCount(response.data.total);
        } catch (errors) {
            if (errors.response.status===400) {
                const res_data = errors.response.data
                if(res_data.status===0){
                    setError('Error fetching products!'); 
                }
            }
            setError('Error fetching products!'); 
        }
        setLoading(false);
    };
    fetchProducts();
    }, [filter, page]);
    
    
    // useEffect(() => {
    //     fetchProducts();
    // }, [filter, page]);
    
    
    const handleInputChange = (e) => {
        setSearch(e.target.value);
        setPage(1);
    };

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    const handleFilter = (e) => {
        setFilter(true);
    };

    return (
        <div>
            <Menubar/>
                   
            <Container className="d-flex justify-content-center align-items-center mt-5" style={{ paddingTop: '70px' }}>
            <Card style={{ width: "800px" }}>
                <Card.Header className="text-center">
                    <h4>Product Listings</h4>
                </Card.Header>
                <Card.Body>
                    <Row className="mb-3">
                        <Col md={5}>
                        <Form.Label>Search</Form.Label>
                        <Form.Control
                            type="text"
                            name="search"
                            placeholder="Search by Product Name or SKU "
                            value={search}
                            onChange={(e) => handleInputChange(e)}
                        />
                        </Col>
                        <Col md={3}>
                        <Button
                            variant="primary"
                            className="mt-4"
                            disabled={loading}
                            onClick={(e) => handleFilter(e)}
                        >
                            {loading ? 'Applying Filter...' : 'Filter'}
                        </Button>
                        </Col>
                    </Row>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Row>
                        <div className="mb-4 text-end " style={{paddingRight: '40px'}}>
                            <strong>Total: </strong>{totalCount}
                        </div>
                        <Table striped bordered hover responsive>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Product Name</th>
                                    <th>Price</th>
                                    <th>SKU</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.length > 0 ? (
                                    products.map((product, index) => (
                                        <tr key={product.id}>
                                            <td>{(page - 1) * 10 + index + 1}</td>
                                            <td>{product.product_name}</td>
                                            <td>${product.price}</td>
                                            <td>{product.sku}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="text-center">
                                            No products found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </Row>            
                    <Row>
                            <Col>
                                <Pagination>
                                    <Pagination.Prev
                                        onClick={() => page > 1 && handlePageChange(page - 1)}
                                    />
                                    {[...Array(totalPages).keys()].map((i) => (
                                        <Pagination.Item
                                            key={i + 1}
                                            active={i + 1 === page}
                                            onClick={() => handlePageChange(i + 1)}
                                        >
                                            {i + 1}
                                        </Pagination.Item>
                                    ))}
                                    <Pagination.Next
                                        onClick={() => page < totalPages && handlePageChange(page + 1)}
                                    />
                                </Pagination>
                            </Col>
                        </Row>

                </Card.Body>
            </Card>
            </Container>
        </div>
    );
};

export default ProductList