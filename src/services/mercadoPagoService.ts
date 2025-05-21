export const MERCADOPAGO_TEST = true; // true para modo test, false para producción


export interface MercadoPagoPaymentData {
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
  productTitle: string;

  // URLs de respuesta
  responseUrl: string;
  confirmationUrl?: string;
  initPoint: string;
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
 * Procesa el pago mediante Mercado Pago
 */
export const processMercadoPagoPayment = (paymentData: MercadoPagoPaymentData): void => {
  // Comprobamos si el SDK está disponible
  if (typeof window.MercadoPago === "undefined") {
    console.error(
      "SDK de Mercado Pago no encontrado. Asegúrate de incluir el script en tu HTML."
    );
    alert("Error al conectar con Mercado Pago. Por favor, inténtelo más tarde.");
    return;
  }

  console.log("Procesando pago con Mercado Pago:", paymentData);

  // Redirección a la URL de pago obtenida del backend
  const redirectToPayment = (initPoint: string) => {
    // Crear un botón visual para realizar la redirección
    window.location.href = initPoint;
    // const container = document.querySelector('.mercadopago-button-container');
    // if (container) {
    //   container.innerHTML = '';
    //   const button = document.createElement('button');
    //   button.innerText = 'Pagar ahora';
    //   button.className = 'payment-button';
    //   button.style.backgroundColor = '#009ee3';
    //   button.style.color = 'white';
    //   button.style.padding = '10px 20px';
    //   button.style.border = 'none';
    //   button.style.borderRadius = '4px';
    //   button.style.fontSize = '16px';
    //   button.style.cursor = 'pointer';
    //   button.style.width = '100%';

    //   button.onclick = () => {
    //     window.location.href = initPoint;
    //   };

    //   container.appendChild(button);

    //   // Redirección automática después de un breve retraso
    //   setTimeout(() => {
    //     button.click();
    //   }, 500);
    // } else {
    //   // Si no encuentra el contenedor, redireccionar directamente
    //   window.location.href = initPoint;
    // }
  };

  // La URL de preferencia viene del backend
  // No es necesario hacer la llamada a createPreference directamente desde el frontend
  redirectToPayment(paymentData.initPoint);
};

/**
 * Verifica la respuesta de Mercado Pago (para la página de resultado)
 */
export const verifyMercadoPagoResponse = (
  params: URLSearchParams
): {
  isValid: boolean;
  status: string;
  reference: string;
  transactionId: string;
  amount: number;
  currency: string;
  paymentId: string;
} => {
  const payment_id = params.get("payment_id") || "";
  const status = params.get("status") || "";
  const external_reference = params.get("external_reference") || "";
  const merchant_order_id = params.get("merchant_order_id") || "";

  // Los valores exactos dependerán de la integración real con la API
  // Esto es un ejemplo simplificado
  const amount = 0; // Normalmente, este valor se obtendría mediante una llamada a la API
  const currency = "COP";

  let isValid = false;
  let statusText = "";

  // Mapear la respuesta de Mercado Pago a un estado
  switch (status.toLowerCase()) {
    case "approved":
      statusText = "APPROVED";
      isValid = true;
      break;
    case "in_process":
    case "pending":
      statusText = "PENDING";
      isValid = true;
      break;
    case "rejected":
    case "cancelled":
      statusText = "REJECTED";
      isValid = true;
      break;
    default:
      statusText = "UNKNOWN";
      isValid = false;
  }

  return {
    isValid,
    status: statusText,
    reference: external_reference,
    transactionId: merchant_order_id,
    amount,
    currency,
    paymentId: payment_id,
  };
};

// Definir window.MercadoPago para TypeScript (el SDK se carga de forma externa)
declare global {
  interface Window {
    MercadoPago?: any;
  }
}