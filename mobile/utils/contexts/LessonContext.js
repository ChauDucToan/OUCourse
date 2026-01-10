import { useRef } from "react";
import { useCallback } from "react";
import { useState } from "react";
import { createContext } from "react";
import axiosClient from "../../api/axiosClient";
import { endpoints } from "../Apis";

export const LessonContext = createContext(null);

export const LessonProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [lessons, setLessons] = useState([]);
  const [lesson, setLesson] = useState({});
  const lastAtRef = useRef(0);

  const lessonsRef = useRef([]);
  const lessonRef = useRef({});

  const updateLessons = (newLessons) => {
    setLessons(newLessons);
    lessonsRef.current = newLessons;
  };
  const updateLesson = (newLesson) => {
    setLesson(newLesson);
    lessonRef.current = newLesson;
  };

  const ensureLessons = useCallback(async (id) => {
    const now = Date.now();
    if (lessonsRef.current.length > 0 && now - lastAtRef.current < 300000)
      return lessonsRef.current;
    setLoading(true);
    try {
      const res = await axiosClient.get(endpoints.lessons(id));
      const results = res?.data?.results ?? [];
      updateLessons(results);
      lastAtRef.current = now;
      return results;
    } catch (error) {
      updateLessons([]);

      throw error;
    } finally {
      setLoading(false);
    }
  }, []);
  const refreshLessons = useCallback(
    async (id) => {
      lastAtRef.current = 0;
      return ensureLessons(id);
    },
    [ensureLessons],
  );
  const ensureLessonDetailed = useCallback(async (id) => {
    setLoading(true);
    try {
      const res = await axiosClient.get(endpoints.lessonDetailed(id));
      const results = res?.data ?? {};
      updateLesson(results);
      return results;
    } catch (error) {
      updateLesson({});

      throw error;
    } finally {
      setLoading(false);
    }
  }, []);
  return (
    <LessonContext.Provider
      value={{
        lessons,
        lesson,
        setLessons,
        ensureLessons,
        ensureLessonDetailed,
        refreshLessons,
        loading,
      }}
    >
      {children}
    </LessonContext.Provider>
  );
};
