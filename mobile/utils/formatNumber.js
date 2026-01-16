export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("vi-VN").format(amount) + " đ";
};
export const roundFloat = (num) => {
  return Math.round((num + Number.EPSILON) * 100) / 100;
};
