// src/components/checkout/EpaycoPaymentButton.tsx
import React, { useState } from "react";
import {
  Button,
  CircularProgress,
  Typography,
  Box,
  ButtonGroup,
} from "@mui/material";
import {
  redirectToEpaycoCheckout,
  generateTransactionReference,
  EpaycoPaymentData,
  openEpaycoCheckout,
} from "../../services/epaycoService";
import { BillingFormValues } from "./BillingForm";

interface EpaycoPaymentButtonProps {
  amount: number;
  isFormValid: boolean;
  formData: BillingFormValues | null;
  productName: string;
  onTransactionCreated?: (reference: string) => void;
}

const EpaycoPaymentButton: React.FC<EpaycoPaymentButtonProps> = ({
  amount,
  isFormValid,
  formData,
  productName,
  onTransactionCreated,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  // Añade estas URLs aquí, después de los estados
  const responseUrl = "http://localhost:5174/payment-result"; // URL donde ePayco te redirigirá después del pago
  const confirmationUrl = "http://localhost:5174/api/payment-confirmation"; // URL para webhook

  const handlePayment = () => {
    if (!formData) {
      setError("Por favor complete el formulario primero");
      return;
    }

    if (!isFormValid) {
      setError("Por favor corrija los errores en el formulario");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Generar referencia única para la transacción
      const reference = generateTransactionReference();

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
        description: `Compra de fondos de pantalla: ${productName}`,
        amount: amount,
        tax: 0, // Suponiendo que no hay impuestos
        taxBase: amount, // Base gravable igual al monto si no hay impuestos
        currency: "COP",
        reference: reference,

        // URLs de respuesta
        responseUrl,
        confirmationUrl,
      };

      // Callback opcional para notificar que la transacción fue creada
      if (onTransactionCreated) {
        onTransactionCreated(reference);
      }

      // Redirigir al usuario al checkout de ePayco
      redirectToEpaycoCheckout(paymentData);
    } catch (err) {
      console.error("Error al procesar el pago:", err);
      setError(
        "Hubo un error al procesar el pago. Por favor, inténtelo de nuevo."
      );
      setLoading(false);
    }
  };

  // Nueva función para usar openEpaycoCheckout con datos quemados
  const handleOpenEpaycoCheckout = () => {
    setLoading(true);
    setError(null);

    try {
      // Generar referencia única para la transacción
      const reference = generateTransactionReference();

      // Datos quemados para pruebas
      const hardcodedData: EpaycoPaymentData = {
        // Datos del cliente
        name: "Juan",
        lastName: "Pérez",
        email: "cliente@ejemplo.com",
        phone: "3001234567",
        address: "Calle 123 # 45-67",
        documentId: "1234567890",

        // Datos de la transacción
        description: `Compra de fondos de pantalla: ${productName}`,
        amount: amount,
        tax: 0,
        taxBase: amount,
        currency: "COP",
        reference: reference,

        // URLs de respuesta
        responseUrl,
        confirmationUrl,
      };

      // Callback opcional para notificar que la transacción fue creada
      if (onTransactionCreated) {
        onTransactionCreated(reference);
      }

      // Usar el SDK de ePayco para abrir el checkout
      openEpaycoCheckout(hardcodedData);
    } catch (err) {
      console.error("Error al procesar el pago con SDK:", err);
      setError(
        "Hubo un error al iniciar el checkout de ePayco. Por favor, inténtelo de nuevo."
      );
      setLoading(false);
    }
  };

  return (
    <>
      <ButtonGroup
        variant="contained"
        orientation="vertical"
        fullWidth
        disabled={loading}
        sx={{ mb: 2 }}
      >
        <Button
          color="primary"
          onClick={handlePayment}
          disabled={!isFormValid || loading}
          sx={{
            bgcolor: "#00A0DF", // Color de ePayco
            "&:hover": {
              bgcolor: "#0086b8",
            },
            py: 1.5,
            borderRadius: "4px 4px 0 0",
            textTransform: "none",
          }}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Pagar con ePayco (Redirección)"
          )}
        </Button>

        <Button
          color="primary"
          onClick={handleOpenEpaycoCheckout}
          sx={{
            bgcolor: "#0086b8", // Color más oscuro para diferenciar
            "&:hover": {
              bgcolor: "#006e99",
            },
            py: 1.5,
            borderRadius: "0 0 4px 4px",
            textTransform: "none",
          }}
        >
          Pagar con ePayco SDK (Datos Demo)
        </Button>
      </ButtonGroup>

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
          Al hacer clic en "Pagar con ePayco", serás redirigido a la pasarela de
          pagos segura de ePayco. La opción SDK utiliza datos de prueba
          preestablecidos.
        </Typography>
      </Box>
    </>
  );
};

export default EpaycoPaymentButton;
