// src/components/home/PricingOptions.tsx
import React from "react";
import { Box, Typography, Grid, Button, Container } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useNavigate } from "react-router-dom";

interface PricingOptionsProps {
  basePrice: number;
  productId: string;
  minQuantity?: number; // Mínimo de unidades permitido
}

const PricingOptions: React.FC<PricingOptionsProps> = ({
  basePrice,
  productId,
  minQuantity = 5, // Por defecto, mínimo de 5 unidades
}) => {
  const navigate = useNavigate();

  // Crear paquetes dinámicamente basados en el precio base
  // Asegurándonos de que ningún paquete tenga menos del mínimo requerido
  const packages = [
    {
      quantity: Math.max(10, minQuantity),
      price: basePrice * Math.max(10, minQuantity),
    },
    {
      quantity: Math.max(20, minQuantity),
      price: basePrice * Math.max(20, minQuantity),
    },
    {
      quantity: Math.max(30, minQuantity),
      price: basePrice * Math.max(30, minQuantity),
    },
    {
      quantity: Math.max(40, minQuantity),
      price: basePrice * Math.max(40, minQuantity),
    },
    {
      quantity: Math.max(50, minQuantity),
      price: basePrice * Math.max(50, minQuantity),
    },
  ];

  // Función para manejar la selección de un paquete
  const handlePackageSelection = (quantity: number, totalPrice: number) => {
    // Redireccionar al checkout con los datos necesarios
    navigate(`/checkout/${productId}`, {
      state: {
        quantity: quantity,
        totalPrice: totalPrice,
        productId: productId,
      },
    });
  };

  return (
    <Box sx={{ bgcolor: "#FF5722", py: 5, color: "white" }}>
      <Container maxWidth="md">
        <Typography variant="subtitle1" align="center" gutterBottom>
          VALOR
        </Typography>

        <Typography
          variant="h3"
          component="div"
          align="center"
          sx={{
            fontWeight: "bold",
            mb: 2,
          }}
        >
          ${basePrice.toLocaleString()}
        </Typography>

        <Typography
          variant="h4"
          align="center"
          sx={{
            mb: 4,
            fontWeight: "bold",
          }}
        >
          ADQUIERELOS
        </Typography>

        <Grid container spacing={2} justifyContent="center">
          {packages.map((pkg, index) => (
            <Grid item key={index}>
              <Button
                variant="contained"
                sx={{
                  bgcolor: "rgba(0, 0, 0, 0.25)",
                  "&:hover": {
                    bgcolor: "rgba(0, 0, 0, 0.4)",
                  },
                  color: "white",
                  borderRadius: 1,
                  px: 2,
                  py: 1,
                  textTransform: "none",
                }}
                onClick={() => handlePackageSelection(pkg.quantity, pkg.price)}
              >
                <ShoppingCartIcon sx={{ mr: 1, fontSize: 18 }} />
                {pkg.quantity} numeros ${pkg.price.toLocaleString()} COP
              </Button>
            </Grid>
          ))}
        </Grid>

        <Typography
          variant="body2"
          align="center"
          sx={{
            mt: 3,
            mb: 1,
          }}
        >
          Mínimo de compra: {minQuantity} numeros
        </Typography>

        <Typography
          variant="h5"
          align="center"
          sx={{
            mt: 2,
            mb: 3,
            fontWeight: "medium",
          }}
        >
          ELIGE LA CANTIDAD QUE DESEES
        </Typography>
      </Container>
    </Box>
  );
};

export default PricingOptions;
