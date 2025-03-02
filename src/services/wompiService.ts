// src/services/wompiService.ts
import axios from 'axios';

// Wompi configuración para ambiente de desarrollo/sandbox
const WOMPI_PUBLIC_KEY = 'pub_test_XXXXXXXXXXXXXXXXXXXXXXXX'; // Reemplaza con tu clave pública de pruebas
const WOMPI_API_URL = 'https://sandbox.wompi.co/v1';

export interface WompiTransactionData {
  amountInCents: number;
  currency: string;
  customerData: {
    fullName: string;
    phoneNumber: string;
    email: string;
  };
  reference: string;
  customerAddress?: {
    addressLine1: string;
    city: string;
    phoneNumber: string;
    region: string;
  };
  shippingAddress?: {
    addressLine1: string;
    city: string;
    phoneNumber: string;
    region: string;
  };
  redirectUrl?: string;
}

/**
 * Crea una transacción de Wompi y retorna la URL del checkout
 */
export const createWompiTransaction = async (data: WompiTransactionData): Promise<string> => {
  try {
    // En un entorno real, esto se haría desde el backend para mantener segura la clave privada
    // En un ambiente de desarrollo/demo podemos usar la API pública
    const response = await axios.post(`${WOMPI_API_URL}/transactions`, {
      acceptance_token: await getAcceptanceToken(),
      amount_in_cents: data.amountInCents,
      currency: data.currency,
      customer_email: data.customerData.email,
      reference: data.reference,
      customer_data: {
        phone_number: data.customerData.phoneNumber,
        full_name: data.customerData.fullName
      },
      redirect_url: data.redirectUrl || window.location.origin + '/payment-result',
      payment_method: {
        type: 'PAYMENT_LINK'
      }
    }, {
      headers: {
        'Authorization': `Bearer ${WOMPI_PUBLIC_KEY}`
      }
    });

    return response.data.data.payment_link_url;
  } catch (error) {
    console.error('Error creando transacción en Wompi:', error);
    throw error;
  }
};

/**
 * Obtiene el token de aceptación necesario para crear transacciones
 */
export const getAcceptanceToken = async (): Promise<string> => {
  try {
    const response = await axios.get(`${WOMPI_API_URL}/merchants/${WOMPI_PUBLIC_KEY}`);
    return response.data.data.presigned_acceptance.acceptance_token;
  } catch (error) {
    console.error('Error obteniendo token de aceptación de Wompi:', error);
    throw error;
  }
};

/**
 * Verifica el estado de una transacción de Wompi
 */
export const checkTransactionStatus = async (referenceId: string): Promise<any> => {
  try {
    const response = await axios.get(`${WOMPI_API_URL}/transactions/reference/${referenceId}`);
    return response.data.data;
  } catch (error) {
    console.error('Error verificando el estado de la transacción:', error);
    throw error;
  }
};

/**
 * Genera un ID de referencia único para la transacción
 */
export const generateTransactionReference = (): string => {
  const timestamp = new Date().getTime();
  const randomStr = Math.random().toString(36).substring(2, 10);
  return `PANTALLAS-${timestamp}-${randomStr}`;
};