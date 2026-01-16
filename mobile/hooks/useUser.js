import { useContext } from "react";
import { MyUserContext } from "../utils/contexts/MyContext";

export const useUser = () => {
  return useContext(MyUserContext);
};
