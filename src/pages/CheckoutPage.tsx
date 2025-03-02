// src/pages/CheckoutPage.tsx
import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Alert,
  CircularProgress,
  Grid,
  Divider,
  Paper,
  Snackbar,
} from "@mui/material";
import MainLayout from "../components/layout/MainLayout";
import { useWallpaper } from "../hooks/useWallpapers";
import BillingForm, {
  BillingFormValues,
} from "../components/checkout/BillingForm";
import OrderSummary from "../components/checkout/OrderSummary";

interface LocationState {
  quantity: number;
  totalPrice: number;
  productId?: string;
}

const CheckoutPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [checkoutData, setCheckoutData] = useState<LocationState | null>(null);
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [formData, setFormData] = useState<BillingFormValues | null>(null);
  const [transactionReference, setTransactionReference] = useState<
    string | null
  >(null);
  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error";
  }>({
    show: false,
    message: "",
    type: "success",
  });

  // Get wallpaper data
  const { wallpaper, loading, error } = useWallpaper(id || "");

  useEffect(() => {
    // Get checkout data from location state
    const state = location.state as LocationState;
    if (state && state.quantity && state.totalPrice) {
      setCheckoutData(state);
    } else {
      // If no state, redirect back to homepage
      navigate("/");
    }
  }, [location, navigate]);

  const handleFormSubmit = (values: BillingFormValues) => {
    console.log("Form values:", values);
    // En una implementación completa, aquí guardaríamos los datos en el backend
  };

  const handleFormValuesChange = (values: BillingFormValues) => {
    setFormData(values);
  };

  const handleTransactionCreated = (reference: string) => {
    setTransactionReference(reference);
    setNotification({
      show: true,
      message: `Transacción iniciada con referencia: ${reference}`,
      type: "success",
    });
    // En una implementación completa, aquí guardaríamos la referencia en el backend
  };

  // Cierra la notificación
  const handleCloseNotification = () => {
    setNotification({ ...notification, show: false });
  };

  // Actualiza el estado de validación del formulario
  const updateFormValidity = (valid: boolean) => {
    setIsFormValid(valid);
  };

  if (loading || !checkoutData) {
    return (
      <MainLayout>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "60vh",
          }}
        >
          <CircularProgress />
        </Box>
      </MainLayout>
    );
  }

  if (error || !wallpaper) {
    return (
      <MainLayout>
        <Container maxWidth="md" sx={{ mt: 4 }}>
          <Alert severity="error">
            {error ||
              "No se pudo cargar la información del producto. Inténtalo de nuevo más tarde."}
          </Alert>
        </Container>
      </MainLayout>
    );
  }

  const orderItems = [
    {
      name: `FP ${wallpaper.title}`,
      quantity: checkoutData.quantity,
      price: wallpaper.basePrice,
    },
  ];

  return (
    <MainLayout>
      <Container maxWidth="lg" sx={{ my: 4 }}>
        <Typography
          variant="h5"
          component="h1"
          gutterBottom
          sx={{ fontWeight: "bold" }}
        >
          Finalizar compra
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Paper elevation={0} sx={{ p: 2, bgcolor: "#f8f9fa", mb: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box
              sx={{
                width: 20,
                height: 20,
                border: "1px solid #ccc",
                mr: 1,
              }}
            />
            <Typography variant="body2">
              Debe hacer una compra mínima de 10 fondos de pantalla
            </Typography>
          </Box>
        </Paper>

        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <BillingForm
              onSubmit={handleFormSubmit}
              minQuantity={10}
              isValid={updateFormValidity}
              onValuesChange={handleFormValuesChange}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <OrderSummary
              items={orderItems}
              total={checkoutData.totalPrice}
              isFormValid={isFormValid}
              formData={formData}
              onTransactionCreated={handleTransactionCreated}
            />
          </Grid>
        </Grid>
      </Container>

      {/* Notificación para mostrar mensajes de transacción */}
      <Snackbar
        open={notification.show}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        message={notification.message}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </MainLayout>
  );
};

export default CheckoutPage;
