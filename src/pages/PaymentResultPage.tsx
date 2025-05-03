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

// Interfaz para los datos de respuesta de Mercado Pago
interface MercadoPagoResponse {
  status: string;
  status_detail: string;
  id: string;
  date_created: string;
  date_approved: string;
  payment_method_id: string;
  payment_type_id: string;
  external_reference: string;
  transaction_amount: number;
  currency_id: string;
}

const PaymentResultPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [transactionData, setTransactionData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Obtener el payment_id de la URL (parámetro principal que devuelve Mercado Pago)
  const paymentId = searchParams.get("payment_id") || "";
  const status = searchParams.get("status") || "";
  const externalReference = searchParams.get("external_reference") || "";

  useEffect(() => {
    const fetchTransactionInfo = async () => {
      if (!paymentId && !status) {
        setError("No se encontró información de la transacción");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // En un entorno real, esta solicitud debería hacerse desde el backend
        // Aquí se muestra un ejemplo simplificado utilizando los parámetros de la URL
        // En producción, deberías implementar una llamada a tu backend que consulte la API de Mercado Pago
        
        // Simulamos la respuesta con los datos de la URL
        const paymentData = {
          status: status,
          status_detail: status === "approved" ? "accredited" : status === "pending" ? "pending_contingency" : "cc_rejected_other_reason",
          id: paymentId,
          date_created: new Date().toISOString(),
          date_approved: status === "approved" ? new Date().toISOString() : null,
          payment_method_id: "credit_card",
          payment_type_id: "credit_card",
          external_reference: externalReference,
          transaction_amount: 0, // En producción, este valor se obtendría de la API
          currency_id: "COP"
        };

        setTransactionData(paymentData);
      } catch (err) {
        console.error("Error al consultar el estado de la transacción:", err);
        setError("Hubo un error al verificar el estado de la transacción");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactionInfo();
  }, [paymentId, status, externalReference]);

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

    // Mapeo de estados según Mercado Pago
    const mercadoPagoStatus = transactionData.status || "";

    if (mercadoPagoStatus.toLowerCase() === "approved") {
      return { status: "APPROVED", label: "Aprobado", color: "success.main" };
    } else if (
      mercadoPagoStatus.toLowerCase() === "pending" ||
      mercadoPagoStatus.toLowerCase() === "in_process"
    ) {
      return { status: "PENDING", label: "Pendiente", color: "warning.main" };
    } else if (
      mercadoPagoStatus.toLowerCase() === "rejected" ||
      mercadoPagoStatus.toLowerCase() === "cancelled"
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
                  No se encontró información de la transacción con ID:{" "}
                  {paymentId}
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
                            ID de Pago:
                          </TableCell>
                          <TableCell>{transactionData.id}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell sx={{ fontWeight: "bold" }}>
                            Referencia:
                          </TableCell>
                          <TableCell>{transactionData.external_reference}</TableCell>
                        </TableRow>
                        {transactionData.transaction_amount > 0 && (
                          <TableRow>
                            <TableCell sx={{ fontWeight: "bold" }}>
                              Monto:
                            </TableCell>
                            <TableCell>
                              $
                              {transactionData.transaction_amount.toLocaleString()}{" "}
                              {transactionData.currency_id}
                            </TableCell>
                          </TableRow>
                        )}
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
                        {transactionData.payment_method_id && (
                          <TableRow>
                            <TableCell sx={{ fontWeight: "bold" }}>
                              Método de pago:
                            </TableCell>
                            <TableCell>
                              {transactionData.payment_method_id === "credit_card"
                                ? "Tarjeta de crédito"
                                : transactionData.payment_method_id === "debit_card"
                                ? "Tarjeta de débito"
                                : transactionData.payment_method_id === "bank_transfer"
                                ? "Transferencia bancaria"
                                : transactionData.payment_method_id}
                            </TableCell>
                          </TableRow>
                        )}
                        {transactionData.date_created && (
                          <TableRow>
                            <TableCell sx={{ fontWeight: "bold" }}>
                              Fecha:
                            </TableCell>
                            <TableCell>
                              {new Date(
                                transactionData.date_created
                              ).toLocaleString()}
                            </TableCell>
                          </TableRow>
                        )}
                        {transactionData.status_detail && (
                          <TableRow>
                            <TableCell sx={{ fontWeight: "bold" }}>
                              Detalle:
                            </TableCell>
                            <TableCell>{transactionData.status_detail}</TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              )}
            </>
          )}

          <Divider sx={{ my: 3 }} />

          <Box sx={{ textAlign: "center" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleGoHome}
              sx={{ px: 4, py: 1 }}
            >
              Volver al inicio
            </Button>
          </Box>
        </Paper>
      </Container>
    </MainLayout>
  );
};

export default PaymentResultPage;
