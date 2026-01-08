import { useContext } from "react";
import { CourseContext } from "../utils/contexts/CoursesContext";

export const useCourses = () => {
  return useContext(CourseContext);
};
