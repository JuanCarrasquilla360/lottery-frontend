// src/components/common/SpecialNumbersGrid.tsx
import React from "react";
import { Box, Grid, Typography } from "@mui/material";
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

  // Calcular cuántos números mostrar por fila (ajustable)

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

      <Grid container spacing={2} justifyContent="center">
        {numbers.map((item, index) => (
          <Grid item key={item.id}>
            <Box
              sx={{
                position: "relative",
                width: 150,
                height: 200,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                transition: "transform 0.3s ease-in-out",
                "&:hover": {
                  transform: "scale(1.05)",
                },
              }}
            >
              {/* Wolf SVG Image */}
              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                  height: "100%",
                }}
              >
                <Box
                  component="img"
                  src={index > 4 ? `/images/img${index-4}.svg` :  `/images/img${index+1}.svg`}
                  alt={index > 5 ? `/images/img${index-4}.svg` :  `/images/img${index+1}.svg`}
                  sx={{
                    width: "100%",
                    height: "100%",
                    filter: item.has_winner
                      ? "drop-shadow(0 0 5px gold) brightness(1.1)"
                      : "none",
                  }}
                />

                {/* Number positioned at the bottom of the wolf */}
                <Box
                  sx={{
                    position: "absolute",
                    bottom: "22px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "70px",
                    height: "28px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: item.has_winner
                      ? "rgba(255, 215, 0, 0.85)"
                      : "rgba(255, 160, 0, 0.85)",
                    color: "#000",
                    fontWeight: "bold",
                    fontSize: "16px",
                    borderRadius: "4px",
                    boxShadow: item.has_winner
                      ? "0 0 8px rgba(255, 215, 0, 0.7)"
                      : "0 0 5px rgba(0, 0, 0, 0.2)",
                    zIndex: 2,
                  }}
                >
                  {formatNumber(item.number)}
                </Box>

                {/* Trophy icon for winners */}
                {item.has_winner && (
                  <EmojiEventsIcon
                    sx={{
                      position: "absolute",
                      top: 10,
                      right: 10,
                      fontSize: 28,
                      color: "#FFD700",
                      filter: "drop-shadow(0 0 3px rgba(0,0,0,0.5))",
                      zIndex: 3,
                    }}
                  />
                )}
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>

    </Box>
  );
};

export default SpecialNumbersGrid;
