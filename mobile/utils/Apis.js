import { BASE_URL } from "@env";
export const endpoints = {
  categories: "/api/categories/",

  courses: "/api/courses/",
  courseDetails: (courseId) => `/api/courses/${courseId}/`,
  enrollCourse: (courseId) => `/api/courses/${courseId}/enroll/`,
  instructorCourse: "/api/courses/my-courses/",
  courseStats: (courseId) => `/api/courses/${courseId}/stats/`,

  lessons: (coursesId) => `/api/courses/${coursesId}/lessons/`,
  createLesson: "/api/lessons/",
  lessonLearning: (lessonId) => `/api/lessons/${lessonId}/progress/`,
  lessonDetailed: (lessonId) => `/api/lessons/${lessonId}`,
  enrollLesson: (lessonId) => `/api/lessons/${lessonId}/enroll/`,
  comments: (lessonId) => `/api/lessons/${lessonId}/comments/`,

  register: "/api/users/",
  login: "/api/auth/send-token/",
  current_user: "/api/users/current-user/",
  user_view: "/api/users/statistics/revenue/",
  baseUrl: BASE_URL,

  googleAuth: "/api/auth/url/",
  googleCallback: "/api/auth/callback/",
  googleGetToken: "/api/auth/get-tokens/",
  payment: "/api/payments/",
};
