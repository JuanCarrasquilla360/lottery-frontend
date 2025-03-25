// src/hooks/useWallpapers.ts
import { useState, useEffect } from "react";
import axios from "axios";
import {
  WallpaperProduct,
  ProcessedWallpaperProduct,
  WallpaperState,
} from "../models/types";

// URL base para las peticiones a la API
const API_URL =
  "https://rotd20rcv9.execute-api.us-east-2.amazonaws.com/prod/lottery";

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

        // Realizamos la petición GET con axios
        const response = await axios.get<WallpaperProduct>(API_URL);
        const data = response.data;

        // Procesamos los números especiales de forma dinámica
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
          .sort((a, b) => parseInt(a.id) - parseInt(b.id)); // Ordenar por ID

        // Construimos el objeto procesado
        const processedData: ProcessedWallpaperProduct = {
          lottery_id: data.lottery_id,
          title: data.title,
          description: data.description,
          image: data.image,
          price: data.price,
          stock: data.stock,
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
