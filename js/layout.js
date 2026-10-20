import { h, ic, brandMark } from './dom.js';
import { messengerUrl, zaloUrl } from './order.js';
import { createDrawer } from './cart-ui.js';
import { money } from './format.js';
import { listingUrl } from './listing.js';

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
export function mountLayout({ settings, cart, products, categories = [], home = false, back = null }) {
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
        brandMark(settings, 'h-11 sm:h-16'),
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
  const phoneText = (settings.zaloPhone || '').replace(/(\d{4})(\d{3})(\d{3})$/, '$1 $2 $3');
  const colTitle = (t) => h('h4', { class: 'text-[11px] font-extrabold uppercase tracking-widest text-yarn-yellow mb-3' }, t);
  const flink = 'text-sm text-cream-200/80 hover:text-white transition-colors';
  const countOf = (slug) => products.filter((p) => p.category === slug).length;
  const contactBtn = (href, label, cls) => href && h('a', { href, target: '_blank', rel: 'noopener', class: `${cls} flex-1 sm:flex-none text-center text-white text-sm font-extrabold px-5 py-3 rounded-2xl active:scale-95 transition-all shadow-lg` }, label);
  const shipNote = settings.freeshipThreshold > 0
    ? `Freeship đơn từ ${money(settings.freeshipThreshold)}${settings.shippingFee ? `, dưới mức này phí ship ${money(settings.shippingFee)}` : ''}.`
    : 'Freeship mọi đơn hàng.';

  // Nút về đầu trang: mũi tên nảy nhẹ; khi bấm thì "phóng" lên cùng lúc trang cuộn mượt
  const toTop = h('button', { type: 'button', 'aria-label': 'Về đầu trang', class: 'to-top group inline-flex items-center gap-2.5 pl-1.5 pr-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-cream-100 text-xs font-bold',
    onclick: (e) => {
      const btn = e.currentTarget;
      btn.classList.remove('to-top-go'); void btn.offsetWidth; btn.classList.add('to-top-go');
      scrollTo({ top: 0, behavior: 'smooth' });
    } },
    h('span', { class: 'to-top-ring w-9 h-9 rounded-full bg-yarn-orange text-white flex items-center justify-center shadow-lg' }, ic('chevron-up', 'to-top-arrow w-4 h-4')),
    'Về đầu trang');

  const footer = h('footer', { id: 'contact', class: 'bg-yarn-dark text-cream-100' },
    h('div', { class: 'stitch-border opacity-40' }),
    h('div', { class: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 pb-28 md:pb-10' },
      h('div', { class: 'grid grid-cols-1 md:grid-cols-12 gap-9 md:gap-8' },
        // Thương hiệu
        h('div', { class: 'md:col-span-5 space-y-4' },
          h('a', { href: '/', class: 'inline-flex items-center gap-3', 'aria-label': `${settings.shopName} - trang chủ` },
            brandMark(settings, 'h-16 sm:h-20 brightness-125'),
            h('div', {}, h('p', { class: 'font-serif text-xl sm:text-2xl font-bold text-white leading-none' }, settings.shopName),
              h('p', { class: 'text-[10px] uppercase tracking-widest text-yarn-orange font-bold mt-1' }, settings.slogan || 'Handmade Bags'))),
          h('p', { class: 'text-sm text-cream-200/70 leading-relaxed max-w-sm' }, 'Túi và đồ len móc thủ công, từng mũi len được hoàn thiện bằng tay. Chọn mẫu, thêm vào giỏ và chốt đơn nhanh qua Zalo hoặc Messenger.'),
          h('div', { class: 'flex gap-2.5 max-w-sm' }, contactBtn(zalo, 'Chat Zalo', 'bg-[#0068FF]'), contactBtn(mess, 'Messenger', 'bg-gradient-to-r from-[#00B2FF] to-[#006AFF]'))),
        // Danh mục
        h('div', { class: 'md:col-span-3' }, colTitle('Danh mục'),
          h('ul', { class: 'space-y-2' },
            h('li', {}, h('a', { href: '/#collection', class: flink }, `Tất cả sản phẩm (${products.length})`)),
            categories.map((c) => h('li', {}, h('a', { href: `${listingUrl({ cat: c.slug })}#collection`, class: flink }, `${c.name} (${countOf(c.slug)})`))))),
        // Liên hệ + giao hàng
        h('div', { class: 'md:col-span-4' }, colTitle('Liên hệ & giao hàng'),
          h('ul', { class: 'space-y-2.5 text-sm text-cream-200/80' },
            phoneText && h('li', { class: 'flex items-start gap-2' }, h('span', { 'aria-hidden': 'true' }, '📞'), h('span', {}, 'Zalo / ĐT: ', h('a', { href: `tel:${settings.zaloPhone}`, class: 'text-white font-bold hover:text-yarn-yellow' }, phoneText))),
            h('li', { class: 'flex items-start gap-2' }, h('span', { 'aria-hidden': 'true' }, '🚚'), h('span', {}, shipNote)),
            h('li', { class: 'flex items-start gap-2' }, h('span', { 'aria-hidden': 'true' }, '💬'), h('span', {}, 'Đặt hàng: bỏ vào giỏ, bấm gửi qua Zalo hoặc Messenger, shop sẽ xác nhận với bạn.'))))),
      h('div', { class: 'mt-9 pt-5 border-t border-white/10 flex flex-col-reverse sm:flex-row items-center justify-between gap-4 text-xs text-cream-200/60' },
        h('span', {}, `© ${new Date().getFullYear()} ${settings.shopName}. Handmade tại Việt Nam 🧶`),
        toTop)));

  // ----- thanh đặt hàng cố định dưới cùng (chỉ điện thoại) -----
  // Trang chi tiết: nút Quay về ở ngoài cùng bên trái (về đúng trang danh sách chứa sản phẩm)
  const backQuick = back && h('a', { href: back, 'aria-label': 'Quay về danh sách sản phẩm', class: 'to-back flex flex-col items-center justify-center px-1.5 py-1 rounded-xl active:bg-amber-50 text-yarn-dark',
    onclick: (e) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button) return;
      e.preventDefault();
      // Có lịch sử cùng trang web thì lùi lại (giữ nguyên vị trí cuộn), không thì đi tới danh sách
      if (history.length > 1 && document.referrer.startsWith(location.origin)) history.back(); else location.href = back;
    } },
    h('span', { class: 'to-back-icon w-6 h-6 rounded-full bg-yarn-dark text-white flex items-center justify-center' }, ic('arrow-left', 'w-3.5 h-3.5')),
    h('span', { class: 'text-[10px] font-bold mt-0.5' }, 'Quay về'));
  const mBadge = h('span', { class: 'absolute -top-1.5 -right-1.5 bg-yarn-yellow text-yarn-dark font-extrabold text-[10px] w-4 h-4 rounded-full flex items-center justify-center' });
  const mTotal = h('div', { class: 'font-serif font-bold text-sm text-yarn-yellow leading-tight mt-0.5' });
  // Liên hệ: cuộn mượt xuống cuối trang, nơi footer có nút Zalo / Messenger
  const contactQuick = h('button', { type: 'button', onclick: () => scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' }),
    class: 'flex flex-col items-center justify-center px-1.5 py-1 rounded-xl active:bg-amber-50 text-yarn-dark' },
    h('div', { class: 'w-6 h-6 rounded-full bg-yarn-orange text-white flex items-center justify-center' }, ic('message-circle', 'w-3.5 h-3.5', { fill: true })),
    h('span', { class: 'text-[10px] font-bold mt-0.5' }, 'Liên hệ'));
  const mCart = h('button', { type: 'button', onclick: openCart, class: 'flex-1 bg-gradient-to-r from-yarn-dark to-[#3B2E28] active:scale-95 text-white p-2.5 rounded-2xl shadow-lg flex items-center justify-between transition-all' },
        h('div', { class: 'flex items-center gap-2' },
          h('div', { class: 'relative bg-yarn-orange w-8 h-8 rounded-xl flex items-center justify-center' }, ic('shopping-bag', 'w-4 h-4 text-white'), mBadge),
          h('div', { class: 'text-left' }, h('div', { class: 'text-[10px] text-cream-200 leading-none' }, 'Tổng giỏ hàng'), mTotal)),
        h('div', { class: 'bg-yarn-orange px-2.5 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1 whitespace-nowrap' }, h('span', {}, 'Đặt hàng'), ic('chevron-up', 'w-3.5 h-3.5 hidden min-[400px]:block')));
  const bottomBar = h('div', { class: 'md:hidden fixed bottom-0 inset-x-0 z-40 glass-bottom-nav border-t border-amber-900/10 px-3 py-2 pb-safe' },
    h('div', { class: 'flex items-center justify-start gap-2 max-w-md mx-auto' }, backQuick, contactQuick, mCart));

  const sync = () => {
    badge.textContent = cart.count; badge.hidden = cart.count === 0;
    mBadge.textContent = cart.count; mBadge.hidden = cart.count === 0;
    mTotal.textContent = money(cart.subtotal);
    // Giỏ trống: không hiện nút giỏ ở thanh dưới; trang chủ thì ẩn cả thanh (footer và header đã có liên hệ, giỏ)
    mCart.hidden = cart.count === 0;
    bottomBar.hidden = home && cart.count === 0;
    cartBtn.setAttribute('aria-label', `Giỏ hàng, ${cart.count} sản phẩm`);
  };
  cart.subscribe(sync);
  sync();
  // Giữ giỏ luôn khớp với bộ nhớ: trang khôi phục từ bộ nhớ đệm khi bấm Quay lại, quay lại tab, hoặc giỏ đổi ở tab khác
  addEventListener('pageshow', (e) => { if (e.persisted) cart.reload(); });
  addEventListener('storage', (e) => { if (e.key === null || e.key === 'layla_cart_v1') cart.reload(); });
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') cart.reload(); });

  document.getElementById('sk-head')?.remove(); // khung chờ của header (product.html)
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
