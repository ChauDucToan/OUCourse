import { useRef } from "react";
import { createContext } from "react";
import { useCallback } from "react";
import { useState } from "react";
import axiosClient from "../../api/axiosClient";
import { endpoints } from "../Apis";

export const CourseContext = createContext(null);

export const CoursesProvider = ({ children }) => {
  const [coursesError, setCoursesError] = useState(null);

  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const coursesRef = useRef({ data: [], timestamp: 0 });

  const [instructorCourse, setInstructorCourse] = useState([]);
  const [loadingInstructorCourses, setLoadingInstructorCourses] =
    useState(false);

  const [enrollCourses, setEnrollCourses] = useState([]);
  const [loadingEnrollCourses, setLoadingEnrollCourses] = useState(false);

  const addNewCourse = useCallback((newCourseData) => {
    setInstructorCourse((prev) => [newCourseData, ...prev]);
    setCourses((prev) => {
      if (prev.length > 0) {
        return [newCourseData, ...prev];
      }
      return prev;
    });

    if (coursesRef.current) {
      coursesRef.current = { data: [], timestamp: 0 };
    }
  }, []);
  const ensureHomeCourses = useCallback(async (status = "") => {
    const now = Date.now();
    if (
      coursesRef.current.data.length > 0 &&
      now - coursesRef.current.timestamp < 300000
    ) {
      setCourses(coursesRef.current.data);
      return coursesRef.current.data;
    }

    setLoadingCourses(true);
    try {
      const res = await axiosClient.get(endpoints["courses"]);
      const results = res?.data?.results ?? [];
      setCourses(results);
      coursesRef.current = { data: results, timestamp: now };
      return results;
    } catch (error) {
      setCoursesError(error.message);
      setCourses([]);
      throw error;
    } finally {
      setLoadingCourses(false);
    }
  }, []);

  const ensureInstructorCourses = useCallback(async () => {
    setLoadingInstructorCourses(true);
    try {
      const res = await axiosClient.get(endpoints.instructorCourse);
      const results = res.data.results ?? [];
      setInstructorCourse(results);
      return results;
    } catch (error) {
      console.error("Ensure InstructorCourses error: ", error);
      throw error;
    } finally {
      setLoadingInstructorCourses(false);
    }
  }, []);

  const ensureEnrollCourses = useCallback(async () => {
    setLoadingEnrollCourses(true);
    try {
      const res = await axiosClient.get(`${endpoints.courses}?status=ENROLLED`);
      const results = res?.data?.results ?? [];
      setEnrollCourses(results);
      return results;
    } catch (error) {
      console.error("Lỗi fetchEnrolledCourses:", error);
      throw error;
    } finally {
      setLoadingEnrollCourses(false);
    }
  }, []);
  return (
    <CourseContext.Provider
      value={{
        courses,
        setCourses,
        loadingCourses,
        coursesError,
        ensureHomeCourses,

        instructorCourse,
        loadingInstructorCourses,
        ensureInstructorCourses,

        ensureEnrollCourses,
        enrollCourses,
        loadingEnrollCourses,
        setEnrollCourses,

        addNewCourse,
      }}
    >
      {children}
    </CourseContext.Provider>
  );
};
