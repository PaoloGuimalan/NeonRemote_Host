import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Home from '../components/Home';

function PrivateRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/app" />} />
      <Route path="/app" element={<Home />} />
    </Routes>
  );
}

export default PrivateRoutes;
