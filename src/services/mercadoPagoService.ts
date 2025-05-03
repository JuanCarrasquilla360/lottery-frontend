const MERCADOPAGO_PUBLIC_KEY = "APP_USR-11dd7045-2015-476d-b02c-77f132002d65"; // Reemplazar con tu clave pública
const MERCADOPAGO_TEST = true; // true para modo test, false para producción
const MERCADOPAGO_ACCESS_TOKEN = "APP_USR-3204657237280017-050310-82b927f2652afbd540f3d9246679d6a6-260452014";

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

  // Inicializar el SDK de Mercado Pago
  const mp = new window.MercadoPago(MERCADOPAGO_PUBLIC_KEY, {
    locale: 'es-CO',
  });

  console.log("Procesando pago con Mercado Pago:", paymentData);

  // Crear preferencia de pago
  const createPreference = async () => {
    try {
      // Para pruebas, usamos un correo de prueba específico
      const testEmail = MERCADOPAGO_TEST ? "test_user_19653727@testuser.com" : paymentData.email;

      const payload = {
        items: [
          {
            id: paymentData.reference,
            title: paymentData.productTitle,
            description: paymentData.description,
            quantity: 1,
            unit_price: paymentData.amount,
            currency_id: "COP"  // Siempre usar el formato simple
          }
        ],
        payer: {
          name: paymentData.name,
          surname: paymentData.lastName,
          email: testEmail,  // Usamos el email de prueba
          phone: {
            number: paymentData.phone
          },
          address: {
            street_name: paymentData.address
          },
          identification: {
            type: 'CC',
            number: paymentData.documentId
          }
        },
        external_reference: paymentData.reference,
        notification_url: paymentData.confirmationUrl || '',
        back_urls: {
          success: paymentData.responseUrl,
          failure: paymentData.responseUrl,
          pending: paymentData.responseUrl
        },
        statement_descriptor: "Inversiones TF",  // Descripción que aparecerá en el resumen de la tarjeta
        // Configurar para ambiente de prueba
        test_mode: MERCADOPAGO_TEST
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

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error de Mercado Pago:', errorData);
        throw new Error(`Error al crear preferencia: ${errorData.message || 'Error desconocido'}`);
      }

      const preference = await response.json();
      console.log('Preferencia creada:', preference);

      // Crear botón de pago
      mp.checkout({
        preference: {
          id: preference.id
        },
        render: {
          container: '.mercadopago-button-container',
          label: 'Pagar'
        },
        theme: {
          elementsColor: '#009ee3',
          headerColor: '#009ee3'
        }
      });
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