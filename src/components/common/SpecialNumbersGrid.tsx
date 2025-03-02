import React from 'react';
import { Box, Grid, Typography, Paper } from '@mui/material';

interface SpecialNumbersGridProps {
  numbers: string[];
  title: string;
}

const SpecialNumbersGrid: React.FC<SpecialNumbersGridProps> = ({ numbers, title }) => {
  return (
    <Box sx={{ width: '100%', my: 4 }}>
      <Typography 
        variant="h6" 
        align="center" 
        gutterBottom 
        sx={{ textTransform: 'uppercase', fontWeight: 'bold', mb: 3 }}
      >
        {title}
      </Typography>
      
      <Grid container spacing={1} justifyContent="center">
        {numbers.map((number, index) => (
          <Grid item key={index}>
            <Paper
              elevation={0}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                bgcolor: '#FFA000',
                color: 'black',
                width: '80px',
                height: '40px',
                fontWeight: 'bold',
                borderRadius: 1,
              }}
            >
              {number}
            </Paper>
          </Grid>
        ))}
      </Grid>
      
      <Typography 
        variant="body2" 
        align="center" 
        sx={{ mt: 2, color: 'text.secondary', fontSize: '0.8rem' }}
      >
        LA ACTIVIDAD JUEGA CUANDO SE VENDA LA TOTALIDAD DE LOS FONDOS DE PANTALLA
      </Typography>
    </Box>
  );
};

export default SpecialNumbersGrid;