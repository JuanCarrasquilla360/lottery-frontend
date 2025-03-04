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
import { PSE_LOGO, EPAYCO_LOGO } from "../../utils/imageUtils";
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

              {items.map((item, index) => (
                <TableRow key={index}>
                  <TableCell
                    sx={{
                      pl: 0,
                      borderBottom:
                        index === items.length - 1
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
                        index === items.length - 1
                          ? "1px solid #e0e0e0"
                          : "none",
                    }}
                  >
                    ${(item.price * item.quantity).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}

              <TableRow>
                <TableCell sx={{ fontWeight: "bold", pl: 0, pt: 2 }}>
                  Subtotal
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ fontWeight: "bold", pr: 0, pt: 2 }}
                >
                  ${total.toLocaleString()}
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
                  ${total.toLocaleString()}
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

          {/* Tabs de métodos de pago - Para versión simple solo mostramos Wompi */}
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
              amount={total}
              isFormValid={isFormValid}
              formData={formData}
              productName={items[0].name}
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
                src={PSE_LOGO}
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
