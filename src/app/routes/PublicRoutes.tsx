import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Setup from '../components/auth/Setup';

function PublicRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/setup" />} />
      <Route path="/setup" element={<Setup />} />
    </Routes>
  );
}

export default PublicRoutes;
