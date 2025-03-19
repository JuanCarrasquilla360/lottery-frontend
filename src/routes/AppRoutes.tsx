// src/routes/AppRoutes.tsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import CheckoutPage from '../pages/CheckoutPage';
import PaymentResultPage from '../pages/PaymentResultPage';
import Terminos from '../pages/Terminos';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/checkout/:id" element={<CheckoutPage />} />
      <Route path="/payment-result" element={<PaymentResultPage />} />
      <Route path="/terminos" element={<Terminos />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;