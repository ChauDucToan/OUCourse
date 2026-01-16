import { useState, useCallback } from "react";
import axiosClient from "../api/axiosClient";
import { endpoints } from "../utils/Apis";
import { errorConsole } from "../utils/errorUtils";

export const useEnrollCourse = () => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loadingEnrolledCourses, setLoadingEnrolledCourses] = useState(false);
  const [enrolledCoursesError, setEnrolledCoursesError] = useState(null);

  const fetchEnrollCourses = useCallback(async (status = "ENROLLED") => {
    setLoadingEnrolledCourses(true);
    setEnrolledCoursesError(null);
    try {
      const res = await axiosClient.get(
        `${endpoints.courses}?status=${status}`,
      );
      const results = res?.data?.results ?? [];
      setEnrolledCourses(results);
      return results;
    } catch (error) {
      setEnrolledCoursesError(error.message);
      errorConsole(error, "Fetch EnrollCourses");
    } finally {
      setLoadingEnrolledCourses(false);
    }
  }, []);

  return {
    enrolledCourses,
    loadingEnrolledCourses,
    enrolledCoursesError,
    fetchEnrollCourses,
  };
};
