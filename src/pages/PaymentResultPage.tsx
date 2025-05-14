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
  Chip,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import MainLayout from "../components/layout/MainLayout";
import axios from "axios";

// Interfaz para los datos de respuesta de Mercado Pago
interface MercadoPagoResponse {
  collection_id: string;
  collection_status: string;
  payment_id: string;
  status: string;
  external_reference: string;
  payment_type: string;
  merchant_order_id: string;
  preference_id: string;
  site_id: string;
  processing_mode: string;
  merchant_account_id: string | null;
}

// Interfaz para la respuesta de la API de MercadoPago
interface PaymentDetails {
  id: number;
  date_created: string;
  date_approved: string | null;
  date_last_updated: string;
  money_release_date: string | null;
  payment_method_id: string;
  payment_type_id: string;
  status: string;
  status_detail: string;
  currency_id: string;
  description: string;
  transaction_amount: number;
  external_reference: string;
  installments: number;
  payer: {
    email: string;
    identification: {
      type: string;
      number: string;
    };
  };
  additional_info?: {
    items: Array<{
      id: string;
      title: string;
      quantity: number;
      unit_price: number;
    }>;
  };
  fee_details?: Array<{
    type: string;
    amount: number;
  }>;
}

const PaymentResultPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [transactionData, setTransactionData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<string>("pending"); // pending, success, failed

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
        
        try {
          // Llamada a nuestro backend para verificar el pago con MercadoPago
          setVerificationStatus("pending");
          const response = await axios.get<PaymentDetails>(
            `https://jh3o2lnbjg.execute-api.us-east-1.amazonaws.com/dev/tinta/payment-status/${paymentId}`
          );
          
          if (response.data) {
            setTransactionData(response.data);
            setVerificationStatus("success");
          } else {
            throw new Error("No se recibió información del pago");
          }
        } catch (apiError: any) {
          console.error("Error al verificar el pago con MercadoPago:", apiError);
          setVerificationStatus("failed");
          
          // Si falla la verificación con la API, usamos los datos de la URL como respaldo
          const fallbackData = {
            id: paymentId,
            status: params.status || params.collection_status || "",
            status_detail: params.status_detail || params.status || "",
            payment_method_id: params.payment_type || "",
            payment_type_id: params.payment_type || "",
            external_reference: params.external_reference === "null" ? "" : (params.external_reference || ""),
            preference_id: params.preference_id || "",
            merchant_order_id: params.merchant_order_id || "",
            transaction_amount: 0,
            currency_id: "COP",
            date_created: new Date().toISOString(),
            date_approved: params.status === "approved" ? new Date().toISOString() : null,
          };
          
          setTransactionData(fallbackData);
          
          // Solo mostramos este error si no pudimos obtener ni siquiera los datos básicos
          if (Object.keys(fallbackData).length === 0) {
            setError(`No se pudo verificar el estado del pago: ${apiError.message || "Error desconocido"}`);
          }
        }
      } catch (err: any) {
        console.error("Error al procesar los datos de pago:", err);
        setError(`Hubo un error al verificar el estado de la transacción: ${err.message || "Error desconocido"}`);
        setVerificationStatus("failed");
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

  // Obtener descripción detallada del estado del pago
  const getStatusDetailDescription = (statusDetail: string): string => {
    const statusMap: {[key: string]: string} = {
      // Estados de aprobación
      "accredited": "El pago ha sido aprobado y acreditado.",
      "pending_contingency": "El pago está siendo procesado.",
      "pending_review_manual": "El pago está en revisión manual.",
      
      // Estados de rechazo 
      "cc_rejected_bad_filled_card_number": "Revise el número de tarjeta.",
      "cc_rejected_bad_filled_date": "Revise la fecha de vencimiento.",
      "cc_rejected_bad_filled_other": "Revise los datos ingresados.",
      "cc_rejected_bad_filled_security_code": "Revise el código de seguridad.",
      "cc_rejected_blacklist": "No pudimos procesar su pago.",
      "cc_rejected_call_for_authorize": "Debe autorizar el pago con su banco.",
      "cc_rejected_card_disabled": "Llame a su banco para activar su tarjeta.",
      "cc_rejected_duplicated_payment": "Ya realizó un pago por ese valor.",
      "cc_rejected_high_risk": "Su pago fue rechazado.",
      "cc_rejected_insufficient_amount": "Fondos insuficientes.",
      "cc_rejected_invalid_installments": "Número de cuotas no válido.",
      "cc_rejected_max_attempts": "Llegó al límite de intentos permitidos.",
      "cc_rejected_other_reason": "Su banco no procesó el pago.",
    };

    return statusMap[statusDetail.toLowerCase()] || statusDetail;
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
            
            {verificationStatus !== "success" && (
              <Box sx={{ mt: 2 }}>
                <Chip 
                  label="Información no verificada con MercadoPago" 
                  color="warning" 
                  size="small" 
                  variant="outlined" 
                />
              </Box>
            )}
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
                            Monto:
                          </TableCell>
                          <TableCell>
                            ${transactionData.transaction_amount?.toLocaleString() || "0"}{" "}
                            {transactionData.currency_id || "COP"}
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
                        {transactionData.status_detail && (
                          <TableRow>
                            <TableCell sx={{ fontWeight: "bold" }}>
                              Detalle:
                            </TableCell>
                            <TableCell>
                              {getStatusDetailDescription(transactionData.status_detail)}
                            </TableCell>
                          </TableRow>
                        )}
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
