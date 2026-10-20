import { h, copyText, productImage } from './dom.js';
import { money } from './format.js';
import { MAX_QTY } from './cart.js';
import { buildOrderMessage, freeshipProgress, messengerUrl, shippingFor, validateCustomer, zaloUrl } from './order.js';

const CUSTOMER_KEY = 'layla_customer_v1';
const loadCustomer = () => { try { return JSON.parse(localStorage.getItem(CUSTOMER_KEY)) || {}; } catch { return {}; } };
const saveCustomer = (c) => { try { localStorage.setItem(CUSTOMER_KEY, JSON.stringify(c)); } catch { /* bỏ qua */ } };

export function createDrawer({ cart, settings }) {
  const customer = { name: '', phone: '', address: '', note: '', ...loadCustomer() };
  let view = 'cart'; // 'cart' | 'sent'
  let sent = null;   // {channel, url, message, copied}
  let errors = {};
  let lastFocus = null;

  const overlay = h('div', { class: 'overlay', hidden: true, onclick: () => close() });
  const panel = h('aside', { class: 'drawer', role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Giỏ hàng', hidden: true, tabindex: '-1' });
  const el = h('div', { class: 'drawer-root' }, overlay, panel);

  function open() {
    lastFocus = document.activeElement;
    view = 'cart'; errors = {};
    render();
    overlay.hidden = false; panel.hidden = false;
    requestAnimationFrame(() => { overlay.classList.add('on'); panel.classList.add('on'); panel.focus(); });
    document.body.classList.add('lock');
  }
  function close() {
    overlay.classList.remove('on'); panel.classList.remove('on');
    document.body.classList.remove('lock');
    setTimeout(() => { overlay.hidden = true; panel.hidden = true; }, 220);
    lastFocus?.focus?.();
  }
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !panel.hidden) close(); });
  cart.subscribe(() => { if (!panel.hidden && view === 'cart') render(); });

  function field(name, label, props = {}) {
    const input = h(props.tag || 'input', { id: `f-${name}`, name, value: customer[name] ?? '', 'aria-invalid': errors[name] ? 'true' : null, 'aria-describedby': errors[name] ? `e-${name}` : null, ...props.attrs,
      oninput: (e) => { customer[name] = e.target.value; saveCustomer({ name: customer.name, phone: customer.phone, address: customer.address }); } });
    if (props.tag === 'textarea') input.value = customer[name] ?? '';
    return h('div', { class: 'field' }, h('label', { for: `f-${name}` }, label), input,
      errors[name] && h('p', { class: 'err', id: `e-${name}` }, errors[name]));
  }

  function itemRow(it) {
    return h('li', { class: 'line' },
      h('div', { class: 'line-img' }, productImage(it.base, { alt: it.name, seed: it.slug, sizes: '72px' })),
      h('div', { class: 'line-main' },
        h('div', { class: 'line-name' }, it.name),
        it.label && h('div', { class: 'line-label' }, it.label),
        h('div', { class: 'line-bottom' },
          h('div', { class: 'qty', role: 'group', 'aria-label': `Số lượng ${it.name}` },
            h('button', { type: 'button', 'aria-label': 'Giảm', onclick: () => cart.setQty(it.key, it.qty - 1) }, '−'),
            h('span', {}, it.qty),
            h('button', { type: 'button', 'aria-label': 'Tăng', disabled: it.qty >= MAX_QTY, onclick: () => cart.setQty(it.key, it.qty + 1) }, '+')),
          h('strong', {}, money(it.price * it.qty)))),
      h('button', { class: 'line-x', type: 'button', 'aria-label': `Xoá ${it.name}`, onclick: () => cart.remove(it.key) }, '✕'));
  }

  function send(channel) {
    const items = cart.items;
    if (!items.length) return;
    errors = validateCustomer(customer);
    if (Object.keys(errors).length) {
      render();
      panel.querySelector('[aria-invalid="true"]')?.focus();
      return;
    }
    const url = channel === 'zalo' ? zaloUrl(settings.zaloPhone) : messengerUrl(settings.fbUsername);
    if (!url) { errors = { form: 'Shop chưa cấu hình kênh này, vui lòng chọn kênh khác.' }; render(); return; }
    const message = buildOrderMessage({ items, customer, settings, note: customer.note });
    // Phải copy + mở tab ngay trong sự kiện click để trình duyệt không chặn
    const copying = copyText(message);
    window.open(url, '_blank', 'noopener');
    copying.then((copied) => { sent = { channel, url, message, copied }; view = 'sent'; render(); });
  }

  function cartView() {
    const items = cart.items;
    if (!items.length) {
      return [h('div', { class: 'drawer-body empty' }, h('p', { class: 'big' }, '🧶'), h('p', {}, 'Giỏ hàng đang trống.'),
        h('button', { class: 'btn btn-main', type: 'button', onclick: close }, 'Tiếp tục xem sản phẩm'))];
    }
    const sub = cart.subtotal;
    const ship = shippingFor(sub, settings);
    const fp = freeshipProgress(sub, settings);
    return [
      h('div', { class: 'drawer-body' },
        h('div', { class: 'freeship' },
          h('p', {}, fp.free ? '🎉 Đơn của bạn được miễn phí ship!' : `Mua thêm ${money(fp.remaining)} để được miễn phí ship`),
          h('div', { class: 'bar-track', role: 'progressbar', 'aria-valuenow': fp.pct, 'aria-valuemin': 0, 'aria-valuemax': 100 }, h('div', { class: 'bar-fill', style: { width: `${fp.pct}%` } }))),
        h('ul', { class: 'lines' }, items.map(itemRow)),
        h('form', { class: 'cust', novalidate: true, onsubmit: (e) => e.preventDefault() },
          h('h3', {}, 'Thông tin nhận hàng'),
          field('name', 'Họ và tên', { attrs: { autocomplete: 'name', required: true } }),
          field('phone', 'Số điện thoại', { attrs: { autocomplete: 'tel', inputmode: 'tel', required: true } }),
          field('address', 'Địa chỉ nhận hàng', { tag: 'textarea', attrs: { autocomplete: 'street-address', rows: '2', required: true } }),
          field('note', 'Ghi chú (không bắt buộc)', { attrs: { maxlength: '200' } }))),
      h('div', { class: 'drawer-foot' },
        h('dl', { class: 'sum' },
          h('div', {}, h('dt', {}, 'Tạm tính'), h('dd', {}, money(sub))),
          h('div', {}, h('dt', {}, 'Phí ship'), h('dd', {}, ship === 0 ? 'Miễn phí' : money(ship))),
          h('div', { class: 'total' }, h('dt', {}, 'Tổng'), h('dd', {}, money(sub + ship)))),
        errors.form && h('p', { class: 'err' }, errors.form),
        h('div', { class: 'send' },
          h('button', { class: 'btn btn-zalo', type: 'button', onclick: () => send('zalo') }, 'Gửi đơn qua Zalo'),
          h('button', { class: 'btn btn-fb', type: 'button', onclick: () => send('facebook') }, 'Gửi qua Messenger')),
        h('p', { class: 'hint' }, 'Shop chưa thu tiền online. Đơn sẽ được sao chép sẵn, bạn chỉ cần dán vào khung chat để chốt đơn.')),
    ];
  }

  function sentView() {
    const name = sent.channel === 'zalo' ? 'Zalo' : 'Messenger';
    const area = h('textarea', { class: 'msg', readonly: true, rows: '10', 'aria-label': 'Nội dung đơn hàng' });
    area.value = sent.message;
    return [h('div', { class: 'drawer-body sent' },
      h('p', { class: 'big' }, sent.copied ? '✅' : '📋'),
      h('h3', {}, sent.copied ? 'Đã sao chép đơn hàng!' : 'Hãy sao chép đơn hàng bên dưới'),
      h('ol', { class: 'steps' },
        h('li', {}, `Chuyển sang cửa sổ ${name} vừa mở`),
        h('li', {}, sent.copied ? 'Nhấn giữ ô chat → Dán (Paste) → Gửi' : 'Bấm "Sao chép" rồi dán vào ô chat → Gửi'),
        h('li', {}, 'Shop sẽ xác nhận đơn và hẹn giao với bạn')),
      area,
      h('div', { class: 'send' },
        h('button', { class: 'btn btn-ghost', type: 'button', onclick: async (e) => { const ok = await copyText(sent.message); e.target.textContent = ok ? 'Đã sao chép ✓' : 'Hãy chọn và copy thủ công'; } }, 'Sao chép lại'),
        h('a', { class: `btn ${sent.channel === 'zalo' ? 'btn-zalo' : 'btn-fb'}`, href: sent.url, target: '_blank', rel: 'noopener' }, `Mở lại ${name}`)),
      h('button', { class: 'link', type: 'button', onclick: () => { view = 'cart'; render(); } }, '← Quay lại giỏ hàng'),
      h('button', { class: 'link', type: 'button', onclick: () => { cart.clear(); view = 'cart'; sent = null; close(); } }, 'Tôi đã gửi đơn xong, xoá giỏ hàng'))];
  }

  function render() {
    const scroll = panel.querySelector('.drawer-body')?.scrollTop ?? 0;
    const focusId = document.activeElement?.id;
    panel.replaceChildren(
      h('div', { class: 'drawer-head' }, h('h2', {}, view === 'sent' ? 'Gửi đơn hàng' : `Giỏ hàng (${cart.count})`),
        h('button', { class: 'x', type: 'button', 'aria-label': 'Đóng', onclick: close }, '✕')),
      ...(view === 'sent' ? sentView() : cartView()));
    const body = panel.querySelector('.drawer-body');
    if (body) body.scrollTop = scroll;
    if (focusId) { const f = document.getElementById(focusId); if (f && 'selectionStart' in f) { f.focus(); const n = f.value.length; f.setSelectionRange?.(n, n); } }
  }

  return { el, open, close };
}
