// src/components/checkout/BillingForm.tsx
import React, { useEffect } from "react";
import { TextField, Typography, Grid } from "@mui/material";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

// Esquema de validación con Yup
const validationSchema = Yup.object().shape({
  firstName: Yup.string()
    .required("El nombre es obligatorio")
    .min(2, "El nombre debe tener al menos 2 caracteres"),
  lastName: Yup.string()
    .required("Los apellidos son obligatorios")
    .min(2, "Los apellidos deben tener al menos 2 caracteres"),
  identificationNumber: Yup.string()
    .required("La cédula o número de identificación es obligatorio")
    .min(5, "Número de identificación inválido"),
  address: Yup.string().required("La dirección es obligatoria"),
  phone: Yup.string()
    .required("El teléfono es obligatorio")
    .matches(/^[0-9]{10}$/, "El teléfono debe tener 10 dígitos"),
  email: Yup.string()
    .email("Email inválido")
    .required("El email es obligatorio"),
  confirmEmail: Yup.string()
    .oneOf([Yup.ref("email")], "Los emails no coinciden")
    .required("Confirma tu email"),
});

// Interfaz para los valores del formulario
export interface BillingFormValues {
  firstName: string;
  lastName: string;
  identificationNumber: string;
  address: string;
  phone: string;
  email: string;
  confirmEmail: string;
}

interface BillingFormProps {
  onSubmit: (values: BillingFormValues) => void;
  minQuantity: number;
  isValid: (isValid: boolean) => void;
  onValuesChange: (values: BillingFormValues) => void;
}

const BillingForm: React.FC<BillingFormProps> = ({
  onSubmit,
  minQuantity,
  isValid,
  onValuesChange,
}) => {
  const initialValues: BillingFormValues = {
    firstName: "",
    lastName: "",
    identificationNumber: "",
    address: "",
    phone: "",
    email: "",
    confirmEmail: "",
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
      validateOnMount={true}
      validateOnChange={true}
      validateOnBlur={true}
    >
      {({ errors, touched, isValid: formIsValid, values }) => {
        // Pasar el estado de validación al componente padre
        useEffect(() => {
          isValid(formIsValid);
        }, [formIsValid, isValid]);

        // Pasar los valores al componente padre cada vez que cambien
        useEffect(() => {
          onValuesChange(values);
        }, [values, onValuesChange]);

        return (
          <Form>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ mt: 3, mb: 2, fontWeight: "bold" }}
            >
              Detalles de facturación
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" gutterBottom>
                  Nombre <span style={{ color: "red" }}>*</span>
                </Typography>
                <Field
                  as={TextField}
                  fullWidth
                  name="firstName"
                  variant="outlined"
                  error={touched.firstName && Boolean(errors.firstName)}
                  helperText={touched.firstName && errors.firstName}
                  size="small"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="body2" gutterBottom>
                  Apellidos <span style={{ color: "red" }}>*</span>
                </Typography>
                <Field
                  as={TextField}
                  fullWidth
                  name="lastName"
                  variant="outlined"
                  error={touched.lastName && Boolean(errors.lastName)}
                  helperText={touched.lastName && errors.lastName}
                  size="small"
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="body2" gutterBottom>
                  Cédula o Número de Identificación{" "}
                  <span style={{ color: "red" }}>*</span>
                </Typography>
                <Field
                  as={TextField}
                  fullWidth
                  name="identificationNumber"
                  variant="outlined"
                  error={
                    touched.identificationNumber &&
                    Boolean(errors.identificationNumber)
                  }
                  helperText={
                    touched.identificationNumber && errors.identificationNumber
                  }
                  size="small"
                  placeholder="Cédula o Número de Identificación"
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="body2" gutterBottom>
                  Dirección <span style={{ color: "red" }}>*</span>
                </Typography>
                <Field
                  as={TextField}
                  fullWidth
                  name="address"
                  variant="outlined"
                  error={touched.address && Boolean(errors.address)}
                  helperText={touched.address && errors.address}
                  size="small"
                  placeholder="Dirección"
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="body2" gutterBottom>
                  Teléfono <span style={{ color: "red" }}>*</span>
                </Typography>
                <Field
                  as={TextField}
                  fullWidth
                  name="phone"
                  variant="outlined"
                  error={touched.phone && Boolean(errors.phone)}
                  helperText={touched.phone && errors.phone}
                  size="small"
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="body2" gutterBottom>
                  Dirección de correo electrónico{" "}
                  <span style={{ color: "red" }}>*</span>
                </Typography>
                <Field
                  as={TextField}
                  fullWidth
                  name="email"
                  variant="outlined"
                  error={touched.email && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                  size="small"
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="body2" gutterBottom>
                  Confirmar correo electrónico{" "}
                  <span style={{ color: "red" }}>*</span>
                </Typography>
                <Field
                  as={TextField}
                  fullWidth
                  name="confirmEmail"
                  variant="outlined"
                  error={touched.confirmEmail && Boolean(errors.confirmEmail)}
                  helperText={touched.confirmEmail && errors.confirmEmail}
                  size="small"
                />
              </Grid>

              {/* Nota informativa sobre la cantidad mínima */}
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">
                  Compra mínima: {minQuantity} fondos de pantalla
                </Typography>
              </Grid>
            </Grid>
          </Form>
        );
      }}
    </Formik>
  );
};

export default BillingForm;
