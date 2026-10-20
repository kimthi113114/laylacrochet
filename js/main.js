import { h, productImage } from './dom.js';
import { loadData, productUrl } from './data.js';
import { createCart } from './cart.js';
import { priceRange } from './catalog.js';
import { discountPct, money } from './format.js';
import { mountLayout, toast } from './layout.js';

function card(p) {
  const r = priceRange(p);
  const pct = discountPct(r.min, r.oldPrice);
  return h('a', { class: 'card', href: productUrl(p.slug) },
    h('div', { class: 'card-img' },
      productImage(p.images[0]?.base, { alt: p.name, seed: p.slug }),
      p.badge && h('span', { class: 'badge' }, p.badge),
      pct > 0 && !r.soldOut && h('span', { class: 'off' }, `-${pct}%`),
      r.soldOut && h('span', { class: 'sold' }, 'Hết hàng')),
    h('div', { class: 'card-body' },
      h('h3', {}, p.name),
      h('div', { class: 'price' },
        h('strong', {}, `${r.min !== r.max ? 'Từ ' : ''}${money(r.min)}`),
        r.oldPrice > r.min && h('s', {}, money(r.oldPrice)))));
}

function steps() {
  const items = [
    ['1', 'Chọn túi', 'Chọn mẫu, màu và loại bạn thích rồi thêm vào giỏ.'],
    ['2', 'Điền thông tin', 'Nhập tên, số điện thoại và địa chỉ nhận hàng.'],
    ['3', 'Gửi qua Zalo / Messenger', 'Đơn được sao chép sẵn, bạn dán vào chat để shop xác nhận.'],
  ];
  return h('section', { class: 'section', id: 'cach-dat' },
    h('div', { class: 'wrap' }, h('h2', { class: 'sec-title' }, 'Đặt hàng dễ dàng'),
      h('ol', { class: 'how' }, items.map(([n, t, d]) => h('li', {}, h('span', { class: 'num' }, n), h('h3', {}, t), h('p', {}, d))))));
}

function trust() {
  const items = [['🧶', 'Móc tay 100%', 'Từng mũi len được hoàn thiện thủ công.'], ['🎁', 'Quà tặng ý nghĩa', 'Đóng gói xinh, sẵn sàng để tặng.'], ['💬', 'Tư vấn tận tâm', 'Nhắn shop bất cứ lúc nào để chọn mẫu.']];
  return h('section', { class: 'section alt' }, h('div', { class: 'wrap trust' },
    items.map(([i, t, d]) => h('div', {}, h('span', { class: 'ico', 'aria-hidden': 'true' }, i), h('h3', {}, t), h('p', {}, d)))));
}

async function init() {
  const root = document.getElementById('app');
  let data;
  try { data = await loadData(); } catch {
    root.replaceChildren(h('div', { class: 'wrap notice' }, h('p', {}, 'Không tải được dữ liệu sản phẩm. Vui lòng thử lại sau.')));
    return;
  }
  const { products, categories, settings } = data;
  document.title = `${settings.shopName} – ${settings.slogan || 'Túi móc len handmade'}`;
  const cart = createCart(localStorage);
  for (const n of cart.reconcile(products)) toast(n);
  mountLayout({ settings, cart, products });

  let active = decodeURIComponent(location.hash.slice(1));
  if (!categories.some((c) => c.slug === active)) active = 'all';

  const grid = h('div', { class: 'grid', 'aria-live': 'polite' });
  const chips = h('div', { class: 'chips', role: 'group', 'aria-label': 'Lọc theo danh mục' });
  const draw = () => {
    const list = active === 'all' ? products : products.filter((p) => p.category === active);
    grid.replaceChildren(...(list.length ? list.map(card) : [h('p', { class: 'muted' }, 'Chưa có sản phẩm trong danh mục này.')]));
    chips.replaceChildren(...[{ slug: 'all', name: 'Tất cả' }, ...categories].map((c) =>
      h('button', { type: 'button', class: 'chip' + (c.slug === active ? ' on' : ''), 'aria-pressed': c.slug === active ? 'true' : 'false',
        onclick: () => { active = c.slug; history.replaceState(null, '', c.slug === 'all' ? location.pathname : `#${c.slug}`); draw(); } }, c.name)));
  };
  draw();

  const featured = products[0];
  root.replaceChildren(
    h('section', { class: 'hero' }, h('div', { class: 'wrap hero-in' },
      h('div', { class: 'hero-text' },
        h('p', { class: 'eyebrow' }, 'Handmade với tình yêu'),
        h('h1', {}, settings.slogan || 'Túi móc len handmade'),
        h('p', {}, 'Những chiếc túi len nhỏ xinh, độc đáo, đựng vừa điện thoại và những món đồ yêu thích của bạn.'),
        h('a', { class: 'btn btn-main', href: '#san-pham' }, 'Xem sản phẩm')),
      featured && h('a', { class: 'hero-img', href: productUrl(featured.slug), 'aria-label': `Xem ${featured.name}` }, productImage(featured.images[0]?.base, { alt: featured.name, seed: featured.slug, sizes: '(min-width:900px) 40vw, 90vw', eager: true })))),
    h('section', { class: 'section', id: 'san-pham' }, h('div', { class: 'wrap' }, h('h2', { class: 'sec-title' }, 'Sản phẩm'), chips, grid)),
    steps(), trust());

  // Nội dung dựng bất đồng bộ nên phải tự cuộn tới đích của #hash (vd /#san-pham, /#clown, /#cach-dat)
  const hash = decodeURIComponent(location.hash.slice(1));
  const target = document.getElementById(hash) || (categories.some((c) => c.slug === hash) ? document.getElementById('san-pham') : null);
  target?.scrollIntoView();
}

init();
