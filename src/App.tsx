// src/App.tsx
import React from "react";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";

// Crear tema personalizado
const theme = createTheme({
  palette: {
    primary: {
      main: "#130B5C", // Color azul oscuro del encabezado
    },
    secondary: {
      main: "#FF5722", // Color naranja usado en el título principal
    },
    background: {
      default: "#F5F5F5",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h3: {
      fontWeight: 700,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          textTransform: "none",
          fontWeight: 500,
        },
      },
    },
  },
});

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
