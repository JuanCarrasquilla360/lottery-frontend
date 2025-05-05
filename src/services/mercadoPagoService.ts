const MERCADOPAGO_PUBLIC_KEY = "APP_USR-93130171-6d5d-4ec7-88cf-c044c4ec8e34"; // Reemplazar con tu clave pública
const MERCADOPAGO_TEST = true; // true para modo test, false para producción
const MERCADOPAGO_ACCESS_TOKEN = "APP_USR-4444152903208210-050312-47b3a70990d55db277ddd1b6373552fa-2422396644";

// Usuarios de prueba para Mercado Pago
const TEST_SELLER_EMAIL = "test_user_1556897641@testuser.com";
const TEST_BUYER_EMAIL = "test_user_36961754@testuser.com";

// Configuraciones de redirección
const REDIRECT_BASE_URL = "https://inversionestintafina.com";
const REDIRECT_PAYMENT_RESULT = "/payment-result";

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

  // Crear preferencia de pago
  const createPreference = async () => {
    try {
      // Versión simplificada del payload (solo lo esencial)
      const payload = {
        items: [
          {
            title: paymentData.productTitle,
            description: paymentData.description,
            quantity: 1,
            currency_id: "COP",
            unit_price: Number(paymentData.amount)
          }
        ],
        back_urls: {
          success: "https://test.com/success",
          failure: "https://test.com/success",
          pending: "https://test.com/success"
        },
        auto_return: "approved",
        external_reference: paymentData.reference
      };

      console.log("Enviando payload a Mercado Pago:", JSON.stringify(payload));

      const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${MERCADOPAGO_ACCESS_TOKEN}`
        },
        body: JSON.stringify(payload)
      });

      const responseData = await response.json();

      if (!response.ok) {
        console.error('Error de Mercado Pago:', responseData);
        throw new Error(`Error al crear preferencia: ${responseData.message || 'Error desconocido'}`);
      }

      console.log('Preferencia creada:', responseData);

      if (responseData && responseData.id) {
        // Método 1: Redirección directa al punto de pago
        const initPoint = MERCADOPAGO_TEST ? responseData.init_point : responseData.init_point;

        // Crear un botón visual para realizar la redirección
        const container = document.querySelector('.mercadopago-button-container');
        if (container) {
          container.innerHTML = '';
          const button = document.createElement('button');
          button.innerText = 'Pagar ahora';
          button.className = 'payment-button';
          button.style.backgroundColor = '#009ee3';
          button.style.color = 'white';
          button.style.padding = '10px 20px';
          button.style.border = 'none';
          button.style.borderRadius = '4px';
          button.style.fontSize = '16px';
          button.style.cursor = 'pointer';
          button.style.width = '100%';

          button.onclick = () => {
            window.location.href = initPoint;
          };

          container.appendChild(button);

          // Redirección automática después de un breve retraso
          setTimeout(() => {
            button.click();
          }, 500);
        } else {
          // Si no encuentra el contenedor, redireccionar directamente
          window.location.href = initPoint;
        }
      } else {
        throw new Error("No se pudo obtener el ID de preferencia");
      }
    } catch (error) {
      console.error('Error al crear la preferencia de pago:', error);
      alert('Hubo un problema al procesar el pago. Por favor, inténtelo de nuevo.');
    }
  };

  createPreference();
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