// src/pages/HomePage.tsx
import React from "react";
import { Box, CircularProgress, Container, Alert } from "@mui/material";
import MainLayout from "../components/layout/MainLayout";
import ProductBanner from "../components/home/ProductBanner";
import SpecialNumbersGrid from "../components/common/SpecialNumbersGrid";
import PricingOptions from "../components/home/PricingOptions";
import QuantitySelector from "../components/home/QuantitySelector";
import { useWallpaper } from "../hooks/useWallpapers";

// Definición de mínimo de compra
const MIN_PURCHASE_QUANTITY = 4;

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
              "No se pudo cargar el numero. Inténtalo de nuevo más tarde."}
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
        totalStock={(10**(wallpaper.digits))}
      />

      <SpecialNumbersGrid
        numbers={wallpaper.specialNumbers}
        title={`Tenemos ${wallpaper.specialNumbers.length} diseños bendecidos`}
        digits={wallpaper.digits}
      />

      <PricingOptions
        basePrice={wallpaper.price}
        productId={wallpaper.lottery_id}
        minQuantity={MIN_PURCHASE_QUANTITY} // Pasamos el mínimo de compra
      />

      <QuantitySelector
        productId={wallpaper.lottery_id}
        basePrice={wallpaper.price}
        minQuantity={MIN_PURCHASE_QUANTITY} // Pasamos el mínimo de compra
      />
    </MainLayout>
  );
};

export default HomePage;
