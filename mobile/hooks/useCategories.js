import { useContext } from "react";
import { CategoriesContext } from "../utils/contexts/CategoriesContext";

export const useCategories = () => {
  return useContext(CategoriesContext);
};
