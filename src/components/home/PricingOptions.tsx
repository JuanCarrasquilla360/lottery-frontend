// src/components/home/PricingOptions.tsx
import React from "react";
import { Box, Typography, Grid, Button, Container } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useNavigate } from "react-router-dom";

interface PricingOptionsProps {
  basePrice: number;
  productId: string; // Necesitamos el ID del producto para la redirección
  onSelectPackage?: (quantity: number) => void; // Opcional, por compatibilidad
}

const PricingOptions: React.FC<PricingOptionsProps> = ({
  basePrice,
  productId,
  onSelectPackage,
}) => {
  const navigate = useNavigate();

  // Crear paquetes dinámicamente basados en el precio base
  const packages = [
    { quantity: 10, price: basePrice * 10 },
    { quantity: 20, price: basePrice * 20 },
    { quantity: 30, price: basePrice * 30 },
    { quantity: 40, price: basePrice * 40 },
    { quantity: 50, price: basePrice * 50 },
  ];

  // Función para manejar la selección de un paquete
  const handlePackageSelection = (quantity: number, totalPrice: number) => {
    // Si hay un callback onSelectPackage, lo llamamos para mantener compatibilidad
    if (onSelectPackage) {
      onSelectPackage(quantity);
    }

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
                {pkg.quantity} Números ${pkg.price.toLocaleString()} COP
              </Button>
            </Grid>
          ))}
        </Grid>

        <Typography
          variant="h5"
          align="center"
          sx={{
            mt: 5,
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
