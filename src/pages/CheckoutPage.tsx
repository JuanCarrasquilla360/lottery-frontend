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
  // const [transactionReference, setTransactionReference] = useState<
  //   string | null
  // >(null);
  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error";
  }>({
    show: false,
    message: "",
    type: "success",
  });

  // Obtener datos del wallpaper
  const {
    wallpaper,
    loading: wallpaperLoading,
    error: wallpaperError,
  } = useWallpaper();

  useEffect(() => {
    // Obtener datos del checkout del estado de ubicación
    const state = location.state as LocationState;
    if (state && state.quantity && typeof state.totalPrice !== "undefined") {
      // Validar que los datos sean numéricos
      const quantity = isNaN(state.quantity) ? 1 : state.quantity;
      const totalPrice = isNaN(state.totalPrice) ? 0 : state.totalPrice;

      setCheckoutData({
        quantity,
        totalPrice,
        productId: state.productId || id,
      });
    } else if (wallpaper && id) {
      // Si no hay estado pero tenemos el wallpaper, calcular con cantidad = 1
      setCheckoutData({
        quantity: 1,
        totalPrice: wallpaper.price,
        productId: id,
      });
    } else {
      // Si no hay datos suficientes, redirigir a la página principal
      navigate("/");
    }
  }, [location, navigate, id, wallpaper]);

  const handleFormSubmit = (values: BillingFormValues) => {
    console.log("Form values:", values);
    // En una implementación completa, aquí guardaríamos los datos en el backend
  };

  const handleFormValuesChange = (values: BillingFormValues) => {
    setFormData(values);
  };

  const handleTransactionCreated = (reference: string) => {
    // setTransactionReference(reference);
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

  if (wallpaperLoading || !checkoutData) {
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

  if (wallpaperError || !wallpaper) {
    return (
      <MainLayout>
        <Container maxWidth="md" sx={{ mt: 4 }}>
          <Alert severity="error">
            {wallpaperError ||
              "No se pudo cargar la información del producto. Inténtalo de nuevo más tarde."}
          </Alert>
        </Container>
      </MainLayout>
    );
  }

  // Calcular el subtotal individual y el total correctamente
  const itemPrice = wallpaper.price || 0;
  const quantity = checkoutData.quantity || 0;
  const individualSubtotal = itemPrice * quantity;
  const totalPrice = individualSubtotal;

  // Crear objeto orderItem con los datos del checkout y del wallpaper
  const orderItems = [
    {
      name: `FP ${wallpaper.title}`,
      quantity: quantity,
      price: itemPrice,
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
              Debe hacer una compra mínima de 3 numeros
            </Typography>
          </Box>
        </Paper>

        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <BillingForm
              onSubmit={handleFormSubmit}
              minQuantity={3}
              isValid={updateFormValidity}
              onValuesChange={handleFormValuesChange}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <OrderSummary
              items={orderItems}
              total={totalPrice}
              isFormValid={isFormValid}
              formData={formData}
              onTransactionCreated={handleTransactionCreated}
              productTitle={wallpaper.title} // Pasamos el título del producto al componente OrderSummary
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
