// src/hooks/useWallpapers.ts
import { useState, useEffect } from "react";
import axios from "axios";
import {
  WallpaperProduct,
  ProcessedWallpaperProduct,
  WallpaperState,
} from "../models/types";
import { API_URL, TEST_MODE, API_URL_PROD } from "../constants";

export const useWallpaper = (): WallpaperState => {
  const [state, setState] = useState<WallpaperState>({
    wallpaper: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchWallpaper = async () => {
      try {
        setState((prev) => ({ ...prev, loading: true }));

        const response = await axios.get<WallpaperProduct>(TEST_MODE ? API_URL : API_URL_PROD);
        const data = response.data;

        const specialNumbers = Object.keys(data)
          .filter((key) => key.startsWith("special_number_"))
          .map((key) => {
            const id = key.replace("special_number_", "");
            return {
              id,
              number: data[key].number,
              has_winner: data[key].has_winner,
            };
          })
          .sort((a, b) => parseInt(a.id) - parseInt(b.id));

        const processedData: ProcessedWallpaperProduct = {
          lottery_id: data.lottery_id,
          title: data.title,
          description: data.description,
          image: data.image,
          price: data.price,
          stock: data.stock,
          reserved: data.reserved,
          digits: data.digits,
          is_active: data.is_active,
          updated_at: data.updated_at,
          specialNumbers,
        };

        setState({
          wallpaper: processedData,
          loading: false,
          error: null,
        });
      } catch (err) {
        console.error("Error al cargar los datos del fondo de pantalla:", err);
        setState({
          wallpaper: null,
          loading: false,
          error:
            "Error al cargar los datos. Por favor, inténtalo de nuevo más tarde.",
        });
      }
    };

    fetchWallpaper();
  }, []);

  return state;
};
