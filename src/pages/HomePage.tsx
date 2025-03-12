// src/pages/HomePage.tsx
import React from "react";
import { Box, CircularProgress, Container, Alert } from "@mui/material";
import MainLayout from "../components/layout/MainLayout";
import ProductBanner from "../components/home/ProductBanner";
import SpecialNumbersGrid from "../components/common/SpecialNumbersGrid";
import PricingOptions from "../components/home/PricingOptions";
import QuantitySelector from "../components/home/QuantitySelector";
import { useWallpaper } from "../hooks/useWallpapers";

const HomePage: React.FC = () => {
  const { wallpaper, loading, error } = useWallpaper();

  if (loading) {
    return (
      <MainLayout>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "60vh",
          }}
        >
          <CircularProgress />
        </Box>
      </MainLayout>
    );
  }

  if (error || !wallpaper) {
    return (
      <MainLayout>
        <Container maxWidth="md" sx={{ mt: 4 }}>
          <Alert severity="error">
            {error ||
              "No se pudo cargar el fondo de pantalla. Inténtalo de nuevo más tarde."}
          </Alert>
        </Container>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <ProductBanner
        title={wallpaper.title}
        description={wallpaper.description}
        imageUrl={wallpaper.image}
        stock={wallpaper.stock}
        totalStock={1000} // Puedes ajustar este valor según lo que consideres apropiado
      />

      <SpecialNumbersGrid
        numbers={wallpaper.specialNumbers}
        title={`Tenemos ${wallpaper.specialNumbers.length} fondos especiales de 1M`}
        digits={wallpaper.digits}
      />

      <PricingOptions
        basePrice={wallpaper.price}
        productId={wallpaper.lottery_id}
        // No necesitamos el onSelectPackage ya que ahora la redirección está dentro del componente
      />

      <QuantitySelector
        productId={wallpaper.lottery_id}
        basePrice={wallpaper.price}
      />
    </MainLayout>
  );
};

export default HomePage;
