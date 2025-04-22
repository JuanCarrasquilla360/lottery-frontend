// src/components/home/QuantitySelector.tsx
import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Container,
  Typography,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useNavigate } from "react-router-dom";

interface QuantitySelectorProps {
  productId: string;
  basePrice: number;
  minQuantity?: number; // Mínimo de unidades permitido
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  productId,
  basePrice,
  minQuantity = 4, // Por defecto, mínimo de 5 unidades
}) => {
  // Iniciamos con el mínimo de unidades
  const [quantity, setQuantity] = useState<number>(minQuantity);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value);

    if (isNaN(value)) {
      // Si no es un número, establecemos el mínimo
      setQuantity(minQuantity);
      setError(null);
    } else if (value < minQuantity) {
      // Si es menor que el mínimo, mostramos un error pero permitimos el cambio
      setQuantity(value);
      setError(`La cantidad mínima de compra es ${minQuantity} unidades`);
    } else {
      // Si es válido, actualizamos sin error
      setQuantity(value);
      setError(null);
    }
  };

  const handleCheckout = () => {
    // Verificar que la cantidad sea al menos el mínimo antes de proceder
    if (quantity < minQuantity) {
      setError(`La cantidad mínima de compra es ${minQuantity} unidades`);
      setQuantity(minQuantity);
      return;
    }

    navigate(`/checkout/${productId}`, {
      state: {
        quantity,
        totalPrice: quantity * basePrice,
      },
    });
  };

  return (
    <Container maxWidth="md" sx={{ textAlign: "center", mb: 5 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
          mt: -2, // Superposición con el componente anterior
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: { xs: "center", sm: "flex-start" },
            mb: { xs: 2, sm: 0 },
          }}
        >
          <TextField
            type="number"
            variant="outlined"
            value={quantity}
            onChange={handleQuantityChange}
            inputProps={{ min: minQuantity }}
            sx={{
              width: "100px",
              bgcolor: "white",
              borderRadius: 1,
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: error ? "red" : "#E0E0E0",
                },
              },
            }}
          />
          {error && (
            <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
              {error}
            </Typography>
          )}
        </Box>

        <Button
          variant="contained"
          color="primary"
          onClick={handleCheckout}
          disabled={quantity < minQuantity}
          sx={{
            bgcolor: "rgba(0, 0, 0, 0.65)",
            "&:hover": {
              bgcolor: "rgba(0, 0, 0, 0.85)",
            },
            color: "white",
            borderRadius: 1,
            px: 3,
            py: 1.5,
          }}
        >
          <ShoppingCartIcon sx={{ mr: 1 }} />
          Comprar Ahora
        </Button>
      </Box>

      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ display: "block", mt: 2 }}
      >
        La cantidad mínima de compra es {minQuantity} diseños.
      </Typography>
    </Container>
  );
};

export default QuantitySelector;
