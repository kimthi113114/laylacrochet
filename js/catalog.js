// Logic thuần về sản phẩm / tuỳ chọn / tổ hợp (không đụng DOM, dễ test).
// Product: {slug,name,price,oldPrice,options:[{name,values:[{id,label,swatch}]}],variants:[{id,values:[id...],price,oldPrice,image,inStock}],images:[{base}]}
// selection: mảng giá trị đã chọn theo thứ tự nhóm (undefined = chưa chọn).

export const hasOptions = (p) => p.options.length > 0 && p.variants.length > 0;

const sameAt = (v, selection, skip = -1) =>
  selection.every((id, i) => i === skip || id === undefined || v.values[i] === id);

/** Khoảng giá hiển thị ngoài lưới: dựa trên các tổ hợp còn hàng (nếu có tuỳ chọn). */
export function priceRange(p) {
  if (!hasOptions(p)) return { min: p.price, max: p.price, oldPrice: p.oldPrice, soldOut: false };
  const live = p.variants.filter((v) => v.inStock);
  if (!live.length) return { min: p.price, max: p.price, oldPrice: p.oldPrice, soldOut: true };
  const prices = live.map((v) => v.price);
  const min = Math.min(...prices);
  const cheapest = live.find((v) => v.price === min);
  return { min, max: Math.max(...prices), oldPrice: cheapest.oldPrice, soldOut: false };
}

/** Tổ hợp khớp hoàn toàn selection (đủ mọi nhóm); null nếu chưa chọn đủ hoặc không tồn tại. */
export function findVariant(p, selection) {
  if (!hasOptions(p) || selection.length < p.options.length || selection.some((s) => s === undefined)) return null;
  return p.variants.find((v) => sameAt(v, selection)) ?? null;
}

/** Giá trị `valueId` của nhóm `optIdx` còn chọn được không (có tổ hợp còn hàng khớp các lựa chọn khác)? */
export function isAvailable(p, selection, optIdx, valueId) {
  const probe = [...selection];
  probe[optIdx] = valueId;
  return p.variants.some((v) => v.inStock && sameAt(v, probe));
}

/** Tên nhóm còn thiếu lựa chọn, dùng cho thông báo "Vui lòng chọn ...". */
export function missingOptions(p, selection) {
  return p.options.filter((_, i) => selection[i] === undefined).map((o) => o.name);
}

export function variantLabel(p, variant) {
  if (!variant) return '';
  return variant.values.map((id, i) => p.options[i].values.find((v) => v.id === id)?.label ?? '').join(' / ');
}

/** Ảnh riêng của một giá trị tuỳ chọn (vd ảnh màu Đỏ) theo id, hoặc null. */
const valueImage = (p, optIdx, valueId) => p.options[optIdx]?.values.find((v) => v.id === valueId)?.image ?? null;

/**
 * Ảnh nên hiện theo lựa chọn hiện tại: ảnh của giá trị vừa bấm (lastIdx) nếu có, rồi tới ảnh của
 * bất kỳ giá trị đã chọn nào, rồi ảnh riêng của tổ hợp. null = dùng ảnh sản phẩm.
 */
export function selectionImage(p, selection, lastIdx = -1) {
  if (lastIdx >= 0 && selection[lastIdx] !== undefined) {
    const img = valueImage(p, lastIdx, selection[lastIdx]);
    if (img) return img;
  }
  for (let i = 0; i < selection.length; i++) {
    if (selection[i] === undefined) continue;
    const img = valueImage(p, i, selection[i]);
    if (img) return img;
  }
  return findVariant(p, selection)?.image ?? null;
}

/** Ảnh đại diện của một tổ hợp: ảnh tổ hợp > ảnh giá trị > ảnh đầu của sản phẩm. */
export function variantImage(p, variant) {
  if (!variant) return p.images[0]?.base ?? null;
  if (variant.image) return variant.image;
  for (let i = 0; i < variant.values.length; i++) {
    const img = valueImage(p, i, variant.values[i]);
    if (img) return img;
  }
  return p.images[0]?.base ?? null;
}

/** Chọn sẵn nếu mỗi nhóm chỉ có 1 giá trị. */
export function defaultSelection(p) {
  return p.options.map((o) => (o.values.length === 1 ? o.values[0].id : undefined));
}
