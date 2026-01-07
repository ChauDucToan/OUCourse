import { useContext } from "react";
import { MyColorContext } from "../utils/contexts/MyColorContext";

export const useColors = () => {
  return useContext(MyColorContext);
};
