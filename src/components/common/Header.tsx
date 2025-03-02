import React from 'react';
import { AppBar, Toolbar, Box, Container } from '@mui/material';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <AppBar position="static" color="primary" sx={{ bgcolor: '#130B5C' }}>
      <Container maxWidth="lg">
        <Toolbar sx={{ justifyContent: 'center', py: 1 }}>
          <Link to="/">
            <Box
              component="img"
              src="/assets/images/logo.png" // Reemplazar con la ruta correcta
              alt="Pantallas Celular"
              sx={{ height: 50 }}
            />
          </Link>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;