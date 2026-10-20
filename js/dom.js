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

const hueOf = (s) => [...s].reduce((n, c) => (n * 31 + c.charCodeAt(0)) % 360, 7);

/** Ảnh sản phẩm: webp nhiều cỡ; chưa có ảnh -> khung màu placeholder. */
export function productImage(base, { alt = '', seed = alt, sizes = '(min-width:900px) 25vw, 50vw', eager = false } = {}) {
  if (!base) {
    const hue = hueOf(seed);
    return h('div', { class: 'ph', role: 'img', 'aria-label': alt, style: { '--h': hue } }, h('span', {}, '🧶'));
  }
  const u = (s) => `/images/products/${base}-${s}.webp`;
  return h('img', {
    src: u(800), srcset: `${u(400)} 400w, ${u(800)} 800w, ${u(1600)} 1600w`, sizes, alt,
    loading: eager ? 'eager' : 'lazy', decoding: 'async',
  });
}

export function logoImage(base, name) {
  if (!base) return h('span', { class: 'logo-mark', 'aria-hidden': 'true' }, '🧶');
  return h('img', {
    class: 'logo-img', alt: name, src: `/images/brand/${base}-256.webp`,
    srcset: `/images/brand/${base}-128.webp 128w, /images/brand/${base}-256.webp 256w, /images/brand/${base}-512.webp 512w`, sizes: '48px',
  });
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
