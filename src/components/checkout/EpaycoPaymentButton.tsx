// src/components/checkout/EpaycoPaymentButton.tsx
import React, { useState } from "react";
import {
  Button,
  CircularProgress,
  Typography,
  Box,
  ButtonGroup,
  Alert,
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

// Datos demo para el caso en que no haya datos de formulario válidos
const demoBillingData: BillingFormValues = {
  firstName: "Juan",
  lastName: "Pérez",
  identificationNumber: "1098765432",
  address: "Calle 123 #45-67, Barrio Central",
  phone: "3101234567",
  email: "juan.perez@ejemplo.com",
  confirmEmail: "juan.perez@ejemplo.com",
};

const EpaycoPaymentButton: React.FC<EpaycoPaymentButtonProps> = ({
  amount,
  isFormValid,
  formData,
  productName,
  onTransactionCreated,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Definir las URLs de redirección - puedes ajustar estas URLs según tus necesidades
  // Para pruebas locales
  const responseUrl = window.location.origin + "/payment-result"; // localhost:5174/payment-result
  const confirmationUrl = window.location.origin + "/api/payment-confirmation";

  const handlePayment = () => {
    // Si no hay formData o no es válido, mostramos un error más claro
    if (!formData) {
      setError(
        "Por favor complete el formulario primero o use el botón 'Usar datos demo'"
      );
      return;
    }

    if (!isFormValid) {
      setError("Por favor corrija los errores en el formulario para continuar");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Generar referencia única para la transacción
      const reference = generateTransactionReference();

      // Verificamos que el SDK de ePayco esté disponible
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
        description: `Compra de fondos de pantalla: ${productName}`,
        amount: amount,
        tax: 0, // Suponiendo que no hay impuestos
        taxBase: amount, // Base gravable igual al monto si no hay impuestos
        currency: "COP",
        reference: reference,

        // URLs de respuesta
        responseUrl: responseUrl,
        confirmationUrl: confirmationUrl,
      };

      // Callback opcional para notificar que la transacción fue creada
      if (onTransactionCreated) {
        onTransactionCreated(reference);
      }

      console.log(
        "Redirigiendo a ePayco con datos del formulario:",
        paymentData
      );

      // Redirigir al usuario al checkout de ePayco
      // Ahora estamos usando el mismo método que el SDK, pero con los datos del formulario
      redirectToEpaycoCheckout(paymentData);
    } catch (err) {
      console.error("Error al procesar el pago:", err);
      setError(
        typeof err === "object" && err !== null && "message" in err
          ? (err as Error).message
          : "Hubo un error al procesar el pago. Por favor, inténtelo de nuevo."
      );
      setLoading(false);
    }
  };

  // Función para usar el SDK de ePayco con datos demo
  const handleOpenEpaycoCheckout = () => {
    setLoading(true);
    setError(null);

    try {
      // Generar referencia única para la transacción
      const reference = generateTransactionReference();

      // Usamos una combinación de datos del formulario si están disponibles, o datos demo
      const dataToUse = formData || demoBillingData;

      // Verificamos que el SDK de ePayco esté disponible
      if (typeof window.ePayco === "undefined") {
        throw new Error(
          "No se pudo cargar el SDK de ePayco. Intente de nuevo más tarde."
        );
      }

      // Datos para la transacción
      const hardcodedData: EpaycoPaymentData = {
        // Datos del cliente - preferimos datos del formulario si están disponibles
        name: dataToUse.firstName,
        lastName: dataToUse.lastName,
        email: dataToUse.email,
        phone: dataToUse.phone,
        address: dataToUse.address,
        documentId: dataToUse.identificationNumber,

        // Datos de la transacción
        description: `Compra de fondos de pantalla: ${productName}`,
        amount: amount,
        tax: 0,
        taxBase: amount,
        currency: "COP",
        reference: reference,

        // URLs de respuesta
        responseUrl: responseUrl,
        confirmationUrl: confirmationUrl,
      };

      // Callback opcional para notificar que la transacción fue creada
      if (onTransactionCreated) {
        onTransactionCreated(reference);
      }

      console.log("Abriendo ePayco SDK con datos demo:", hardcodedData);

      // Usar el SDK de ePayco para abrir el checkout
      openEpaycoCheckout(hardcodedData);
    } catch (err) {
      console.error("Error al procesar el pago con SDK:", err);
      setError(
        typeof err === "object" && err !== null && "message" in err
          ? (err as Error).message
          : "Hubo un error al iniciar el checkout de ePayco. Por favor, inténtelo de nuevo."
      );
      setLoading(false);
    }
  };

  // Verificamos si el SDK de ePayco está disponible
  const isEpaycoSDKAvailable = typeof window.ePayco !== "undefined";

  return (
    <>
      {!isEpaycoSDKAvailable && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          No se detectó el SDK de ePayco. Asegúrate de que tu conexión a
          internet esté funcionando correctamente.
        </Alert>
      )}

      <ButtonGroup
        variant="contained"
        orientation="vertical"
        fullWidth
        disabled={loading || !isEpaycoSDKAvailable}
        sx={{ mb: 2 }}
      >
        <Button
          color="primary"
          onClick={handlePayment}
          disabled={!isFormValid || loading || !isEpaycoSDKAvailable}
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
            "Pagar con ePayco (Formulario)"
          )}
        </Button>

        <Button
          color="primary"
          onClick={handleOpenEpaycoCheckout}
          disabled={loading || !isEpaycoSDKAvailable}
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
          preestablecidos si no has completado el formulario.
        </Typography>
      </Box>
    </>
  );
};

export default EpaycoPaymentButton;
