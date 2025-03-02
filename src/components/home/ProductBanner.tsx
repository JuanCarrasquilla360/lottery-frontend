import React from "react";
import { Box, Typography, Container } from "@mui/material";
import LoadingBar from "../common/LoadingBar";

interface ProductBannerProps {
  title: string;
  subtitle: string;
  imageUrl: string;
  progress: number;
}

const ProductBanner: React.FC<ProductBannerProps> = ({
  title,
  subtitle,
  imageUrl,
  progress,
}) => {
  return (
    <Box sx={{ width: "100%", bgcolor: "background.paper" }}>
      <Container maxWidth="md">
        <Box sx={{ pt: 4, pb: 2 }}>
          <Typography
            variant="body1"
            align="center"
            color="primary"
            sx={{ fontWeight: "medium", mb: 1 }}
          >
            ADQUIERES NUESTROS FONDOS DE PANTALLA
          </Typography>

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
            {subtitle}
          </Typography>

          <LoadingBar value={progress} />
        </Box>
      </Container>
    </Box>
  );
};

export default ProductBanner;
