// src/pages/HomePage.tsx
import React from 'react';
import { Box, CircularProgress, Container, Alert } from '@mui/material';
import MainLayout from '../components/layout/MainLayout';
import ProductBanner from '../components/home/ProductBanner';
import SpecialNumbersGrid from '../components/common/SpecialNumbersGrid';
import PricingOptions from '../components/home/PricingOptions';
import QuantitySelector from '../components/home/QuantitySelector';
import { useWallpaper } from '../hooks/useWallpapers';

const HomePage: React.FC = () => {
  const { wallpaper, loading, error } = useWallpaper('ktm-690-smc-r-2025');
  
  if (loading) {
    return (
      <MainLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
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
            {error || 'No se pudo cargar el fondo de pantalla. Inténtalo de nuevo más tarde.'}
          </Alert>
        </Container>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <ProductBanner 
        title={wallpaper.title}
        subtitle={wallpaper.subtitle}
        imageUrl={wallpaper.image}
        progress={wallpaper.progress}
      />
      
      <SpecialNumbersGrid 
        numbers={wallpaper.specialNumbers}
        title="ADEMÁS TENEMOS 10 FONDOS ESPECIALES DE 1M"
      />
      
      <PricingOptions 
        basePrice={wallpaper.basePrice}
        packages={wallpaper.packages}
        onSelectPackage={(quantity) => console.log(`Selected ${quantity} items`)}
      />
      
      <QuantitySelector 
        productId={wallpaper.id}
        basePrice={wallpaper.basePrice}
      />
    </MainLayout>
  );
};

export default HomePage;