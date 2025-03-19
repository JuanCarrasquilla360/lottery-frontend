// src/components/common/SpecialNumbersGrid.tsx
import React from "react";
import { Box, Grid, Typography, Paper } from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents"; // Ícono de trofeo para ganadores

interface SpecialNumberItem {
  id: string;
  number: number;
  has_winner: boolean;
}

interface SpecialNumbersGridProps {
  numbers: SpecialNumberItem[];
  title: string;
  digits?: number; // Número de dígitos para formatear correctamente
}

const SpecialNumbersGrid: React.FC<SpecialNumbersGridProps> = ({
  numbers,
  title,
  digits = 3, // Por defecto mostramos 3 dígitos
}) => {
  // Función para formatear el número con ceros a la izquierda según la cantidad de dígitos
  const formatNumber = (num: number): string => {
    return num.toString().padStart(digits, "0");
  };

  return (
    <Box sx={{ width: "100%", my: 4 }}>
      <Typography
        variant="h6"
        align="center"
        gutterBottom
        sx={{ textTransform: "uppercase", fontWeight: "bold", mb: 3 }}
      >
        {title}
      </Typography>

      <Grid container spacing={1} justifyContent="center">
        {numbers.map((item) => (
          <Grid item key={item.id}>
            <Paper
              elevation={0}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                bgcolor: item.has_winner ? "#FFD700" : "#FFA000", // Dorado para ganadores
                color: "black",
                width: "80px",
                height: "40px",
                fontWeight: "bold",
                borderRadius: 1,
                position: "relative",
              }}
            >
              {formatNumber(item.number)}
              {item.has_winner && (
                <EmojiEventsIcon
                  sx={{
                    position: "absolute",
                    top: -10,
                    right: -10,
                    fontSize: 20,
                    color: "#FF6F00",
                  }}
                />
              )}
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Typography
        variant="body2"
        align="center"
        sx={{ mt: 2, color: "text.secondary", fontSize: "0.8rem" }}
      >
        LA ACTIVIDAD JUEGA CUANDO SE VENDA LA TOTALIDAD DE LOS NÚMEROS
      </Typography>
    </Box>
  );
};

export default SpecialNumbersGrid;
