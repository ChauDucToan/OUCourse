import { useRef } from "react";
import { createContext } from "react";
import fetchCourse from "../../api/courseApi";
import { useCallback } from "react";
import { useState } from "react";

export const CourseContext = createContext(null);

export const CoursesProvider = ({ children }) => {
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [coursesError, setCoursesError] = useState(null);
  const lastFetchdAtRef = useRef(0);

  const ensureCourses = useCallback(async () => {
    const now = Date.now();
    if (courses.length > 0 && now - lastFetchdAtRef.current < 300000)
      return courses;

    setLoadingCourses(true);
    setCoursesError(null);
    try {
      const res = await fetchCourse();
      const results = res?.data?.results ?? [];
      setCourses(results);
      lastFetchdAtRef.current = now;
      return results;
    } catch (error) {
      setCoursesError(error.message);
      throw error;
    } finally {
      setLoadingCourses(false);
    }
  }, []);

  const refreshCourses = useCallback(async () => {
    lastFetchdAtRef.current = 0;
    return ensureCourses();
  }, [ensureCourses]);

  return (
    <CourseContext.Provider
      value={{
        courses,
        setCourses,
        loadingCourses,
        coursesError,
        ensureCourses,
        refreshCourses,
      }}
    >
      {children}
    </CourseContext.Provider>
  );
};
