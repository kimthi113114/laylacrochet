import { h, logoImage } from './dom.js';
import { messengerUrl, zaloUrl } from './order.js';
import { createDrawer } from './cart-ui.js';

let toastTimer;
export function toast(msg) {
  let el = document.getElementById('toast');
  if (!el) { el = h('div', { id: 'toast', role: 'status', 'aria-live': 'polite' }); document.body.append(el); }
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2600);
}

/** Dựng header, footer, nút chat nổi và giỏ hàng; trả về {openCart}. */
export function mountLayout({ settings, cart, products }) {
  const zalo = zaloUrl(settings.zaloPhone);
  const mess = messengerUrl(settings.fbUsername);
  const drawer = createDrawer({ cart, settings, products });

  const badge = h('span', { class: 'cart-badge', 'aria-hidden': 'true' });
  const cartBtn = h('button', { class: 'cart-btn', type: 'button', onclick: () => drawer.open() },
    h('span', { 'aria-hidden': 'true' }, '🛍'), h('span', { class: 'cart-label' }, 'Giỏ hàng'), badge);
  const syncBadge = () => {
    badge.textContent = cart.count;
    badge.hidden = cart.count === 0;
    cartBtn.setAttribute('aria-label', `Giỏ hàng, ${cart.count} sản phẩm`);
  };
  cart.subscribe(syncBadge);
  syncBadge();

  const header = h('header', { class: 'site-header' },
    h('div', { class: 'wrap bar' },
      h('a', { class: 'brand', href: '/', 'aria-label': `${settings.shopName} - trang chủ` },
        logoImage(settings.logo, settings.shopName), h('span', { class: 'brand-name' }, settings.shopName)),
      h('nav', { class: 'nav', 'aria-label': 'Điều hướng chính' },
        h('a', { href: '/#san-pham' }, 'Sản phẩm'), h('a', { href: '/#cach-dat' }, 'Cách đặt hàng'), h('a', { href: '#lien-he' }, 'Liên hệ')),
      cartBtn));

  const contact = (href, label, cls) => href && h('a', { class: `btn ${cls}`, href, target: '_blank', rel: 'noopener' }, label);
  const footer = h('footer', { class: 'site-footer', id: 'lien-he' },
    h('div', { class: 'wrap foot' },
      h('div', {}, h('div', { class: 'foot-brand' }, settings.shopName), h('p', {}, settings.slogan || 'Túi móc len handmade')),
      h('div', { class: 'foot-actions' },
        h('p', {}, 'Cần tư vấn? Nhắn shop nhé:'),
        h('div', { class: 'row-btns' }, contact(zalo, 'Chat Zalo', 'btn-zalo'), contact(mess, 'Messenger', 'btn-fb'))),
      h('p', { class: 'copy' }, `© ${new Date().getFullYear()} ${settings.shopName}`)));

  const fab = zalo && h('a', { class: 'fab', href: zalo, target: '_blank', rel: 'noopener', 'aria-label': 'Chat Zalo với shop' }, '💬', h('span', {}, 'Zalo'));

  const main = document.querySelector('main');
  document.body.insertBefore(header, main);
  document.body.append(...[footer, fab, drawer.el].filter(Boolean));

  if (settings.favicon) {
    let link = document.querySelector('link[rel=icon]');
    if (!link) { link = h('link', { rel: 'icon' }); document.head.append(link); }
    link.href = `/images/brand/${settings.favicon}-32.png`;
  }
  return { openCart: () => drawer.open() };
}
