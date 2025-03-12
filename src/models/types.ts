// src/models/types.ts

// Interfaz para los números especiales
export interface SpecialNumber {
  number: number;
  has_winner: boolean;
}

// Interfaz actualizada para el producto
export interface WallpaperProduct {
  lottery_id: string;
  title: string;
  description: string;
  image: string;
  price: number;
  stock: number;
  digits: number;
  is_active: boolean;
  updated_at: string;
  [key: string]: any; // Para manejar los special_number_X dinámicamente
}

// Para uso interno en la aplicación, convertimos los special_numbers a una estructura más fácil de usar
export interface ProcessedWallpaperProduct
  extends Omit<WallpaperProduct, "special_number_1" | "special_number_2"> {
  specialNumbers: Array<{
    id: string;
    number: number;
    has_winner: boolean;
  }>;
}

// Interfaz para el estado del hook useWallpaper
export interface WallpaperState {
  wallpaper: ProcessedWallpaperProduct | null;
  loading: boolean;
  error: string | null;
}

// Interfaz para los datos de checkout
export interface CheckoutData {
  productId: string;
  quantity: number;
  totalPrice: number;
}
