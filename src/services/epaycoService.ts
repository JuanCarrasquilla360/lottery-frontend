// src/services/epaycoService.ts

const EPAYCO_PUBLIC_KEY = "c928d20ff99b8e2a54fed766ab4eec4e";
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
  productTitle: string; // Nuevo campo para incluir el título del producto

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
  return `NUMERO-${timestamp}-${randomStr}`;
};

/**
 * Procesa el pago mediante ePayco
 */
export const processEpaycoPayment = (paymentData: EpaycoPaymentData): void => {
  // Comprobamos si el SDK está disponible
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

  console.log("Procesando pago con ePayco:", paymentData);

  handler.open({
    name: paymentData.productTitle,
    description: paymentData.description,
    invoice: paymentData.reference,
    currency: paymentData.currency,
    amount: paymentData.amount,
    tax_base: paymentData.taxBase,
    tax: paymentData.tax,
    country: "co",
    lang: "es",

    // Configuración de la experiencia
    external: false,
    response: paymentData.responseUrl,

    // Información del cliente
    name_billing: paymentData.name,
    last_name_billing: paymentData.lastName,
    email_billing: paymentData.email,
    address_billing: paymentData.address,
    phone_billing: paymentData.phone,
    mobilephone_billing: paymentData.phone,
    type_doc_billing: "cc",

    // Información adicional - Ahora usa el título dinámico
    extra1: paymentData.productTitle,
    extra2: paymentData.reference,
    extra3: "numeros_prod",
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
  ref_payco: string;
} => {
  const ref_payco = params.get("ref_payco") || "";
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
    ref_payco,
  };
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
