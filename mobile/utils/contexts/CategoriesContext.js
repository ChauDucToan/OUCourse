import { useCallback } from "react";
import { useState } from "react";
import axiosClient from "../../api/axiosClient";
import { endpoints } from "../Apis";
import { createContext } from "react";
import { useRef } from "react";

export const CategoriesContext = createContext(null);

export const CategoriesProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const lastFetchdAtRef = useRef(0);

  const ensureCategories = useCallback(async () => {
    const now = Date.now();
    if (categories.length > 0 && now - lastFetchdAtRef.current < 300000)
      return categories;
    setLoading(true);
    setError(null);
    try {
      const res = await axiosClient.get(endpoints.categories);
      const results = res?.data ?? [];
      setCategories(results);
      lastFetchdAtRef.current = now;
      return results;
    } catch (error) {
      setError(error);
      setCategories([]);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);
  const refreshCategories = useCallback(async () => {
    lastFetchdAtRef.current = 0;
    return ensureCategories();
  }, [ensureCategories]);
  return (
    <CategoriesContext.Provider
      value={{ categories, ensureCategories, refreshCategories }}
    >
      {children}
    </CategoriesContext.Provider>
  );
};
