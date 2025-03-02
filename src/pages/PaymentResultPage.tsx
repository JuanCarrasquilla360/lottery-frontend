// src/pages/PaymentResultPage.tsx
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Paper, 
  Box, 
  Button, 
  CircularProgress, 
  Alert, 
  Divider 
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import MainLayout from '../components/layout/MainLayout';
import { checkTransactionStatus } from '../services/wompiService';

const PaymentResultPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [status, setStatus] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [transactionDetails, setTransactionDetails] = useState<any>(null);
  
  const reference = searchParams.get('reference');
  const id = searchParams.get('id');
  
  useEffect(() => {
    const checkStatus = async () => {
      if (!reference) {
        setError('No se encontró la referencia de la transacción');
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const transactionData = await checkTransactionStatus(reference);
        setTransactionDetails(transactionData);
        
        if (transactionData) {
          setStatus(transactionData.status);
        } else {
          setError('No se pudo obtener el estado de la transacción');
        }
      } catch (err) {
        console.error('Error al verificar el estado de la transacción:', err);
        setError('Hubo un error al verificar el estado de la transacción');
      } finally {
        setLoading(false);
      }
    };
    
    checkStatus();
  }, [reference, id]);
  
  const handleGoHome = () => {
    navigate('/');
  };
  
  if (loading) {
    return (
      <MainLayout>
        <Container maxWidth="md" sx={{ my: 8, textAlign: 'center' }}>
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ mt: 3 }}>
            Verificando el estado de tu pago...
          </Typography>
        </Container>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <Container maxWidth="md" sx={{ my: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            {status === 'APPROVED' ? (
              <CheckCircleOutlineIcon color="success" sx={{ fontSize: 80 }} />
            ) : (
              <ErrorOutlineIcon color="error" sx={{ fontSize: 80 }} />
            )}
            
            <Typography variant="h4" sx={{ mt: 2 }}>
              {status === 'APPROVED' 
                ? '¡Pago completado con éxito!' 
                : status === 'PENDING' 
                  ? 'Pago en procesamiento'
                  : 'No se completó el pago'}
            </Typography>
            
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
              {status === 'APPROVED' 
                ? 'Tu transacción ha sido procesada correctamente.' 
                : status === 'PENDING'
                  ? 'Tu pago está siendo procesado. Te notificaremos cuando se complete.'
                  : 'Hubo un problema al procesar tu pago. Por favor, intenta nuevamente.'}
            </Typography>
          </Box>
          
          <Divider sx={{ my: 3 }} />
          
          {error ? (
            <Alert severity="error" sx={{ my: 3 }}>
              {error}
            </Alert>
          ) : (
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                Detalles de la transacción
              </Typography>
              
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Referencia:
                </Typography>
                <Typography variant="body2">
                  {reference || 'No disponible'}
                </Typography>
                
                <Typography variant="body2" color="text.secondary">
                  Estado:
                </Typography>
                <Typography variant="body2" fontWeight="bold" color={
                  status === 'APPROVED' ? 'success.main' : 
                  status === 'PENDING' ? 'warning.main' : 
                  'error.main'
                }>
                  {status === 'APPROVED' ? 'Aprobado' : 
                   status === 'PENDING' ? 'Pendiente' : 
                   status === 'DECLINED' ? 'Rechazado' : 
                   status || 'Desconocido'}
                </Typography>
                
                {transactionDetails && (
                  <>
                    <Typography variant="body2" color="text.secondary">
                      Monto:
                    </Typography>
                    <Typography variant="body2">
                      ${((transactionDetails.amount_in_cents || 0) / 100).toLocaleString()} {transactionDetails.currency || 'COP'}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary">
                      Fecha:
                    </Typography>
                    <Typography variant="body2">
                      {transactionDetails.created_at 
                        ? new Date(transactionDetails.created_at).toLocaleString()
                        : 'No disponible'}
                    </Typography>
                    
                    {transactionDetails.payment_method_type && (
                      <>
                        <Typography variant="body2" color="text.secondary">
                          Método de pago:
                        </Typography>
                        <Typography variant="body2">
                          {transactionDetails.payment_method_type}
                        </Typography>
                      </>
                    )}
                  </>
                )}
              </Box>
            </Box>
          )}
          
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Button 
              variant="contained" 
              color="primary" 
              size="large" 
              onClick={handleGoHome}
              sx={{ px: 4 }}
            >
              Volver a la tienda
            </Button>
          </Box>
        </Paper>
      </Container>
    </MainLayout>
  );
};

export default PaymentResultPage;