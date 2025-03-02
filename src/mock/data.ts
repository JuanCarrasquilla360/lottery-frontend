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

import screenshotImage from "../assets/Screenshot_1.png";

export const mockWallpaper: WallpaperProduct = {
  id: "ktm-690-smc-r-2025",
  title: "KTM 690 SMC R 2025",
  image: screenshotImage,
  subtitle: "UN JUGUETOTE!",
  progress: 63.2,
  specialNumbers: [
    "34819",
    "67398",
    "66748",
    "93864",
    "27340",
    "64281",
    "29146",
    "18327",
    "27395",
    "16942",
  ],
  basePrice: 1600,
  packages: [
    { quantity: 10, price: 16000 },
    { quantity: 20, price: 32000 },
    { quantity: 30, price: 48000 },
    { quantity: 40, price: 64000 },
    { quantity: 50, price: 80000 },
  ],
};

// Función para simular una carga de API
export const fetchWallpaperData = (id: string): Promise<WallpaperProduct> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockWallpaper);
    }, 800); // Simular tiempo de carga de 800ms
  });
};
