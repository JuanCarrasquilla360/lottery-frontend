export interface WallpaperProduct {
  id: string;
  title: string;
  image: string;
  subtitle: string;
  progress: number;
  specialNumbers: string[];
  basePrice: number;
  packages: {
    quantity: number;
    price: number;
  }[];
}

export interface CheckoutData {
  productId: string;
  quantity: number;
  totalPrice: number;
}
