const nf = new Intl.NumberFormat('vi-VN');

export const money = (n) => `${nf.format(n)}đ`;

/** % giảm giá làm tròn; 0 nếu không có giá cũ cao hơn giá bán. */
export function discountPct(price, oldPrice) {
  if (!oldPrice || oldPrice <= price) return 0;
  return Math.round((1 - price / oldPrice) * 100);
}
