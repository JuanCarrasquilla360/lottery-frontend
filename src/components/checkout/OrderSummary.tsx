// src/components/checkout/OrderSummary.tsx
import React from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Divider,
} from "@mui/material";
import { EPAYCO_LOGO } from "../../utils/imageUtils";
import EpaycoPaymentButton from "./EpaycoPaymentButton";
import { BillingFormValues } from "./BillingForm";

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface OrderSummaryProps {
  items: OrderItem[];
  total: number;
  isFormValid: boolean;
  formData: BillingFormValues | null;
  onTransactionCreated?: (reference: string) => void;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  items,
  total,
  isFormValid,
  formData,
  onTransactionCreated,
}) => {
  // Verificar que los valores son numéricos válidos para evitar NaN
  const safeTotal = isNaN(total) ? 0 : total;

  // Crear copias seguras de los items con valores válidos
  const safeItems = items.map((item) => ({
    ...item,
    quantity: isNaN(item.quantity) ? 0 : item.quantity,
    price: isNaN(item.price) ? 0 : item.price,
  }));

  // Debug para ver qué está llegando
  console.log("Items en OrderSummary:", items);

  return (
    <Box sx={{ mt: 3 }}>
      <Paper elevation={0} sx={{ p: 3, border: "1px solid #e0e0e0" }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
          Tu pedido
        </Typography>

        <TableContainer>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell
                  sx={{ fontWeight: "bold", pl: 0, borderBottom: "none" }}
                >
                  Producto
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ fontWeight: "bold", pr: 0, borderBottom: "none" }}
                >
                  Subtotal
                </TableCell>
              </TableRow>

              {safeItems.map((item, index) => {
                // Calcular el subtotal del ítem de forma segura
                const itemSubtotal = item.price * item.quantity;

                return (
                  <TableRow key={index}>
                    <TableCell
                      sx={{
                        pl: 0,
                        borderBottom:
                          index === safeItems.length - 1
                            ? "1px solid #e0e0e0"
                            : "none",
                      }}
                    >
                      {item.name} × {item.quantity}
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        pr: 0,
                        borderBottom:
                          index === safeItems.length - 1
                            ? "1px solid #e0e0e0"
                            : "none",
                      }}
                    >
                      ${itemSubtotal.toLocaleString()}
                    </TableCell>
                  </TableRow>
                );
              })}

              <TableRow>
                <TableCell sx={{ fontWeight: "bold", pl: 0, pt: 2 }}>
                  Subtotal
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ fontWeight: "bold", pr: 0, pt: 2 }}
                >
                  ${safeTotal.toLocaleString()}
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell
                  sx={{ fontWeight: "bold", pl: 0, borderBottom: "none" }}
                >
                  Total
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    fontWeight: "bold",
                    pr: 0,
                    borderBottom: "none",
                    color: "#007bff",
                  }}
                >
                  ${safeTotal.toLocaleString()}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <Divider sx={{ my: 3 }} />

        {/* Sección de métodos de pago */}
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Elige tu método de pago:
          </Typography>

          <Box sx={{ mt: 3 }}>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Pago seguro con ePayco:
            </Typography>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                mb: 3,
                justifyContent: "center",
              }}
            >
              <Box
                component="img"
                src={EPAYCO_LOGO}
                alt="ePayco"
                sx={{ height: 50 }}
              />
            </Box>

            <EpaycoPaymentButton
              amount={safeTotal}
              isFormValid={isFormValid}
              formData={formData}
              productName={
                safeItems.length > 0 ? safeItems[0].name : "Fondo de Pantalla"
              }
              onTransactionCreated={onTransactionCreated}
            />
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* PSE como alternativa */}
          <Box sx={{ mt: 3, opacity: 0.6 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Typography variant="body2">O paga con PSE</Typography>
              <Box
                component="img"
                src={EPAYCO_LOGO}
                alt="PSE"
                sx={{ height: 40, ml: 2 }}
              />
            </Box>

            <Typography
              variant="body2"
              sx={{ mt: 2, color: "text.secondary", fontSize: "0.9rem" }}
            >
              Debe hacer una compra mínima de 10 fondos de pantalla
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default OrderSummary;
