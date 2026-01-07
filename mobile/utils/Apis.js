import { BASE_URL } from "@env";
export const endpoints = {
  categories: "/api/categories/",

  courses: "/api/courses/",
  courseDetails: (courseId) => `/api/courses/${courseId}/`,
  enrollCourse: (courseId) => `/api/courses/${courseId}/enroll/`,

  lessons: () => `/api/lessons/`,
  lessonDetailed: (lessonId) => `/api/lessons/${lessonId}`,
  enrollLesson: (lessonId) => `/api/lessons/${lessonId}/enroll/`,
  comments: (lessonId) => `/api/lessons/${lessonId}/comments/`,

  register: "/api/users/",
  login: "/o/token/",
  current_user: "/api/users/current-user/",
  baseUrl: BASE_URL,

  googleAuth: "/api/auth/url/",
  googleCallback: "/api/auth/callback/",
};
