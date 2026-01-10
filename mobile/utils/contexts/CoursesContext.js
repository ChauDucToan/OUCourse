import { useRef } from "react";
import { createContext } from "react";
import fetchCourse from "../../api/courseApi";
import { useCallback } from "react";
import { useState } from "react";
import { useEffect } from "react";
import axiosClient from "../../api/axiosClient";
import { endpoints } from "../Apis";

export const CourseContext = createContext(null);

export const CoursesProvider = ({ children }) => {
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [coursesError, setCoursesError] = useState(null);
  const lastFetchdAtRef = useRef(0);
  const coursesRef = useRef([]);

  const [instructorCourse, setInstructorCourse] = useState([]);
  const [loadingInstructorCourses, setLoadingInstructorCourses] =
    useState(false);
  const [instructorCoursesError, setInstructorCoursesError] = useState(null);

  const ensureInstructorCourse = useCallback(async () => {
    setLoadingInstructorCourses(true);
    setInstructorCoursesError(null);
    try {
      const res = await axiosClient.get(endpoints.instructorCourse);
      const results = res?.data?.results ?? [];
      setInstructorCourse(results);
      return results;
    } catch (error) {
      console.error("Fetch instructorCourse error:", error);

      setInstructorCoursesError(error.message);
      throw error;
    } finally {
      setLoadingInstructorCourses(false);
    }
  }, []);

  const updateCourse = (newCourses) => {
    setCourses(newCourses);
    coursesRef.current = newCourses;
  };
  const ensureCourses = useCallback(async () => {
    const now = Date.now();
    if (coursesRef.current.length > 0 && now - lastFetchdAtRef.current < 300000)
      return coursesRef.current;

    setLoadingCourses(true);
    setCoursesError(null);
    try {
      const res = await axiosClient.get(endpoints.courses);
      const results = res?.data?.results ?? [];
      updateCourse(results);
      lastFetchdAtRef.current = now;
      return results;
    } catch (error) {
      setCoursesError(error.message);
      updateCourse([]);
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
        instructorCourse,
        ensureInstructorCourse,
        loadingInstructorCourses,
        instructorCoursesError,
      }}
    >
      {children}
    </CourseContext.Provider>
  );
};
