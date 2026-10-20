// Giỏ hàng dạng ngăn kéo (bottom sheet trên điện thoại, trượt từ phải trên desktop). Kiểu dáng y bản thiết kế đầu.
import { h, fill, ic, copyText, productVisual } from './dom.js';
import { money } from './format.js';
import { MAX_QTY } from './cart.js';
import { buildOrderMessage, freeshipProgress, messengerUrl, shippingFor, validateCustomer, zaloUrl } from './order.js';

const CUSTOMER_KEY = 'layla_customer_v1';
const loadCustomer = () => { try { return JSON.parse(localStorage.getItem(CUSTOMER_KEY)) || {}; } catch { return {}; } };
const saveCustomer = (c) => { try { localStorage.setItem(CUSTOMER_KEY, JSON.stringify({ name: c.name, phone: c.phone, address: c.address })); } catch { /* bỏ qua */ } };

const INPUT = 'w-full px-3 py-2.5 rounded-xl border bg-cream-50 text-sm focus:outline-none focus:border-yarn-orange';

export function createDrawer({ cart, settings, products }) {
  const customer = { name: '', phone: '', address: '', note: '', ...loadCustomer() };
  const bySlug = new Map((products ?? []).map((p) => [p.slug, p]));
  let errors = {};
  let lastFocus = null;

  // ----- khung -----
  const backdrop = h('div', { class: 'fixed inset-0 bg-black/60 backdrop-blur-sm z-50 opacity-0 transition-opacity duration-300', hidden: true, onclick: () => close() });
  const drawer = h('aside', {
    role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Giỏ hàng', tabindex: '-1', hidden: true,
    class: 'fixed bottom-0 sm:top-0 right-0 w-full sm:w-[460px] h-[88vh] sm:h-full bg-cream-50 z-50 rounded-t-[2rem] sm:rounded-none shadow-2xl transform translate-y-full sm:translate-y-0 sm:translate-x-full transition-transform duration-300 flex flex-col overflow-hidden outline-none',
  });
  const modal = h('div', { class: 'fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] items-center justify-center p-4 hidden', role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Đã sao chép đơn hàng' });
  const root = h('div', {}, backdrop, drawer, modal);

  // ----- các phần động -----
  const countEl = h('span', { class: 'text-[11px] text-yarn-green font-bold' });
  const bannerEl = h('div', { class: 'px-4 py-2 text-xs font-bold flex items-center justify-center gap-1.5 border-b shrink-0' });
  const itemsEl = h('div', { class: 'space-y-2.5' });
  const previewEl = h('pre', { class: 'text-[11px] font-mono bg-white p-2.5 rounded-xl border border-amber-200 text-yarn-dark whitespace-pre-wrap max-h-32 overflow-y-auto leading-relaxed' });
  const totalEl = h('span', { class: 'font-serif text-2xl font-bold text-yarn-red' });
  const shipEl = h('span', { class: 'text-[10px] text-yarn-green font-bold' });
  const formErr = h('p', { class: 'text-xs font-bold text-yarn-red', role: 'alert' });
  const errEls = {};

  function field(name, label, placeholder, { type = 'text', required = true, autocomplete } = {}) {
    const input = h('input', { id: `cust-${name}`, type, placeholder, autocomplete, maxlength: name === 'note' ? '200' : '300',
      class: `${INPUT} border-amber-900/15`, value: customer[name] ?? '',
      oninput: (e) => { customer[name] = e.target.value; saveCustomer(customer); if (errors[name]) { delete errors[name]; showErrors(); } updatePreview(); } });
    input.value = customer[name] ?? '';
    errEls[name] = h('p', { class: 'text-[11px] font-bold text-yarn-red mt-1', id: `err-${name}`, role: 'alert' });
    return h('div', {}, h('label', { for: `cust-${name}`, class: 'block text-[11px] font-bold text-yarn-dark mb-1' }, label, required && ' *'), input, errEls[name]);
  }

  const fName = field('name', 'Tên người nhận', 'VD: Nguyễn Thảo', { autocomplete: 'name' });
  const fPhone = field('phone', 'Số điện thoại', 'VD: 0909 xxx xxx', { type: 'tel', autocomplete: 'tel' });
  const fAddr = field('address', 'Địa chỉ nhận hàng', 'Số nhà, tên đường, Phường/Xã, Quận/Huyện...', { autocomplete: 'street-address' });
  const fNote = field('note', 'Ghi chú (không bắt buộc)', 'VD: Đựng iPhone 16 Pro Max, gói quà tặng...', { required: false });

  const checkout = h('div', { class: 'space-y-4' },
    h('div', { class: 'bg-white p-4 rounded-2xl border border-amber-900/10 space-y-3 shadow-sm' },
      h('div', { class: 'flex items-center justify-between border-b border-amber-900/10 pb-2' },
        h('span', { class: 'font-serif font-bold text-sm text-yarn-dark flex items-center gap-1.5' }, ic('map-pin', 'w-4 h-4 text-yarn-orange'), h('span', {}, 'Thông Tin Giao Hàng')),
        h('span', { class: 'text-[10px] bg-green-100 text-yarn-green px-2 py-0.5 rounded-full font-bold' }, 'Tự động điền đơn')),
      h('div', { class: 'grid grid-cols-1 sm:grid-cols-2 gap-2.5' }, fName, fPhone), fAddr, fNote),
    h('div', { class: 'bg-amber-50/90 border border-amber-300/80 rounded-2xl p-3.5 space-y-2' },
      h('div', { class: 'flex items-center justify-between' },
        h('span', { class: 'text-xs font-extrabold text-yarn-orange flex items-center gap-1.5' }, ic('sparkles', 'w-4 h-4'), h('span', {}, 'Tin Nhắn Đơn Hàng Tự Động')),
        h('button', { type: 'button', class: 'text-[11px] font-extrabold bg-white px-2.5 py-1 rounded-lg border border-amber-300 text-yarn-dark active:scale-95 flex items-center gap-1',
          onclick: async (e) => { const ok = await copyText(previewText()); const s = e.currentTarget.querySelector('span'); s.textContent = ok ? 'Đã copy ✓' : 'Hãy copy thủ công'; setTimeout(() => (s.textContent = 'Copy'), 1800); } },
          ic('copy', 'w-3 h-3 text-yarn-orange'), h('span', {}, 'Copy'))),
      previewEl));

  const body = h('div', { class: 'flex-1 overflow-y-auto p-4 space-y-4' }, itemsEl, checkout);

  const channelBtn = (label, cls, iconName, channel) => h('button', { type: 'button', onclick: () => send(channel),
    class: `${cls} active:scale-95 text-white font-extrabold py-3.5 px-3 rounded-2xl shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 text-xs sm:text-sm transition-all` },
    ic(iconName, 'w-4 h-4', { fill: iconName === 'message-circle' }), h('span', {}, label));

  const footer = h('div', { class: 'p-4 bg-white border-t border-amber-900/10 space-y-2.5 pb-safe shrink-0 shadow-[0_-10px_25px_rgba(0,0,0,0.04)]' },
    h('div', { class: 'flex items-center justify-between' },
      h('div', {}, h('span', { class: 'text-xs text-yarn-muted font-semibold block' }, 'Tổng thanh toán:'), shipEl), totalEl),
    formErr,
    h('div', { class: 'grid grid-cols-2 gap-2.5' },
      channelBtn('Gửi Đơn Qua Zalo', 'bg-[#0068FF]', 'message-circle', 'zalo'),
      channelBtn('Gửi Qua Messenger', 'bg-gradient-to-r from-[#00B2FF] to-[#006AFF]', 'send', 'facebook')),
    h('p', { class: 'text-[10px] text-yarn-muted text-center' }, 'Shop chưa thu tiền online. Đơn được sao chép sẵn, bạn chỉ cần dán vào khung chat để chốt đơn.'));

  fill(drawer,
    h('div', { class: 'sm:hidden pt-2.5 pb-1 bg-white flex justify-center', onclick: () => close() }, h('div', { class: 'w-12 h-1.5 rounded-full bg-amber-900/20' })),
    h('div', { class: 'px-4 py-3 sm:p-5 bg-white border-b border-amber-900/10 flex items-center justify-between shrink-0' },
      h('div', { class: 'flex items-center gap-2.5' },
        h('div', { class: 'w-9 h-9 rounded-xl bg-amber-100 text-yarn-orange flex items-center justify-center' }, ic('shopping-bag', 'w-5 h-5')),
        h('div', {}, h('h3', { class: 'font-serif font-bold text-base sm:text-lg text-yarn-dark leading-none' }, 'Giỏ Hàng & Chốt Đơn Nhanh'), countEl)),
      h('button', { type: 'button', 'aria-label': 'Đóng giỏ hàng', class: 'p-2 rounded-full bg-cream-100 text-yarn-dark active:scale-90', onclick: () => close() }, ic('x', 'w-5 h-5'))),
    bannerEl, body, footer);

  // ----- logic -----
  const previewCustomer = () => ({
    name: customer.name.trim() || '(chưa nhập)', phone: customer.phone.trim() || '(chưa nhập)', address: customer.address.trim() || '(chưa nhập)',
  });
  const previewText = () => buildOrderMessage({ items: cart.items, customer: previewCustomer(), settings, note: customer.note });
  function updatePreview() { previewEl.textContent = cart.items.length ? previewText() : 'Giỏ hàng đang trống.'; }

  function showErrors() {
    for (const k of ['name', 'phone', 'address', 'note']) {
      errEls[k].textContent = errors[k] ?? '';
      const input = document.getElementById(`cust-${k}`);
      if (input) { input.classList.toggle('border-yarn-red', !!errors[k]); input.classList.toggle('border-amber-900/15', !errors[k]); if (errors[k]) input.setAttribute('aria-invalid', 'true'); else input.removeAttribute('aria-invalid'); }
    }
    formErr.textContent = errors.form ?? '';
  }

  function renderCart() {
    const items = cart.items;
    const sub = cart.subtotal;
    const ship = shippingFor(sub, settings);
    const fp = freeshipProgress(sub, settings);
    countEl.textContent = `Đang có ${cart.count} sản phẩm`;
    totalEl.textContent = money(sub + ship);
    shipEl.textContent = items.length ? (ship === 0 ? 'Đã gồm miễn phí ship' : `Đã gồm phí ship ${money(ship)}`) : '';

    bannerEl.className = `px-4 py-2 text-xs font-bold flex items-center justify-center gap-1.5 border-b shrink-0 ${fp.free ? 'bg-green-100 text-green-900 border-green-200' : 'bg-amber-100/80 text-yarn-dark border-amber-200'}`;
    bannerEl.hidden = !items.length;
    fill(bannerEl, fp.free ? ['🎉 ', h('span', {}, 'Đơn của bạn được ', h('strong', {}, 'Miễn Phí Ship!'))]
      : ['🎁 ', h('span', {}, 'Mua thêm ', h('strong', {}, money(fp.remaining)), ' để được ', h('strong', {}, 'Freeship!'))]);

    checkout.hidden = !items.length;
    footer.hidden = !items.length;

    if (!items.length) {
      fill(itemsEl, h('div', { class: 'text-center py-8 bg-white rounded-2xl border border-dashed border-amber-900/20' },
        h('p', { class: 'text-3xl mb-1' }, '🧶'),
        h('p', { class: 'text-xs font-bold text-yarn-muted' }, 'Giỏ hàng đang trống'),
        h('p', { class: 'text-[11px] text-yarn-muted/70 mt-0.5' }, 'Hãy chọn một mẫu túi móc len nhé!'),
        h('button', { type: 'button', onclick: () => close(), class: 'mt-3 bg-yarn-dark text-white text-xs font-bold px-4 py-2 rounded-xl' }, 'Tiếp tục xem sản phẩm')));
    } else {
      fill(itemsEl, items.map((it) => {
        const p = bySlug.get(it.slug);
        return h('div', { class: 'bg-white p-3 rounded-2xl border border-amber-900/10 flex items-center justify-between gap-2.5 shadow-sm' },
          p && h('div', { class: 'w-14 h-14 shrink-0 rounded-xl bg-gradient-to-b from-cream-100 to-cream-200/60 overflow-hidden' },
            productVisual(p, { base: it.base, variantLabel: it.label, sizes: '56px', illusCls: '[&>svg]:w-12 [&>svg]:h-14 [&>svg]:max-w-none' })),
          h('div', { class: 'flex-1 min-w-0' },
            h('h4', { class: 'font-bold text-xs text-yarn-dark leading-snug truncate' }, it.name),
            it.label && h('span', { class: 'text-[11px] text-yarn-muted block truncate' }, it.label),
            h('span', { class: 'text-xs font-extrabold text-yarn-red' }, money(it.price))),
          h('div', { class: 'flex items-center gap-2 bg-cream-100 rounded-xl p-1 shrink-0', role: 'group', 'aria-label': `Số lượng ${it.name}` },
            h('button', { type: 'button', 'aria-label': 'Giảm', onclick: () => cart.setQty(it.key, it.qty - 1), class: 'w-7 h-7 rounded-lg bg-white text-yarn-dark font-extrabold text-xs flex items-center justify-center active:bg-yarn-red active:text-white' }, '−'),
            h('span', { class: 'text-xs font-extrabold w-4 text-center' }, it.qty),
            h('button', { type: 'button', 'aria-label': 'Tăng', disabled: it.qty >= MAX_QTY, onclick: () => cart.setQty(it.key, it.qty + 1), class: 'w-7 h-7 rounded-lg bg-white text-yarn-dark font-extrabold text-xs flex items-center justify-center active:bg-yarn-green active:text-white disabled:opacity-40' }, '+')));
      }));
    }
    updatePreview();
  }

  function showModal({ channel, url, message, copied }) {
    const name = channel === 'zalo' ? 'Zalo' : 'Messenger';
    const area = !copied && h('textarea', { readonly: true, rows: '8', 'aria-label': 'Nội dung đơn hàng', class: 'w-full text-[11px] font-mono border border-amber-300 rounded-xl p-2.5 bg-white text-left' });
    if (area) area.value = message;
    fill(modal, h('div', { class: 'bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-amber-900/10 text-center space-y-4 animate-pop max-h-[92vh] overflow-y-auto' },
      h('div', { class: 'w-14 h-14 rounded-2xl bg-green-100 text-yarn-green flex items-center justify-center mx-auto' }, ic('check-check', 'w-8 h-8')),
      h('h3', { class: 'font-serif font-bold text-2xl text-yarn-dark' }, copied ? 'Đã Copy Đơn Hàng!' : 'Hãy Copy Đơn Hàng'),
      h('p', { class: 'text-xs sm:text-sm text-yarn-muted leading-relaxed' },
        copied ? ['Chi tiết giỏ hàng & địa chỉ của bạn đã được ', h('strong', {}, 'sao chép tự động'), `. Khi ${name} mở lên, bạn chỉ cần chạm `, h('strong', {}, 'Dán (Paste)'), ' vào ô tin nhắn và bấm Gửi cho shop nhé!']
          : `Trình duyệt không cho tự sao chép. Hãy chọn và copy nội dung dưới đây, rồi dán vào ${name}.`),
      area,
      h('div', { class: 'bg-cream-100 p-3 rounded-xl text-left' },
        h('p', { class: 'text-xs font-bold text-yarn-orange mb-1' }, `Kết nối ${name} của shop`),
        h('p', { class: 'text-[11px] text-yarn-muted' }, 'Bấm nút bên dưới nếu điện thoại chưa tự chuyển trang:')),
      h('div', { class: 'flex flex-col gap-2 pt-1' },
        h('a', { href: url, target: '_blank', rel: 'noopener', class: 'w-full bg-yarn-dark active:bg-yarn-orange text-white font-extrabold py-3.5 px-4 rounded-2xl text-sm flex items-center justify-center gap-2' },
          h('span', {}, 'Mở App Chat & Dán Đơn Ngay'), ic('external-link', 'w-4 h-4')),
        !copied && h('button', { type: 'button', class: 'py-2 text-yarn-dark font-bold text-xs', onclick: async (e) => { e.currentTarget.textContent = (await copyText(message)) ? 'Đã copy ✓' : 'Hãy chọn và copy thủ công'; } }, 'Thử copy lại'),
        h('button', { type: 'button', class: 'py-2 text-yarn-muted font-bold text-xs', onclick: closeModal }, 'Quay lại trang web'),
        h('button', { type: 'button', class: 'py-1 text-yarn-orange underline text-xs', onclick: () => { cart.clear(); closeModal(); close(); } }, 'Tôi đã gửi đơn xong, xoá giỏ hàng'))));
    modal.classList.remove('hidden'); modal.classList.add('flex');
    modal.querySelector('a')?.focus();
  }
  function closeModal() { modal.classList.add('hidden'); modal.classList.remove('flex'); }

  function send(channel) {
    if (!cart.items.length) return;
    errors = validateCustomer(customer);
    if (Object.keys(errors).length) {
      showErrors();
      drawer.querySelector('[aria-invalid="true"]')?.focus();
      return;
    }
    const url = channel === 'zalo' ? zaloUrl(settings.zaloPhone) : messengerUrl(settings.fbUsername);
    if (!url) { errors = { form: 'Shop chưa cấu hình kênh này, vui lòng chọn kênh còn lại.' }; showErrors(); return; }
    showErrors();
    const message = buildOrderMessage({ items: cart.items, customer, settings, note: customer.note });
    // Phải copy + mở tab ngay trong sự kiện click để trình duyệt không chặn
    const copying = copyText(message);
    window.open(url, '_blank', 'noopener');
    copying.then((copied) => showModal({ channel, url, message, copied }));
  }

  function open() {
    lastFocus = document.activeElement;
    errors = {}; showErrors(); renderCart();
    backdrop.hidden = false; drawer.hidden = false;
    requestAnimationFrame(() => {
      backdrop.classList.remove('opacity-0'); backdrop.classList.add('opacity-100');
      drawer.classList.remove('translate-y-full', 'sm:translate-x-full'); drawer.classList.add('translate-y-0', 'sm:translate-x-0');
      drawer.focus();
    });
    document.body.style.overflow = 'hidden';
  }
  function close() {
    backdrop.classList.add('opacity-0'); backdrop.classList.remove('opacity-100');
    drawer.classList.add('translate-y-full', 'sm:translate-x-full'); drawer.classList.remove('translate-y-0', 'sm:translate-x-0');
    document.body.style.overflow = '';
    setTimeout(() => { backdrop.hidden = true; drawer.hidden = true; }, 300);
    lastFocus?.focus?.();
  }
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (!modal.classList.contains('hidden')) closeModal(); else if (!drawer.hidden) close();
  });
  cart.subscribe(() => { if (!drawer.hidden) renderCart(); });
  renderCart();

  return { el: root, open, close };
}
