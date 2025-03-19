import React from "react";
import { Box, Container, Typography, Link, Grid } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import LegalIcon from "@mui/icons-material/Gavel";
import logo from "../../assets/logo-fondo.png";

const Footer: React.FC = () => {
  return (
    <Box sx={{ bgcolor: "#130B5C", color: "white", py: 3 }}>
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              display: "flex",
              justifyContent: { xs: "center", md: "flex-start" },
              flexDirection: "column",
            }}
          >
            <Typography variant="h6" sx={{ color: "white" }}>
              Inversiones
            </Typography>
            <Box
              component="img"
              src={logo}
              alt="Numeros Bendecidos"
              sx={{ height: 60, width: 100 }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: { xs: "center", md: "flex-end" },
              }}
            >
              <Typography
                variant="body2"
                sx={{ display: "flex", alignItems: "center", mb: 1 }}
              >
                <LocationOnIcon sx={{ mr: 1, fontSize: "1rem" }} />
                Calle xxx
              </Typography>

              <Typography
                variant="body2"
                sx={{ display: "flex", alignItems: "center", mb: 1 }}
              >
                <PhoneIcon sx={{ mr: 1, fontSize: "1rem" }} />
                xxx xxxxxxx
              </Typography>

              <Typography
                variant="body2"
                sx={{ display: "flex", alignItems: "center", mb: 1 }}
              >
                <EmailIcon sx={{ mr: 1, fontSize: "1rem" }} />
                ventas@inversionestf.com
              </Typography>

              <Typography
                variant="body2"
                sx={{ display: "flex", alignItems: "center" }}
              >
                <LegalIcon sx={{ mr: 1, fontSize: "1rem" }} />
                <Link href="/terminos" color="inherit" underline="hover">
                  Términos y Condiciones
                </Link>
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Footer;
