import { useState, useEffect } from "react";
import { WallpaperProduct } from "../models/types";
import { fetchWallpaperData } from "../mock/data";

export const useWallpaper = (id: string) => {
  const [wallpaper, setWallpaper] = useState<WallpaperProduct | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadWallpaper = async () => {
      try {
        setLoading(true);
        const data = await fetchWallpaperData(id);
        setWallpaper(data);
        setError(null);
      } catch (err) {
        setError("Error al cargar los datos del fondo de pantalla");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadWallpaper();
  }, [id]);

  return { wallpaper, loading, error };
};
