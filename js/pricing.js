// Giảm giá: logic thuần (không đụng DOM), chạy ở trình duyệt để mốc bắt đầu/kết thúc đúng giờ mà không cần build lại.
// Quy tắc giảm: {type: 'percent' | 'amount', value, starts?, ends?, label?} (starts/ends là chuỗi ISO).
// Sản phẩm có thể mang `discount`: object = giảm riêng; false = loại khỏi giảm giá toàn shop; không có = theo toàn shop.
export const ROUND = 1000; // làm tròn giá sau giảm về nghìn đồng cho đẹp

/** Quy tắc đang có hiệu lực tại thời điểm `now` (ms), hoặc null. */
export function activeDiscount(d, now = Date.now()) {
  if (!d || !(d.value > 0) || (d.type !== 'percent' && d.type !== 'amount')) return null;
  if (d.starts && now < Date.parse(d.starts)) return null;
  if (d.ends && now >= Date.parse(d.ends)) return null;
  return d;
}

/** Giá sau giảm; không bao giờ cao hơn giá gốc và không thấp hơn 1.000đ. */
export function salePrice(price, d) {
  const raw = d.type === 'percent' ? Math.round((price * (1 - d.value / 100)) / ROUND) * ROUND : price - d.value;
  const v = Math.max(ROUND, raw);
  return v < price ? v : price;
}

/** Trạng thái để hiển thị trong admin: 'off' | 'scheduled' | 'active' | 'expired'. */
export function discountState(d, now = Date.now()) {
  if (!d || !(d.value > 0) || !d.type) return 'off';
  if (d.starts && now < Date.parse(d.starts)) return 'scheduled';
  if (d.ends && now >= Date.parse(d.ends)) return 'expired';
  return 'active';
}

/**
 * Trả về bản sao danh sách sản phẩm đã áp giảm giá: price/oldPrice của sản phẩm và từng tổ hợp.
 * Giá gạch ngang = giá gốc (hoặc giá cũ cao hơn nếu shop đã đặt). Sản phẩm được giảm có `sale: true`.
 */
export function applyDiscounts(products, globalDiscount = null, now = Date.now()) {
  const global = activeDiscount(globalDiscount, now);
  return products.map((p) => {
    const d = p.discount === false ? null : p.discount ? activeDiscount(p.discount, now) : global;
    if (!d) return p;
    const mark = (price, oldPrice) => {
      const sp = salePrice(price, d);
      return sp < price ? { price: sp, oldPrice: Math.max(oldPrice || 0, price), sale: true } : { price, oldPrice, sale: false };
    };
    const base = mark(p.price, p.oldPrice);
    const variants = p.variants.map((v) => { const m = mark(v.price, v.oldPrice); return { ...v, price: m.price, oldPrice: m.oldPrice }; });
    const anySale = base.sale || variants.some((v) => v.oldPrice && v.oldPrice > v.price);
    return anySale ? { ...p, price: base.price, oldPrice: base.oldPrice, variants, sale: true } : p;
  });
}
