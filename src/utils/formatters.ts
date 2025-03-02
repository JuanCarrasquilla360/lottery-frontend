/**
 * Da formato a un número como moneda colombiana (COP)
 * @param value - El valor a formatear
 * @returns El valor formateado como moneda colombiana
 */
export const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(value);
  };
  
  /**
   * Da formato a un porcentaje
   * @param value - El valor a formatear (0-100)
   * @param decimalPlaces - Número de decimales a mostrar
   * @returns El valor formateado como porcentaje
   */
  export const formatPercentage = (value: number, decimalPlaces: number = 1): string => {
    return `${value.toFixed(decimalPlaces)}%`;
  };