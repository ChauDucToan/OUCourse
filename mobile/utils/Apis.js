export const endpoints = {
  categories: "/categories/",

  courses: "/courses/",
  courseDetails: (courseId) => `/courses/${courseId}/`,
  enrollCourse: (courseId) => `/courses/${courseId}/enroll/`,

  lessons: () => `/lessons/`,
  lessonDetailed: (lessonId) => `/lessons/${lessonId}`,
  enrollLesson: (lessonId) => `/lessons/${lessonId}/enroll/`,
  comments: (lessonId) => `/lessons/${lessonId}/comments/`,

  register: "/users/",
  login: "/o/token/",
  current_user: "/users/current-user/",
};
