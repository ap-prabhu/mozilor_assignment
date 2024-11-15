// import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from 'axios';

import ProtectedRoute from './pages/ProtectedRoute';
import Login from "./pages/Login";
import Signup from './pages/Signup';
import Dashboard from "./pages/Dashboard";
import ProductImport from './pages/ProductImport';
import ProductList from './pages/ProductList';


function App() {

  const tokenType = localStorage.getItem('tokenType');
  const accessToken = localStorage.getItem('accessToken');  
  
  if (accessToken) {
      axios.defaults.headers.common['Authorization'] = `${tokenType} ${accessToken}`;
  }

  return (
      <BrowserRouter>
        <Routes>
          <Route  path="/login" element={<Login />} />
          <Route  path="/signup" element={<Signup />} />
          <Route  index path="/" element={
                    <ProtectedRoute>
                      <Dashboard/>
                    </ProtectedRoute>
                  } />
          <Route  path="/product-import" 
                  element={
                    <ProtectedRoute>
                        <ProductImport/>
                    </ProtectedRoute>
                  } />
          <Route  path="/products" 
                  element={
                    <ProtectedRoute>
                        <ProductList/>
                    </ProtectedRoute>
                  } />
        </Routes> 
      </BrowserRouter>

  );
}

export default App;
