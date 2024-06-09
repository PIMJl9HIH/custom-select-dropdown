// src/hooks/useNames.ts
import { useState, useEffect } from "react";
import { fetchNames } from "../api";

interface NameItem {
  objectId: string;
  Name: string;
  createdAt: string;
  updatedAt: string;
}

export const useNames = () => {
  const [items, setItems] = useState<NameItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await fetchNames();
        setItems(data);
      } catch (error) {
        console.error("Failed to fetch names:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return { items, loading };
};
