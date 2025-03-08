// src/services/epaycoService.ts

// Configuración para ambiente de pruebas (sandbox)
const EPAYCO_PUBLIC_KEY = "c928d20ff99b8e2a54fed766ab4eec4e";
const EPAYCO_PRIVATE_KEY = "03dbe436b94c2d5ac1bed5a047730227"; // En producción esto debe estar en el backend
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
 */
export const redirectToEpaycoCheckout = (
  paymentData: EpaycoPaymentData
): void => {
  // En lugar de usar la API, para ePayco usaremos una redirección mediante formulario
  // ya que la documentación de ePayco recomienda este método

  const form = document.createElement("form");
  form.method = "POST";
  form.action = "https://secure.epayco.co/payment/process";
  form.style.display = "none";

  // Campos requeridos por ePayco
  const fields = {
    // Datos de la tienda
    p_cust_id_cliente: EPAYCO_PUBLIC_KEY,
    p_key: EPAYCO_PRIVATE_KEY,

    // Datos de la transacción
    p_id_invoice: paymentData.reference,
    p_description: paymentData.description,
    p_amount: paymentData.amount.toString(),
    p_tax: paymentData.tax.toString(),
    p_amount_base: paymentData.taxBase.toString(),
    p_currency_code: paymentData.currency,

    // URLs de respuesta y confirmación
    p_url_response: paymentData.responseUrl,
    p_url_confirmation: paymentData.confirmationUrl || paymentData.responseUrl,

    // Datos del cliente
    p_first_name: paymentData.name,
    p_last_name: paymentData.lastName,
    p_email: paymentData.email,
    p_phone: paymentData.phone,
    p_billing_address: paymentData.address,
    p_billing_document: paymentData.documentId,

    // Configuración adicional
    p_test_request: EPAYCO_TEST ? "1" : "0",
  };

  // Crear los campos del formulario
  Object.entries(fields).forEach(([key, value]) => {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = key;
    input.value = value;
    form.appendChild(input);
  });

  // Añadir el formulario al DOM y enviarlo
  document.body.appendChild(form);
  form.submit();
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
    return;
  }

  const handler = window.ePayco.checkout.configure({
    key: EPAYCO_PUBLIC_KEY,
    test: EPAYCO_TEST,
  });

  // Es importante configurar estas opciones para que la redirección funcione correctamente
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

    // Configuración de la experiencia - CORREGIDO
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
