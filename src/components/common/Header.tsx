import React from "react";
import { AppBar, Toolbar, Box, Container, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import logo from "../../assets/logo-fondo.png";

const Header: React.FC = () => {
  return (
    <AppBar position="static" color="primary" sx={{ bgcolor: "#130B5C" }}>
      <Container maxWidth="lg">
        <Toolbar sx={{ justifyContent: "center", py: 1 }}>
          <Link to="/" style={{ display: "flex", alignItems: "center" }}>
          <Typography variant="h6" sx={{ color: "white" }}>Inversiones</Typography>
            <Box
              component="img"
              src={logo}
              alt="Diseños Bendecidos"
              sx={{ height: 60, ml: 1 }}
            />
          </Link>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
