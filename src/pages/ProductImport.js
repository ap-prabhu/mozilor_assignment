import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';

import Menubar from './Menubar';


const ProductImport = () => {
    const [imported_file, setImported_file] = useState(null);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [apierror, setApierror] = useState([]);
    const [apiduplicates, setApiduplicates] = useState([]);
    const navigate = useNavigate();

    const handleFileChange = (e) =>{
        const selectedFile = e.target.files[0];

        if (selectedFile && selectedFile.type === 'text/csv') {
            setImported_file(selectedFile);
            setError(null);
          } else {
            setImported_file(null);
            setError(['Please select a valid CSV file.']);
          }
    }   

    const handleUpload = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('imported_file', imported_file);
        if (!imported_file) {
            setError(["Please select a file to upload."]);
            return;
        }

        try {
            const response =  await axios.post(process.env.REACT_APP_API_URL+'/api/import-products', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            if (response.data.status===1) {
                setMessage(response.data.message);
                const timer = setTimeout(() => {
                    navigate("/products")
                }, 2000);
                return () => clearTimeout(timer);
            } else {
                setApierror(['response.data.status']); 
            }
        } catch (errors) {
            if (errors.response.status===400) {
                const res_data = errors.response.data
                if(res_data.status===0){

                    if(res_data.error.imported_file){
                        setApierror([res_data.error.imported_file]);
                    } else {
                        const Invalid = res_data.error.Invalid ? res_data.error.Invalid : [];
                        const duplicates = res_data.error.duplicates ? res_data.error.duplicates : [];
                        
                        if (Invalid && Array.isArray(Invalid)) {
                            setApierror(Invalid);
                        } else if (res_data.error && !Array.isArray(res_data.error)){
                            setApierror([res_data.error]);
                        }

                        if (duplicates && Array.isArray(duplicates)) {
                            setApiduplicates(duplicates);
                        } else if (res_data.error && !Array.isArray(res_data.error)){
                            setApiduplicates([res_data.error]);
                        }
                    }                    
                } else {
                    setApierror(['Something went worng on import, Please try agian!']);
                }
            } else {
                setApierror(['Something went worng on import, Please try agian!']);
            }
        }
    };

    return (
        <div>
            <Menubar/>

            <Container className="d-flex justify-content-center align-items-center mt-5" style={{ paddingTop: '70px'}}>
            <Card style={{ width: "500px" }}>
                <Card.Header className="text-center">
                <h4>Import Product</h4>
                </Card.Header>
                <Card.Body>
                <Form>
                    <Form.Group controlId="fileInput">
                        <Form.Label>Upload File <span style={{ color: 'red' }}>* Only .csv fils</span> </Form.Label>
                        <Form.Control type="file" accept=".csv, text/csv" onChange={handleFileChange} />
                        {error && <Form.Text className="text-danger">{error}</Form.Text>}
                    </Form.Group>
                    <div className="btn-div">
                        <Button variant="primary" type="submit" className="mt-3" onClick={handleUpload}>
                        Submit
                        </Button>
                    </div>
                    {message && <Alert variant="success">{message}</Alert>}

                    { apierror.length > 0 && (
                        <Alert variant="danger">
                           <strong>Import file has Error / Invalid :-</strong>
                        {apierror.map((err, index) => (
                            <div key={index}>
                            { err.row ? (<> Row {err.row}:
                                <ul>{err.errors.map((errMsg, idx) => (
                                        <li key={idx}>{errMsg}</li>
                                    ))}
                                </ul>
                                </> ) : ( <> <strong>Error:</strong>{err} </> )
                            }
                            </div>
                        ))}
                         </Alert>
                    )}
                    { apiduplicates.length > 0 && (
                        <Alert variant="danger">
                           <strong>Import file has Duplicates data :-</strong>
                        {apiduplicates.map((err, index) => (
                            <div key={index}>
                                Row {err.row}:- {err.product_name}
                            </div>
                        ))}
                         </Alert>
                    )}
                </Form>

                <div className="text-center mt-3">
                    <a href="/assets/files/products_sample.csv" download> Download Sample CSV File</a>
                </div>
                </Card.Body>
            </Card>
            </Container>

        </div>

    );
};

export default ProductImport;