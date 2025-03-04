// src/pages/PaymentResultPage.tsx
import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  CircularProgress,
  Alert,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import MainLayout from "../components/layout/MainLayout";
import axios from "axios";

// Interfaz para los datos de respuesta de ePayco
interface EpaycoResponse {
  success: boolean;
  data?: {
    x_ref_payco: string;
    x_id_invoice: string;
    x_description: string;
    x_amount: string;
    x_currency_code: string;
    x_response: string;
    x_response_reason_text: string;
    x_transaction_id: string;
    x_date: string;
    x_transaction_date: string;
    x_amount_ok: string;
    x_errorcode: string;
    x_franchise: string;
    x_transaction_state: string;
    x_customer_email: string;
    x_customer_name: string;
    x_customer_lastname: string;
  };
  message?: string;
}

const PaymentResultPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [transactionData, setTransactionData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Obtener el ref_payco de la URL (parámetro principal que devuelve ePayco)
  const refPayco = searchParams.get("ref_payco") || "";

  useEffect(() => {
    const fetchTransactionInfo = async () => {
      if (!refPayco) {
        setError("No se encontró la referencia de la transacción (ref_payco)");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Consultar a la API de ePayco para obtener la información de la transacción
        // Nota: En producción, esta consulta debería hacerse desde el backend por seguridad
        const response = await axios.get<EpaycoResponse>(
          `https://secure.epayco.co/validation/v1/reference/${refPayco}`
        );

        if (response.data && response.data.success && response.data.data) {
          setTransactionData(response.data.data);
        } else {
          setError("No se pudo obtener información sobre la transacción");
        }
      } catch (err) {
        console.error("Error al consultar el estado de la transacción:", err);
        setError("Hubo un error al verificar el estado de la transacción");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactionInfo();
  }, [refPayco]);

  const getTransactionStatus = (): {
    status: string;
    label: string;
    color: string;
  } => {
    if (!transactionData) {
      return {
        status: "UNKNOWN",
        label: "Desconocido",
        color: "text.secondary",
      };
    }

    // Mapeo de estados según la documentación de ePayco
    const response = transactionData.x_response || "";
    const transactionState = transactionData.x_transaction_state || "";

    if (
      response.toLowerCase() === "approved" ||
      transactionState.toLowerCase() === "aceptada"
    ) {
      return { status: "APPROVED", label: "Aprobado", color: "success.main" };
    } else if (
      response.toLowerCase() === "pending" ||
      transactionState.toLowerCase() === "pendiente"
    ) {
      return { status: "PENDING", label: "Pendiente", color: "warning.main" };
    } else if (
      response.toLowerCase() === "rejected" ||
      transactionState.toLowerCase() === "rechazada" ||
      transactionState.toLowerCase() === "fallida" ||
      transactionState.toLowerCase() === "cancelada"
    ) {
      return { status: "REJECTED", label: "Rechazado", color: "error.main" };
    } else {
      return {
        status: "UNKNOWN",
        label: "Desconocido",
        color: "text.secondary",
      };
    }
  };

  const handleGoHome = () => {
    navigate("/");
  };

  if (loading) {
    return (
      <MainLayout>
        <Container maxWidth="md" sx={{ my: 8, textAlign: "center" }}>
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ mt: 3 }}>
            Verificando el estado de tu pago...
          </Typography>
        </Container>
      </MainLayout>
    );
  }

  const transactionStatus = getTransactionStatus();

  return (
    <MainLayout>
      <Container maxWidth="md" sx={{ my: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Box sx={{ textAlign: "center", mb: 4 }}>
            {transactionStatus.status === "APPROVED" ? (
              <CheckCircleOutlineIcon color="success" sx={{ fontSize: 80 }} />
            ) : transactionStatus.status === "PENDING" ? (
              <HourglassEmptyIcon color="warning" sx={{ fontSize: 80 }} />
            ) : (
              <ErrorOutlineIcon color="error" sx={{ fontSize: 80 }} />
            )}

            <Typography variant="h4" sx={{ mt: 2 }}>
              {transactionStatus.status === "APPROVED"
                ? "¡Pago completado con éxito!"
                : transactionStatus.status === "PENDING"
                ? "Pago en procesamiento"
                : "No se completó el pago"}
            </Typography>

            <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
              {transactionStatus.status === "APPROVED"
                ? "Tu transacción ha sido procesada correctamente."
                : transactionStatus.status === "PENDING"
                ? "Tu pago está siendo procesado. Te notificaremos cuando se complete."
                : "Hubo un problema al procesar tu pago. Por favor, intenta nuevamente."}
            </Typography>
          </Box>

          <Divider sx={{ my: 3 }} />

          {error ? (
            <Alert severity="error" sx={{ my: 3 }}>
              {error}
            </Alert>
          ) : (
            <>
              {!transactionData ? (
                <Alert severity="warning" sx={{ my: 3 }}>
                  No se encontró información de la transacción con referencia:{" "}
                  {refPayco}
                </Alert>
              ) : (
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" gutterBottom>
                    Detalles de la transacción
                  </Typography>

                  <TableContainer>
                    <Table>
                      <TableBody>
                        <TableRow>
                          <TableCell sx={{ fontWeight: "bold" }}>
                            Referencia ePayco:
                          </TableCell>
                          <TableCell>{transactionData.x_ref_payco}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell sx={{ fontWeight: "bold" }}>
                            Factura:
                          </TableCell>
                          <TableCell>{transactionData.x_id_invoice}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell sx={{ fontWeight: "bold" }}>
                            Descripción:
                          </TableCell>
                          <TableCell>{transactionData.x_description}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell sx={{ fontWeight: "bold" }}>
                            Monto:
                          </TableCell>
                          <TableCell>
                            $
                            {parseFloat(
                              transactionData.x_amount || "0"
                            ).toLocaleString()}{" "}
                            {transactionData.x_currency_code}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell sx={{ fontWeight: "bold" }}>
                            Estado:
                          </TableCell>
                          <TableCell
                            sx={{
                              color: transactionStatus.color,
                              fontWeight: "bold",
                            }}
                          >
                            {transactionStatus.label}
                          </TableCell>
                        </TableRow>
                        {transactionData.x_transaction_id && (
                          <TableRow>
                            <TableCell sx={{ fontWeight: "bold" }}>
                              ID Transacción:
                            </TableCell>
                            <TableCell>
                              {transactionData.x_transaction_id}
                            </TableCell>
                          </TableRow>
                        )}
                        {transactionData.x_franchise && (
                          <TableRow>
                            <TableCell sx={{ fontWeight: "bold" }}>
                              Método de pago:
                            </TableCell>
                            <TableCell>{transactionData.x_franchise}</TableCell>
                          </TableRow>
                        )}
                        {transactionData.x_transaction_date && (
                          <TableRow>
                            <TableCell sx={{ fontWeight: "bold" }}>
                              Fecha:
                            </TableCell>
                            <TableCell>
                              {transactionData.x_transaction_date}
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              )}
            </>
          )}

          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handleGoHome}
              sx={{ px: 4 }}
            >
              Volver a la tienda
            </Button>
          </Box>
        </Paper>
      </Container>
    </MainLayout>
  );
};

export default PaymentResultPage;
