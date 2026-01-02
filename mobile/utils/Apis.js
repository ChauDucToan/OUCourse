import axios from "axios";

const BASE_URL = "https://thanhduong.pythonanywhere.com/";

export const endpoints = {
  categories: "/categories/",
  courses: "/courses/",
  lessons: (courseId) => `/courses/${courseId}/lessons/`,
  register: "/users/",
  login: "/o/token/",
  current_user: "/users/current-user/",
  "lesson-details": (lessonId) => `/lessons/${lessonId}/`,
  comments: (lessonId) => `/lessons/${lessonId}/comments/`,
};

export const authApis = (token) => {
  return axios.create({
    baseURL: BASE_URL,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export default axios.create({
  baseURL: BASE_URL,
});
