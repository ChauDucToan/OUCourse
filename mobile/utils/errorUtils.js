export const errorConsole = (error, where = "") => {
  console.log(where);
  if (error.response) {
    console.log("Status:", error.response.status);
    console.log("Data lỗi:", error.response.data);
    console.log("Headers:", error.response.headers);
  } else {
    console.error("Lỗi khác:", error.message);
  }
  throw error;
};
