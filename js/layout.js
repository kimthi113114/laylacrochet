import { h, ic, logoMark } from './dom.js';
import { messengerUrl, zaloUrl } from './order.js';
import { createDrawer } from './cart-ui.js';
import { money } from './format.js';

let toastTimer;
export function toast(msg) {
  let el = document.getElementById('toast');
  if (!el) {
    el = h('div', { id: 'toast', role: 'status', 'aria-live': 'polite', class: 'fixed top-16 left-1/2 -translate-x-1/2 z-[70] bg-yarn-dark/95 backdrop-blur-md text-white px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2 text-xs font-bold opacity-0 pointer-events-none transition-all duration-300 -translate-y-2 max-w-[92vw]' },
      ic('circle-check', 'w-4 h-4 text-yarn-yellow shrink-0'), h('span', { id: 'toast-msg' }));
    document.body.append(el);
  }
  el.querySelector('#toast-msg').textContent = msg;
  el.classList.remove('opacity-0', '-translate-y-2'); el.classList.add('opacity-100', 'translate-y-0');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { el.classList.add('opacity-0', '-translate-y-2'); el.classList.remove('opacity-100', 'translate-y-0'); }, 2600);
}

/** Dựng thanh thông báo, header, thanh đặt hàng dưới (mobile), footer, giỏ hàng; trả về {openCart}. */
export function mountLayout({ settings, cart, products, home = false }) {
  const zalo = zaloUrl(settings.zaloPhone);
  const mess = messengerUrl(settings.fbUsername);
  const drawer = createDrawer({ cart, settings, products });
  const openCart = () => drawer.open();
  const anchor = (id) => (home ? `#${id}` : `/#${id}`);

  // ----- thanh thông báo -----
  const announce = h('div', { class: 'bg-yarn-dark text-cream-100 text-[11px] sm:text-xs py-2 px-3 text-center font-medium flex items-center justify-center gap-1.5' },
    h('span', { class: 'inline-block w-2 h-2 rounded-full bg-yarn-yellow animate-ping shrink-0' }),
    h('span', { class: 'truncate' }, settings.freeshipThreshold > 0 ? `🧶 Móc Tay 100% — Freeship Đơn Từ ${money(settings.freeshipThreshold)}!` : '🧶 Móc Tay 100% — Freeship Mọi Đơn Hàng!'));

  // ----- header -----
  const badge = h('span', { class: 'bg-yarn-orange text-white font-extrabold text-[11px] min-w-[20px] h-5 px-1 rounded-full flex items-center justify-center' });
  const cartBtn = h('button', { type: 'button', onclick: openCart, class: 'relative flex items-center gap-2 bg-yarn-dark active:scale-95 text-white px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm shadow-md transition-all' },
    ic('shopping-bag', 'w-4 h-4 text-yarn-yellow'), h('span', { class: 'hidden sm:inline' }, 'Giỏ hàng'), badge);

  const header = h('header', { class: 'sticky top-0 z-30 glass-header border-b border-amber-900/10' },
    h('div', { class: 'max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 h-14 sm:h-20 flex items-center justify-between gap-2' },
      h('a', { href: '/', class: 'flex items-center gap-2.5 group shrink-0', 'aria-label': `${settings.shopName} - trang chủ` },
        h('div', { class: 'w-9 h-9 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-yarn-orange via-yarn-red to-yarn-yellow p-0.5 shadow-sm' },
          h('div', { class: 'w-full h-full bg-cream-50 rounded-[14px] flex items-center justify-center overflow-hidden' }, logoMark(settings))),
        h('div', {},
          h('span', { class: 'font-serif text-lg sm:text-2xl font-bold tracking-tight text-yarn-dark block leading-none' }, settings.shopName),
          h('span', { class: 'text-[9px] sm:text-[11px] uppercase tracking-widest text-yarn-orange font-bold block mt-0.5' }, settings.slogan || 'Handmade Bags'))),
      h('nav', { class: 'hidden md:flex items-center gap-8 text-sm font-semibold text-yarn-muted', 'aria-label': 'Điều hướng chính' },
        h('a', { href: anchor('featured'), class: 'hover:text-yarn-orange transition-colors' }, 'Nổi Bật'),
        h('a', { href: anchor('collection'), class: 'hover:text-yarn-orange transition-colors' }, 'Bộ Sưu Tập'),
        h('a', { href: anchor('how'), class: 'hover:text-yarn-orange transition-colors' }, 'Cách Đặt Hàng'),
        h('a', { href: '#contact', class: 'hover:text-yarn-orange transition-colors' }, 'Liên Hệ')),
      cartBtn));

  // ----- footer -----
  const contactBtn = (href, label, cls) => href && h('a', { href, target: '_blank', rel: 'noopener', class: `${cls} text-white text-xs font-extrabold px-4 py-2.5 rounded-xl active:scale-95 transition-all` }, label);
  const footer = h('footer', { id: 'contact', class: 'bg-yarn-dark text-cream-100 py-10 border-t border-white/10' },
    h('div', { class: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left' },
      h('div', { class: 'flex items-center gap-3' },
        h('div', { class: 'w-8 h-8 rounded-xl bg-yarn-orange flex items-center justify-center font-serif font-bold text-white' }, (settings.shopName || 'L').charAt(0).toUpperCase()),
        h('div', {}, h('p', { class: 'font-serif font-bold text-base' }, settings.shopName), h('p', { class: 'text-[11px] text-cream-200/60' }, settings.slogan || 'Túi móc len đựng điện thoại thủ công Việt Nam'))),
      h('div', { class: 'flex flex-wrap items-center justify-center gap-2.5' },
        contactBtn(zalo, 'Chat Zalo', 'bg-[#0068FF]'), contactBtn(mess, 'Messenger', 'bg-gradient-to-r from-[#00B2FF] to-[#006AFF]')),
      h('span', { class: 'text-xs text-cream-200/80' }, `© ${new Date().getFullYear()} ${settings.shopName}`)));

  // ----- thanh đặt hàng cố định dưới cùng (chỉ điện thoại) -----
  const mBadge = h('span', { class: 'absolute -top-1.5 -right-1.5 bg-yarn-yellow text-yarn-dark font-extrabold text-[10px] w-4 h-4 rounded-full flex items-center justify-center' });
  const mTotal = h('div', { class: 'font-serif font-bold text-sm text-yarn-yellow leading-tight mt-0.5' });
  const quick = (href, label, inner) => href && h('a', { href, target: '_blank', rel: 'noopener', class: 'flex flex-col items-center justify-center px-2.5 py-1 rounded-xl active:bg-blue-50 text-yarn-dark' }, inner, h('span', { class: 'text-[10px] font-bold mt-0.5' }, label));
  const bottomBar = h('div', { class: 'md:hidden fixed bottom-0 inset-x-0 z-40 glass-bottom-nav border-t border-amber-900/10 px-3 py-2 pb-safe' },
    h('div', { class: 'flex items-center justify-between gap-2 max-w-md mx-auto' },
      quick(zalo, 'Chat Zalo', h('div', { class: 'w-6 h-6 rounded-full bg-[#0068FF] text-white flex items-center justify-center text-[10px] font-extrabold shadow-sm' }, 'Z')),
      quick(mess, 'Messenger', h('div', { class: 'w-6 h-6 rounded-full bg-gradient-to-br from-[#00B2FF] to-[#006AFF] text-white flex items-center justify-center' }, ic('message-circle', 'w-3.5 h-3.5', { fill: true }))),
      h('button', { type: 'button', onclick: openCart, class: 'flex-1 bg-gradient-to-r from-yarn-dark to-[#3B2E28] active:scale-95 text-white p-2.5 rounded-2xl shadow-lg flex items-center justify-between transition-all' },
        h('div', { class: 'flex items-center gap-2' },
          h('div', { class: 'relative bg-yarn-orange w-8 h-8 rounded-xl flex items-center justify-center' }, ic('shopping-bag', 'w-4 h-4 text-white'), mBadge),
          h('div', { class: 'text-left' }, h('div', { class: 'text-[10px] text-cream-200 leading-none' }, 'Tổng giỏ hàng'), mTotal)),
        h('div', { class: 'bg-yarn-orange px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1' }, h('span', {}, 'Đặt Hàng'), ic('chevron-up', 'w-3.5 h-3.5')))));

  const sync = () => {
    badge.textContent = cart.count; badge.hidden = cart.count === 0;
    mBadge.textContent = cart.count; mBadge.hidden = cart.count === 0;
    mTotal.textContent = money(cart.subtotal);
    cartBtn.setAttribute('aria-label', `Giỏ hàng, ${cart.count} sản phẩm`);
  };
  cart.subscribe(sync);
  sync();

  const main = document.querySelector('main');
  document.body.insertBefore(announce, main);
  document.body.insertBefore(header, main);
  document.body.append(footer, bottomBar, drawer.el);

  if (settings.favicon) {
    let link = document.querySelector('link[rel=icon]');
    if (!link) { link = h('link', { rel: 'icon' }); document.head.append(link); }
    link.href = `/images/brand/${settings.favicon}-32.png`;
  }
  return { openCart };
}
