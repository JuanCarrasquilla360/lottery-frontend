import React from 'react';
import { Box, Typography, Grid, Button, Container } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

interface PricePackage {
  quantity: number;
  price: number;
}

interface PricingOptionsProps {
  basePrice: number;
  packages: PricePackage[];
  onSelectPackage: (quantity: number) => void;
}

const PricingOptions: React.FC<PricingOptionsProps> = ({ 
  basePrice, 
  packages, 
  onSelectPackage 
}) => {
  return (
    <Box sx={{ bgcolor: '#FF5722', py: 5, color: 'white' }}>
      <Container maxWidth="md">
        <Typography 
          variant="subtitle1" 
          align="center" 
          gutterBottom
        >
          VALOR
        </Typography>
        
        <Typography 
          variant="h3" 
          component="div" 
          align="center" 
          sx={{ 
            fontWeight: 'bold', 
            mb: 2 
          }}
        >
          ${basePrice.toLocaleString()}
        </Typography>
        
        <Typography 
          variant="h4" 
          align="center" 
          sx={{ 
            mb: 4,
            fontWeight: 'bold' 
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
                  bgcolor: 'rgba(0, 0, 0, 0.25)',
                  '&:hover': {
                    bgcolor: 'rgba(0, 0, 0, 0.4)',
                  },
                  color: 'white',
                  borderRadius: 1,
                  px: 2,
                  py: 1,
                  textTransform: 'none',
                }}
                onClick={() => onSelectPackage(pkg.quantity)}
              >
                <ShoppingCartIcon sx={{ mr: 1, fontSize: 18 }} />
                {pkg.quantity} Fondos ${pkg.price.toLocaleString()} COP
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
            fontWeight: 'medium' 
          }}
        >
          ELIGE LA CANTIDAD QUE DESEES
        </Typography>
      </Container>
    </Box>
  );
};

export default PricingOptions;