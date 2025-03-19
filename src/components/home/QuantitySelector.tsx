import React, { useState } from 'react';
import { Box, TextField, Button, Container } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useNavigate } from 'react-router-dom';

interface QuantitySelectorProps {
  productId: string;
  basePrice: number;
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({ productId, basePrice }) => {
  const [quantity, setQuantity] = useState<number>(1);
  const navigate = useNavigate();
  
  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value);
    if (!isNaN(value) && value > 0) {
      setQuantity(value);
    } else {
      setQuantity(1);
    }
  };
  
  const handleCheckout = () => {
    navigate(`/checkout/${productId}`, { 
      state: { 
        quantity, 
        totalPrice: quantity * basePrice 
      } 
    });
  };
  
  return (
    <Container maxWidth="md" sx={{ textAlign: 'center', mb: 5 }}>
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          gap: 2,
          mt: -2 // Superposición con el componente anterior
        }}
      >
        <TextField
          type="number"
          variant="outlined"
          value={quantity}
          onChange={handleQuantityChange}
          inputProps={{ min: 1 }}
          sx={{ 
            width: '100px',
            bgcolor: 'white',
            borderRadius: 1,
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: '#E0E0E0',
              },
            },
          }}
        />
        
        <Button
          variant="contained"
          color="primary"
          onClick={handleCheckout}
          sx={{
            bgcolor: 'rgba(0, 0, 0, 0.65)',
            '&:hover': {
              bgcolor: 'rgba(0, 0, 0, 0.85)',
            },
            color: 'white',
            borderRadius: 1,
            px: 3,
            py: 1.5,
          }}
        >
          <ShoppingCartIcon sx={{ mr: 1 }} />
          Comprar Más Numeros
        </Button>
      </Box>
    </Container>
  );
};

export default QuantitySelector;