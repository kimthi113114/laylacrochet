import { money } from './format.js';

/** SĐT di động VN: 0xxxxxxxxx hoặc +84/84xxxxxxxxx. Trả về số đã chuẩn hoá dạng 0xxxxxxxxx, hoặc null. */
export function normalizePhone(raw) {
  const s = String(raw ?? '').replace(/[\s.\-()]/g, '');
  const m = /^(?:0|\+?84)([35789]\d{8})$/.exec(s);
  return m ? `0${m[1]}` : null;
}

export function shippingFor(subtotal, settings) {
  if (subtotal <= 0) return 0;
  return subtotal >= settings.freeshipThreshold ? 0 : settings.shippingFee;
}

/** Tiến độ freeship: {free, remaining, pct} */
export function freeshipProgress(subtotal, settings) {
  const t = settings.freeshipThreshold;
  if (!t) return { free: true, remaining: 0, pct: 100 };
  return { free: subtotal >= t, remaining: Math.max(0, t - subtotal), pct: Math.min(100, Math.round((subtotal / t) * 100)) };
}

export function validateCustomer({ name, phone, address }) {
  const errors = {};
  if (!String(name ?? '').trim()) errors.name = 'Vui lòng nhập họ tên';
  if (!normalizePhone(phone)) errors.phone = 'Số điện thoại chưa đúng (VD: 0912345678)';
  if (String(address ?? '').trim().length < 8) errors.address = 'Vui lòng nhập địa chỉ nhận hàng đầy đủ';
  return errors;
}

/** Nội dung tin nhắn đơn hàng (khách dán vào Zalo/Messenger). */
export function buildOrderMessage({ items, customer, settings, note = '' }) {
  const subtotal = items.reduce((n, i) => n + i.price * i.qty, 0);
  const ship = shippingFor(subtotal, settings);
  const lines = [
    `ĐƠN HÀNG - ${settings.shopName}`,
    '',
    `Khách: ${customer.name.trim()}`,
    `SĐT: ${normalizePhone(customer.phone)}`,
    `Địa chỉ: ${customer.address.trim()}`,
    '',
    'Sản phẩm:',
    ...items.map((i, n) => `${n + 1}. ${i.name}${i.label ? ` (${i.label})` : ''} x${i.qty} = ${money(i.price * i.qty)}`),
    '',
    `Tạm tính: ${money(subtotal)}`,
    `Phí ship: ${ship === 0 ? 'Miễn phí' : money(ship)}`,
    `TỔNG: ${money(subtotal + ship)}`,
  ];
  if (note.trim()) lines.push('', `Ghi chú: ${note.trim()}`);
  return lines.join('\n');
}

export function zaloUrl(phone) {
  const digits = String(phone ?? '').replace(/\D/g, '');
  return digits ? `https://zalo.me/${digits}` : null;
}

/** Messenger: username -> m.me/<username>; chấp nhận link facebook.com/m.me đầy đủ. */
export function messengerUrl(fb) {
  const s = String(fb ?? '').trim();
  if (!s) return null;
  if (/^https:\/\//i.test(s)) return /^https:\/\/(www\.|m\.)?(facebook\.com|fb\.com|m\.me)\//i.test(s) ? s : null;
  return /^[A-Za-z0-9.\-_]+$/.test(s) ? `https://m.me/${s}` : null;
}
