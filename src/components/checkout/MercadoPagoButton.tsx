import React, { useState, useEffect } from "react";
import {
  Button,
  CircularProgress,
  Typography,
  Box,
  Alert,
} from "@mui/material";
import {
  processMercadoPagoPayment,
  generateTransactionReference,
  MercadoPagoPaymentData,
} from "../../services/mercadoPagoService";
import { BillingFormValues } from "./BillingForm";
import axios from "axios";

interface MercadoPagoButtonProps {
  amount: number;
  isFormValid: boolean;
  formData: BillingFormValues | null;
  productName: string;
  productTitle: string;
  quantity: number;
  onTransactionCreated?: (reference: string) => void;
}

const MercadoPagoButton: React.FC<MercadoPagoButtonProps> = ({
  amount,
  isFormValid,
  formData,
  productName,
  productTitle,
  quantity,
  onTransactionCreated,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isMercadoPagoReady, setIsMercadoPagoReady] = useState<boolean>(false);

  // Verificar si el SDK de Mercado Pago está disponible
  useEffect(() => {
    const checkMercadoPagoSDK = () => {
      if (typeof window.MercadoPago !== "undefined") {
        setIsMercadoPagoReady(true);
      } else {
        setIsMercadoPagoReady(false);
      }
    };

    checkMercadoPagoSDK();
    
    // Verificar periódicamente (por si se carga después)
    const interval = setInterval(checkMercadoPagoSDK, 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Definir las URLs de redirección para producción
  const responseUrl = window.location.origin + "/payment-result";
  const confirmationUrl = window.location.origin + "/api/payment-confirmation";

  const handlePayment = async () => {
    // Validaciones
    if (!formData) {
      setError("Por favor complete el formulario para continuar");
      return;
    }

    if (!isFormValid) {
      setError("Por favor corrija los errores en el formulario para continuar");
      return;
    }

    const response = await axios.get<{ available_stock: boolean }>(
      `https://rotd20rcv9.execute-api.us-east-2.amazonaws.com/prod/lottery/status?quantity=${quantity}`
    );

    if (!response.data.available_stock) {
      setError("No hay suficiente stock para realizar la compra");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Generar referencia única para la transacción
      const reference = generateTransactionReference();

      // Verificar que el SDK de Mercado Pago esté disponible
      if (typeof window.MercadoPago === "undefined") {
        throw new Error(
          "No se pudo cargar el SDK de Mercado Pago. Intente de nuevo más tarde."
        );
      }

      // Crear el objeto de datos para Mercado Pago
      const paymentData: MercadoPagoPaymentData = {
        // Datos del cliente
        name: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        documentId: formData.identificationNumber,

        // Datos de la transacción
        description: `Compra de diseños: ${productName}`,
        amount: amount,
        tax: 0,
        taxBase: amount,
        currency: "COP",
        reference: reference,
        productTitle: productTitle,

        // URLs de respuesta
        responseUrl: responseUrl,
        confirmationUrl: confirmationUrl,
      };

      // Notificar que la transacción fue creada
      if (onTransactionCreated) {
        onTransactionCreated(reference);
      }

      // Procesar el pago
      processMercadoPagoPayment(paymentData);
    } catch (err) {
      console.error("Error al procesar el pago:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Hubo un error al procesar el pago. Por favor, inténtelo de nuevo."
      );
      setLoading(false);
    }
  };

  return (
    <>
      {!isMercadoPagoReady && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          No se detectó el SDK de Mercado Pago. Asegúrate de que tu conexión a
          internet esté funcionando correctamente.
        </Alert>
      )}

      <Box className="mercadopago-button-container" sx={{ mb: 2 }}></Box>

      <Button
        variant="contained"
        color="primary"
        fullWidth
        size="large"
        onClick={handlePayment}
        disabled={!isFormValid || loading || !isMercadoPagoReady}
        sx={{
          bgcolor: "#009ee3",
          "&:hover": {
            bgcolor: "#007eb5",
          },
          py: 1.5,
          borderRadius: 1,
          textTransform: "none",
          mb: 2,
        }}
      >
        {loading ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          "Realizar el pago"
        )}
      </Button>

      {error && (
        <Typography
          variant="body2"
          color="error"
          sx={{ mt: 1, textAlign: "center" }}
        >
          {error}
        </Typography>
      )}

      <Box sx={{ mt: 2, textAlign: "center" }}>
        <Typography variant="caption" color="text.secondary">
          Al hacer clic en "Realizar el pago", serás redirigido a la pasarela de
          pagos segura de Mercado Pago para completar tu compra.
        </Typography>
      </Box>
    </>
  );
};

export default MercadoPagoButton; 