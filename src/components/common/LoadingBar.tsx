import React from 'react';
import { Box, LinearProgress, Typography } from '@mui/material';

interface LoadingBarProps {
  value: number;
  label?: string;
}

const LoadingBar: React.FC<LoadingBarProps> = ({ value, label }) => {
  return (
    <Box sx={{ width: '100%', my: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        {label && (
          <Typography variant="body2" color="textSecondary" sx={{ mr: 1 }}>
            {label}
          </Typography>
        )}
        <Typography variant="body2" color="textSecondary">
          {value.toFixed(1)}%
        </Typography>
      </Box>
      <LinearProgress 
        variant="determinate" 
        value={value} 
        sx={{
          height: 12,
          borderRadius: 1,
          '& .MuiLinearProgress-bar': {
            backgroundColor: '#275AAD',
          },
          backgroundColor: '#E0E0E0',
        }}
      />
    </Box>
  );
};

export default LoadingBar;