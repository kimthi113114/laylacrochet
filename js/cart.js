// Giỏ hàng thuần: không truy cập DOM. Storage được truyền vào để test.
// Item: {key, slug, variantId|null, name, label, price, qty, base}
import { findVariant, hasOptions, variantLabel } from './catalog.js';

const KEY = 'layla_cart_v1';
export const MAX_QTY = 20;

export const itemKey = (slug, variantId) => `${slug}|${variantId ?? 0}`;

export function createCart(storage = null) {
  let items = [];
  const listeners = new Set();

  const save = () => {
    try { storage?.setItem(KEY, JSON.stringify(items)); } catch { /* private mode: bỏ qua */ }
  };
  const emit = () => { save(); listeners.forEach((fn) => fn(items)); };

  try {
    const raw = JSON.parse(storage?.getItem(KEY) ?? '[]');
    if (Array.isArray(raw)) items = raw.filter((i) => i && i.key && Number.isInteger(i.qty) && i.qty > 0 && Number.isFinite(i.price));
  } catch { items = []; }

  return {
    get items() { return items; },
    get count() { return items.reduce((n, i) => n + i.qty, 0); },
    get subtotal() { return items.reduce((n, i) => n + i.price * i.qty, 0); },
    subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); },

    add(item, qty = 1) {
      const found = items.find((i) => i.key === item.key);
      if (found) found.qty = Math.min(MAX_QTY, found.qty + qty);
      else items.push({ ...item, qty: Math.min(MAX_QTY, qty) });
      emit();
    },
    setQty(key, qty) {
      const it = items.find((i) => i.key === key);
      if (!it) return;
      if (qty <= 0) items = items.filter((i) => i !== it);
      else it.qty = Math.min(MAX_QTY, qty);
      emit();
    },
    remove(key) { items = items.filter((i) => i.key !== key); emit(); },
    clear() { items = []; emit(); },

    /**
     * Đối chiếu giỏ với dữ liệu hiện hành: cập nhật giá/tên, bỏ món không còn bán hoặc hết hàng.
     * Trả về danh sách thay đổi để báo cho khách.
     */
    reconcile(products) {
      const bySlug = new Map(products.map((p) => [p.slug, p]));
      const notes = [];
      const next = [];
      for (const it of items) {
        const p = bySlug.get(it.slug);
        let price;
        let name = it.name;
        let label = it.label;
        if (!p) { notes.push(`"${it.name}" không còn bán, đã bỏ khỏi giỏ`); continue; }
        if (hasOptions(p)) {
          const v = p.variants.find((x) => x.id === it.variantId);
          if (!v || !v.inStock) { notes.push(`"${it.name}${it.label ? ` (${it.label})` : ''}" đã hết hàng, đã bỏ khỏi giỏ`); continue; }
          price = v.price;
          label = variantLabel(p, v);
        } else {
          if (it.variantId) { notes.push(`"${it.name}" đã thay đổi, vui lòng chọn lại`); continue; }
          price = p.price;
        }
        name = p.name;
        if (price !== it.price) notes.push(`Giá "${name}" đã đổi: ${it.price.toLocaleString('vi-VN')}đ → ${price.toLocaleString('vi-VN')}đ`);
        next.push({ ...it, name, label, price, base: p.images[0]?.base ?? null });
      }
      const changed = notes.length > 0;
      if (changed) { items = next; emit(); }
      return notes;
    },
  };
}

/** Tạo item từ sản phẩm + selection; ném lỗi nếu chưa chọn đủ hoặc hết hàng. */
export function buildItem(p, selection) {
  if (!hasOptions(p)) {
    return { key: itemKey(p.slug, null), slug: p.slug, variantId: null, name: p.name, label: '', price: p.price, base: p.images[0]?.base ?? null };
  }
  const v = findVariant(p, selection);
  if (!v) throw new Error('Vui lòng chọn đầy đủ tuỳ chọn');
  if (!v.inStock) throw new Error('Tuỳ chọn này đã hết hàng');
  return { key: itemKey(p.slug, v.id), slug: p.slug, variantId: v.id, name: p.name, label: variantLabel(p, v), price: v.price, base: v.image ?? p.images[0]?.base ?? null };
}
