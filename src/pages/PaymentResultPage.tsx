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



const PaymentResultPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [transactionData, setTransactionData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processPaymentResult = async () => {
      try {
        setLoading(true);

        // Extraer todos los parámetros de la URL
        const params: Record<string, string> = {};
        searchParams.forEach((value, key) => {
          params[key] = value;
        });

        // Verificar si hay parámetros mínimos necesarios
        if (!params.payment_id && !params.collection_id) {
          setError("No se encontró información válida de la transacción");
          setLoading(false);
          return;
        }

        // ID del pago para verificar
        const paymentId = params.payment_id || params.collection_id;
        
        // Usar directamente los datos de la URL
        const transactionData = {
          id: paymentId,
          status: params.status || params.collection_status || "",
          status_detail: params.status_detail || params.status || "",
          payment_method_id: params.payment_type || "",
          payment_type_id: params.payment_type || "",
          external_reference: params.external_reference === "null" ? "" : (params.external_reference || ""),
          preference_id: params.preference_id || "",
          merchant_order_id: params.merchant_order_id || "",
          transaction_amount: params.transaction_amount ? parseFloat(params.transaction_amount) : 0,
          currency_id: params.currency_id || "COP",
          site_id: params.site_id || "",
          processing_mode: params.processing_mode || "",
          date_created: new Date().toISOString(),
          date_approved: params.status === "approved" ? new Date().toISOString() : null,
        };
        
        setTransactionData(transactionData);
      } catch (err: any) {
        console.error("Error al procesar los datos de pago:", err);
        setError(`Hubo un error al procesar los parámetros de la transacción: ${err.message || "Error desconocido"}`);
      } finally {
        setLoading(false);
      }
    };

    processPaymentResult();
  }, [searchParams]);

  // Mapear el estado del pago a un formato amigable
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

    // Mapeo de estados según MercadoPago
    const mercadoPagoStatus = transactionData.status || "";

    if (mercadoPagoStatus.toLowerCase() === "approved") {
      return { status: "APPROVED", label: "Aprobado", color: "success.main" };
    } else if (
      mercadoPagoStatus.toLowerCase() === "pending" ||
      mercadoPagoStatus.toLowerCase() === "in_process" ||
      mercadoPagoStatus.toLowerCase() === "in_mediation"
    ) {
      return { status: "PENDING", label: "Pendiente", color: "warning.main" };
    } else if (
      mercadoPagoStatus.toLowerCase() === "rejected" ||
      mercadoPagoStatus.toLowerCase() === "cancelled" ||
      mercadoPagoStatus.toLowerCase() === "refunded" ||
      mercadoPagoStatus.toLowerCase() === "charged_back"
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

  // Mostrador de carga
  if (loading) {
    return (
      <MainLayout>
        <Container maxWidth="md" sx={{ my: 8, textAlign: "center" }}>
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ mt: 3 }}>
            Procesando información de pago...
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
                  {searchParams.get("payment_id") || searchParams.get("collection_id") || ""}
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
                        {transactionData.external_reference && (
                          <TableRow>
                            <TableCell sx={{ fontWeight: "bold" }}>
                              Referencia:
                            </TableCell>
                            <TableCell>{transactionData.external_reference}</TableCell>
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
                                : transactionData.payment_method_id === "account_money"
                                ? "Dinero en cuenta"
                                : transactionData.payment_method_id}
                            </TableCell>
                          </TableRow>
                        )}
                        {transactionData.site_id && (
                          <TableRow>
                            <TableCell sx={{ fontWeight: "bold" }}>
                              Site ID:
                            </TableCell>
                            <TableCell>{transactionData.site_id}</TableCell>
                          </TableRow>
                        )}
                        {/* Mostrar información del pagador si está disponible */}
                        {transactionData.payer && transactionData.payer.email && (
                          <TableRow>
                            <TableCell sx={{ fontWeight: "bold" }}>
                              Email del pagador:
                            </TableCell>
                            <TableCell>{transactionData.payer.email}</TableCell>
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
                        {transactionData.date_approved && (
                          <TableRow>
                            <TableCell sx={{ fontWeight: "bold" }}>
                              Fecha de aprobación:
                            </TableCell>
                            <TableCell>
                              {new Date(
                                transactionData.date_approved
                              ).toLocaleString()}
                            </TableCell>
                          </TableRow>
                        )}
                        {transactionData.merchant_order_id && (
                          <TableRow>
                            <TableCell sx={{ fontWeight: "bold" }}>
                              ID de Orden:
                            </TableCell>
                            <TableCell>{transactionData.merchant_order_id}</TableCell>
                          </TableRow>
                        )}
                        {transactionData.preference_id && (
                          <TableRow>
                            <TableCell sx={{ fontWeight: "bold" }}>
                              ID de Preferencia:
                            </TableCell>
                            <TableCell>{transactionData.preference_id}</TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  
                  {/* Mostrar información de productos si está disponible */}
                  {transactionData.additional_info?.items && transactionData.additional_info.items.length > 0 && (
                    <Box sx={{ mt: 3 }}>
                      <Typography variant="h6" gutterBottom>
                        Productos comprados
                      </Typography>
                      <TableContainer>
                        <Table>
                          <TableBody>
                            {transactionData.additional_info.items.map((item: any, index: number) => (
                              <TableRow key={index}>
                                <TableCell sx={{ fontWeight: "bold" }}>
                                  {item.title || "Producto"}:
                                </TableCell>
                                <TableCell>
                                  {item.quantity || 1} x ${item.unit_price?.toLocaleString() || "0"} COP
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Box>
                  )}
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
