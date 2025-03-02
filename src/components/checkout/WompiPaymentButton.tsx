// src/components/checkout/WompiPaymentButton.tsx
import React, { useState } from 'react';
import { Button, CircularProgress, Typography, Box } from '@mui/material';
import { 
  createWompiTransaction, 
  generateTransactionReference, 
  WompiTransactionData 
} from '../../services/wompiService';
import { BillingFormValues } from './BillingForm';

interface WompiPaymentButtonProps {
  amount: number;
  isFormValid: boolean;
  formData: BillingFormValues | null;
  productName: string;
  onTransactionCreated?: (reference: string) => void;
}

const WompiPaymentButton: React.FC<WompiPaymentButtonProps> = ({ 
  amount, 
  isFormValid, 
  formData, 
  productName,
  onTransactionCreated 
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handlePayment = async () => {
    console.log(formData);
    
    if (!formData) {
      setError('Por favor complete el formulario primero');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      // Generar referencia única para la transacción
      const reference = generateTransactionReference();
      
      // Crear el objeto de datos para Wompi
      const transactionData: WompiTransactionData = {
        amountInCents: amount * 100, // Wompi requiere el monto en centavos
        currency: 'COP',
        customerData: {
          fullName: `${formData.firstName} ${formData.lastName}`,
          phoneNumber: formData.phone,
          email: formData.email
        },
        reference: reference,
        customerAddress: {
          addressLine1: formData.address,
          city: 'Bogotá', // Estos valores se deberían obtener del formulario en una implementación completa
          phoneNumber: formData.phone,
          region: 'Cundinamarca'
        },
        redirectUrl: `${window.location.origin}/payment-result?reference=${reference}`
      };

      // Llamar al servicio para crear la transacción
      const checkoutUrl = await createWompiTransaction(transactionData);
      
      // Callback opcional para notificar que la transacción fue creada
      if (onTransactionCreated) {
        onTransactionCreated(reference);
      }
      
      // Redirigir al usuario al checkout de Wompi
      window.location.href = checkoutUrl;
      
    } catch (err) {
      console.error('Error al procesar el pago:', err);
      setError('Hubo un error al procesar el pago. Por favor, inténtelo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        fullWidth
        size="large"
        onClick={handlePayment}
        disabled={!isFormValid || loading}
        sx={{
          bgcolor: '#00aff0', // Color de Wompi
          '&:hover': {
            bgcolor: '#0096cc',
          },
          py: 1.5,
          borderRadius: 0,
          textTransform: 'none',
          position: 'relative'
        }}
      >
        {loading ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          <>
            Pagar con Wompi
          </>
        )}
      </Button>
      
      {error && (
        <Typography variant="body2" color="error" sx={{ mt: 1, textAlign: 'center' }}>
          {error}
        </Typography>
      )}
      
      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <Typography variant="caption" color="text.secondary">
          Al hacer clic en "Pagar con Wompi", serás redirigido a la pasarela de pagos segura de Wompi.
        </Typography>
      </Box>
    </>
  );
};

export default WompiPaymentButton;