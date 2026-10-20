import { icon } from './icons.js';
import { ILLUSTRATIONS, illustrationFor } from './illustrations.js';

// Tạo phần tử an toàn (luôn dùng textContent, không innerHTML với dữ liệu).
export function h(tag, attrs = {}, ...kids) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs ?? {})) {
    if (v == null || v === false) continue;
    if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
    else if (k === 'class') el.className = v;
    else if (k === 'style' && typeof v === 'object') for (const [p, val] of Object.entries(v)) (p.startsWith('--') ? el.style.setProperty(p, val) : (el.style[p] = val));
    else if (v === true) el.setAttribute(k, '');
    else el.setAttribute(k, v);
  }
  for (const kid of kids.flat(Infinity)) if (kid != null && kid !== false) el.append(kid.nodeType ? kid : document.createTextNode(kid));
  return el;
}

/** Như parent.replaceChildren nhưng bỏ qua false/null/undefined (tránh in chữ "false" ra trang). */
export function fill(parent, ...kids) {
  parent.replaceChildren(...kids.flat(Infinity).filter((k) => k != null && k !== false));
}

/** CHỈ dùng với markup tĩnh do mình viết (icon, hình minh hoạ), tuyệt đối không truyền dữ liệu người dùng. */
export function htmlEl(markup) {
  const t = document.createElement('template');
  t.innerHTML = markup.trim();
  return t.content.firstElementChild;
}

export const ic = (name, cls, opts) => htmlEl(icon(name, cls, opts));

// Màu nhãn badge: tên màu (lưu trong DB) -> class Tailwind. Viết đủ chuỗi để Tailwind quét được.
const BADGE = {
  red: 'bg-yarn-red text-white', orange: 'bg-yarn-orange text-white', green: 'bg-yarn-green text-white',
  purple: 'bg-yarn-purple text-white', blue: 'bg-yarn-blue text-white', amber: 'bg-amber-600 text-white',
};
export const badgeClass = (key) => BADGE[key] ?? BADGE.red;

/**
 * Hình sản phẩm: ảnh thật (webp nhiều cỡ) nếu có, nếu không dùng hình SVG minh hoạ.
 * cls: class cho thẻ <img>. illusCls: class điều chỉnh kích thước SVG (vd '[&>svg]:w-44').
 */
export function productVisual(p, { base = null, variantLabel = '', sizes = '(min-width:1024px) 25vw, 50vw', eager = false, cls = 'w-full h-full object-cover', illusCls = '' } = {}) {
  const photo = base ?? p.images?.[0]?.base ?? null;
  if (photo) {
    const u = (s) => `/images/products/${photo}-${s}.webp`;
    return h('img', { class: cls, src: u(480), srcset: `${u(160)} 160w, ${u(480)} 480w, ${u(960)} 960w`, sizes, alt: p.name, loading: eager ? 'eager' : 'lazy', decoding: 'async' });
  }
  const key = illustrationFor(p.illustration || 'clown-big', variantLabel);
  const svg = ILLUSTRATIONS[key] ?? ILLUSTRATIONS['clown-big'];
  const wrap = h('div', { class: `flex items-center justify-center w-full h-full ${illusCls}`, role: 'img', 'aria-label': p.name });
  wrap.innerHTML = svg;
  return wrap;
}

export function logoMark(settings) {
  if (settings.logo) {
    const b = settings.logo;
    return h('img', { class: 'w-full h-full object-contain rounded-[14px] bg-cream-50 p-0.5', alt: settings.shopName, src: `/images/brand/${b}-128.webp`, srcset: `/images/brand/${b}-128.webp 128w, /images/brand/${b}-256.webp 256w`, sizes: '44px' });
  }
  return htmlEl('<svg class="w-5 h-5 sm:w-6 sm:h-6 text-yarn-orange" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M9 3.6c5 3 7 8.4 6 16.8"/><path d="M4.6 9c5.4-1 10.4 1 15.8 6"/><path d="M3.6 15c5-2 9.4-1 14.8 3"/><path d="M18 4l3-2"/></svg>');
}

export async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const ta = h('textarea', { style: { position: 'fixed', opacity: '0' } });
      ta.value = text;
      document.body.append(ta);
      ta.select();
      const ok = document.execCommand('copy');
      ta.remove();
      return ok;
    } catch { return false; }
  }
}
