// src/components/checkout/EpaycoPaymentButton.tsx
import React, { useState } from "react";
import {
  Button,
  CircularProgress,
  Typography,
  Box,
  Alert,
} from "@mui/material";
import {
  processEpaycoPayment,
  generateTransactionReference,
  EpaycoPaymentData,
} from "../../services/epaycoService";
import { BillingFormValues } from "./BillingForm";
import axios from "axios";

interface EpaycoPaymentButtonProps {
  amount: number;
  isFormValid: boolean;
  formData: BillingFormValues | null;
  productName: string;
  productTitle: string; // Título del producto desde el backend
  quantity: number;
  onTransactionCreated?: (reference: string) => void;
}

const EpaycoPaymentButton: React.FC<EpaycoPaymentButtonProps> = ({
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

      // Verificar que el SDK de ePayco esté disponible
      if (typeof window.ePayco === "undefined") {
        throw new Error(
          "No se pudo cargar el SDK de ePayco. Intente de nuevo más tarde."
        );
      }

      // Crear el objeto de datos para ePayco
      const paymentData: EpaycoPaymentData = {
        // Datos del cliente
        name: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        documentId: formData.identificationNumber,

        // Datos de la transacción
        description: `Compra de numeros: ${productName}`,
        amount: amount,
        tax: 0,
        taxBase: amount,
        currency: "COP",
        reference: reference,
        productTitle: productTitle, // Título del producto que viene del backend

        // URLs de respuesta
        responseUrl: responseUrl,
        confirmationUrl: confirmationUrl,
      };

      // Notificar que la transacción fue creada
      if (onTransactionCreated) {
        onTransactionCreated(reference);
      }

      // Procesar el pago
      processEpaycoPayment(paymentData);
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

  // Verificar si el SDK de ePayco está disponible
  const isEpaycoSDKAvailable = typeof window.ePayco !== "undefined";

  return (
    <>
      {!isEpaycoSDKAvailable && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          No se detectó el SDK de ePayco. Asegúrate de que tu conexión a
          internet esté funcionando correctamente.
        </Alert>
      )}

      <Button
        variant="contained"
        color="primary"
        fullWidth
        size="large"
        onClick={handlePayment}
        disabled={!isFormValid || loading || !isEpaycoSDKAvailable}
        sx={{
          bgcolor: "#00A0DF",
          "&:hover": {
            bgcolor: "#0086b8",
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
          pagos segura de ePayco para completar tu compra.
        </Typography>
      </Box>
    </>
  );
};

export default EpaycoPaymentButton;
