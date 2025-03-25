// src/components/home/ProductBanner.tsx
import React from "react";
import { Box, Typography, Container } from "@mui/material";
import LoadingBar from "../common/LoadingBar";

interface ProductBannerProps {
  title: string;
  description: string;
  imageUrl: string;
  stock: number;
  totalStock?: number; // Stock total para calcular el progreso
}

const ProductBanner: React.FC<ProductBannerProps> = ({
  title,
  description,
  imageUrl,
  stock,
  totalStock = 1000, // Valor por defecto para el stock total
}) => {
  // Calcular el porcentaje de progreso basado en el stock
  // Si stock = totalStock, progreso = 0%
  // Si stock = 0, progreso = 100%
  const progress = Math.max(0, Math.min(100, 100 - (stock / totalStock) * 100));

  return (
    <Box sx={{ width: "100%", bgcolor: "background.paper" }}>
      <Container maxWidth="md">
        <Box sx={{ pt: 4, pb: 2 }}>

          <Typography
            variant="h3"
            component="h1"
            align="center"
            color="primary.main"
            sx={{
              fontWeight: "bold",
              color: "#FF5722",
              textTransform: "uppercase",
              fontSize: { xs: "2rem", sm: "3rem", md: "4rem" },
              mb: 3,
            }}
          >
            {title}
          </Typography>

          <Box
            component="img"
            src={imageUrl}
            alt={title}
            sx={{
              width: "100%",
              height: "auto",
              borderRadius: 1,
              mb: 2,
            }}
          />

          <Typography
            variant="h6"
            align="center"
            sx={{ fontWeight: "bold", mb: 1 }}
          >
            {description}
          </Typography>

          <LoadingBar value={progress}/>
        </Box>
      </Container>
    </Box>
  );
};

export default ProductBanner;
