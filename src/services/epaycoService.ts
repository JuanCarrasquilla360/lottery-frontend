// src/services/epaycoService.ts

// Configuración para ambiente de pruebas (sandbox)
const EPAYCO_PUBLIC_KEY = "c928d20ff99b8e2a54fed766ab4eec4e";
// En un ambiente real, esto NUNCA debe estar en el frontend
// Puede ser que epayco bloquee las solicitudes por seguridad cuando envías la clave privada desde el frontend
// Omitiremos esta clave en el frontend para el método de redirección
// const EPAYCO_PRIVATE_KEY = "03dbe436b94c2d5ac1bed5a047730227";
const EPAYCO_TEST = true; // true para sandbox, false para producción

export interface EpaycoPaymentData {
  // Datos del cliente
  name: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  documentId: string;

  // Datos de la transacción
  description: string;
  amount: number;
  tax: number;
  taxBase: number;
  currency: string;
  reference: string;

  // URLs de respuesta
  responseUrl: string;
  confirmationUrl?: string;
}

/**
 * Genera un ID de referencia único para la transacción
 */
export const generateTransactionReference = (): string => {
  const timestamp = new Date().getTime();
  const randomStr = Math.random().toString(36).substring(2, 10);
  return `PANTALLAS-${timestamp}-${randomStr}`;
};

/**
 * Crea un formulario para redireccionar al checkout de ePayco
 * Método alternativo usando el SDK en lugar del formulario POST
 */
export const redirectToEpaycoCheckout = (
  paymentData: EpaycoPaymentData
): void => {
  // Comprobamos si el SDK está disponible
  if (typeof window.ePayco === "undefined") {
    console.error(
      "SDK de ePayco no encontrado. Asegúrate de incluir el script en tu HTML."
    );
    alert("Error al conectar con ePayco. Por favor, inténtelo más tarde.");
    return;
  }

  // Usamos el SDK en lugar del formulario POST que estaba causando problemas
  const handler = window.ePayco.checkout.configure({
    key: EPAYCO_PUBLIC_KEY,
    test: EPAYCO_TEST,
  });

  console.log("Redirigiendo a ePayco con:", paymentData);

  handler.open({
    // Información del comercio
    name: "Fondos de Pantalla Celular",
    description: paymentData.description,
    invoice: paymentData.reference,
    currency: paymentData.currency,
    amount: paymentData.amount,
    tax_base: paymentData.taxBase,
    tax: paymentData.tax,
    country: "co",
    lang: "es",

    // Configuración de la experiencia
    external: false, // false para abrir en la misma ventana, true para ventana emergente
    response: paymentData.responseUrl, // ePayco añadirá automáticamente el ref_payco a esta URL

    // Información del cliente
    name_billing: paymentData.name,
    last_name_billing: paymentData.lastName,
    email_billing: paymentData.email,
    address_billing: paymentData.address,
    phone_billing: paymentData.phone,
    mobilephone_billing: paymentData.phone,
    type_doc_billing: "cc", // cc (cédula), nit, pasaporte, etc.

    // Información adicional para identificar la transacción
    extra1: "fondos_pantalla",
    extra2: paymentData.reference,
    extra3: "checkout_form",
  });
};

/**
 * Verifica la respuesta de ePayco (para la página de resultado)
 */
export const verifyEpaycoResponse = (
  params: URLSearchParams
): {
  isValid: boolean;
  status: string;
  reference: string;
  transactionId: string;
  amount: number;
  currency: string;
} => {
  // En un ambiente real, se debería verificar la firma con la clave privada
  // para garantizar que la respuesta viene de ePayco

  // const ref_payco = params.get("ref_payco") || "";
  const response = params.get("x_response") || "";
  const reference = params.get("x_id_invoice") || "";
  const transactionId = params.get("x_transaction_id") || "";
  const amount = parseFloat(params.get("x_amount") || "0");
  const currency = params.get("x_currency_code") || "COP";

  let status = "";
  let isValid = false;

  // Mapear la respuesta de ePayco a un estado
  switch (response.toLowerCase()) {
    case "approved":
    case "aceptada":
      status = "APPROVED";
      isValid = true;
      break;
    case "pending":
    case "pendiente":
    case "en validacion":
      status = "PENDING";
      isValid = true;
      break;
    case "rejected":
    case "rechazada":
    case "fallida":
    case "cancelada":
      status = "REJECTED";
      isValid = true;
      break;
    default:
      status = "UNKNOWN";
      isValid = false;
  }

  return {
    isValid,
    status,
    reference,
    transactionId,
    amount,
    currency,
  };
};

/**
 * Integración alternativa usando el SDK de ePayco (requiere importar el script en index.html)
 * Esta función usa el SDK para abrir el checkout en una ventana emergente o incrustada
 */
export const openEpaycoCheckout = (paymentData: EpaycoPaymentData): void => {
  // Esta función requiere que se haya cargado el SDK de ePayco
  if (typeof window.ePayco === "undefined") {
    console.error(
      "SDK de ePayco no encontrado. Asegúrate de incluir el script en tu HTML."
    );
    alert("Error al conectar con ePayco. Por favor, inténtelo más tarde.");
    return;
  }

  const handler = window.ePayco.checkout.configure({
    key: EPAYCO_PUBLIC_KEY,
    test: EPAYCO_TEST,
  });

  console.log("Abriendo checkout con ePayco SDK:", paymentData);

  handler.open({
    // Información del comercio
    name: "Fondos de Pantalla Celular",
    description: paymentData.description,
    invoice: paymentData.reference,
    currency: paymentData.currency,
    amount: paymentData.amount,
    tax_base: paymentData.taxBase,
    tax: paymentData.tax,
    country: "co",
    lang: "es",

    // Configuración de la experiencia
    external: false, // false para abrir en la misma ventana, true para ventana emergente

    // URL a la que se redirigirá después del pago - CRÍTICO para la redirección
    response: paymentData.responseUrl,

    // Información del cliente
    name_billing: paymentData.name,
    last_name_billing: paymentData.lastName,
    email_billing: paymentData.email,
    address_billing: paymentData.address,
    phone_billing: paymentData.phone,
    mobilephone_billing: paymentData.phone,
    type_doc_billing: "cc", // cc (cédula), nit, pasaporte, etc.

    // Información adicional para identificar la transacción
    extra1: "fondos_pantalla",
    extra2: paymentData.reference,
    extra3: "checkout_sdk",
  });
};

// Definir window.ePayco para TypeScript (el SDK se carga de forma externa)
declare global {
  interface Window {
    ePayco?: {
      checkout: {
        configure: (config: any) => {
          open: (data: any) => void;
        };
      };
    };
  }
}
