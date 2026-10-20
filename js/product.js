import { fill, h, productImage } from './dom.js';
import { loadData, productUrl } from './data.js';
import { createCart, buildItem } from './cart.js';
import { defaultSelection, findVariant, hasOptions, isAvailable, missingOptions, priceRange } from './catalog.js';
import { discountPct, money } from './format.js';
import { mountLayout, toast } from './layout.js';

const slugFromUrl = () => document.body.dataset.slug || new URLSearchParams(location.search).get('slug');

function notFound(root) {
  document.title = 'Không tìm thấy sản phẩm';
  root.replaceChildren(h('div', { class: 'wrap notice' }, h('h1', {}, 'Không tìm thấy sản phẩm'),
    h('p', {}, 'Sản phẩm có thể đã ngừng bán hoặc đường dẫn chưa đúng.'), h('a', { class: 'btn btn-main', href: '/#san-pham' }, 'Xem tất cả sản phẩm')));
}

async function init() {
  const root = document.getElementById('app');
  let data;
  try { data = await loadData(); } catch {
    root.replaceChildren(h('div', { class: 'wrap notice' }, h('p', {}, 'Không tải được dữ liệu. Vui lòng thử lại sau.')));
    return;
  }
  const { products, categories, settings } = data;
  const cart = createCart(localStorage);
  for (const n of cart.reconcile(products)) toast(n);
  const layout = mountLayout({ settings, cart, products });

  const p = products.find((x) => x.slug === slugFromUrl());
  if (!p) return notFound(root);
  document.title = `${p.name} – ${settings.shopName}`;
  const cat = categories.find((c) => c.slug === p.category);

  const selection = defaultSelection(p);
  let qty = 1;
  let galleryIdx = 0;
  let preferVariantImg = false; // true sau khi khách đổi tuỳ chọn; false sau khi bấm ảnh nhỏ

  const gallery = h('div', { class: 'gallery' });
  const info = h('div', { class: 'info' });

  const currentVariant = () => findVariant(p, selection);
  const mainImageBase = () => (preferVariantImg && currentVariant()?.image) || p.images[galleryIdx]?.base || currentVariant()?.image || null;

  function drawGallery() {
    const imgs = p.images;
    fill(gallery,
      h('div', { class: 'main-img' }, productImage(mainImageBase(), { alt: p.name, seed: p.slug, sizes: '(min-width:900px) 50vw, 100vw', eager: true })),
      imgs.length > 1 && h('div', { class: 'thumbs' }, imgs.map((im, i) => h('button', {
        type: 'button', class: i === galleryIdx ? 'on' : '', 'aria-label': `Ảnh ${i + 1}`,
        onclick: () => { galleryIdx = i; preferVariantImg = false; drawAll(); } }, productImage(im.base, { alt: '', seed: p.slug, sizes: '72px' })))));
  }

  function optionGroup(o, oi) {
    return h('fieldset', { class: 'opt' },
      h('legend', {}, o.name, selection[oi] !== undefined && h('span', { class: 'picked' }, `: ${o.values.find((v) => v.id === selection[oi])?.label}`)),
      h('div', { class: 'opt-values' }, o.values.map((v) => {
        const on = selection[oi] === v.id;
        const ok = isAvailable(p, selection, oi, v.id);
        return h('button', { type: 'button', 'data-fk': `o${oi}-${v.id}`, class: `opt-chip${on ? ' on' : ''}${ok ? '' : ' na'}`, 'aria-pressed': on ? 'true' : 'false', 'aria-disabled': ok ? null : 'true',
          title: ok ? null : 'Hết hàng với lựa chọn hiện tại',
          onclick: () => { if (!ok && !on) return; selection[oi] = on ? undefined : v.id; preferVariantImg = true; drawAll(); } },
          v.swatch && h('i', { class: 'sw', style: { background: v.swatch }, 'aria-hidden': 'true' }), v.label);
      })));
  }

  function drawInfo() {
    const v = currentVariant();
    const r = priceRange(p);
    const price = v ? v.price : r.min;
    const old = v ? v.oldPrice : r.oldPrice;
    const pct = discountPct(price, old);
    const needs = hasOptions(p) ? missingOptions(p, selection) : [];
    const soldOut = hasOptions(p) ? r.soldOut : false;
    const act = (go) => {
      try { cart.add(buildItem(p, selection), qty); } catch (e) { toast(e.message); return; }
      if (go) layout.openCart(); else toast('Đã thêm vào giỏ hàng 🧶');
    };
    const disabled = soldOut || needs.length > 0;
    const fk = document.activeElement?.dataset?.fk;
    fill(info,
      cat && h('a', { class: 'crumb', href: `/#${cat.slug}` }, `← ${cat.name}`),
      h('h1', {}, p.name),
      p.badge && h('span', { class: 'badge inline' }, p.badge),
      h('div', { class: 'price big' },
        h('strong', {}, `${!v && r.min !== r.max ? 'Từ ' : ''}${money(price)}`),
        old > price && h('s', {}, money(old)), pct > 0 && h('span', { class: 'off inline' }, `-${pct}%`)),
      h('p', { class: 'desc' }, p.desc),
      ...(hasOptions(p) ? p.options.map(optionGroup) : []),
      h('div', { class: 'buy' },
        h('div', { class: 'qty lg', role: 'group', 'aria-label': 'Số lượng' },
          h('button', { type: 'button', 'data-fk': 'qty-', 'aria-label': 'Giảm', onclick: () => { qty = Math.max(1, qty - 1); drawInfo(); } }, '−'),
          h('span', {}, qty),
          h('button', { type: 'button', 'data-fk': 'qty+', 'aria-label': 'Tăng', onclick: () => { qty = Math.min(20, qty + 1); drawInfo(); } }, '+')),
        h('button', { class: 'btn btn-ghost', type: 'button', disabled, onclick: () => act(false) }, 'Thêm vào giỏ'),
        h('button', { class: 'btn btn-main', type: 'button', disabled, onclick: () => act(true) }, 'Mua ngay')),
      soldOut ? h('p', { class: 'err' }, 'Sản phẩm tạm hết hàng.')
        : needs.length > 0 && h('p', { class: 'hint-pick' }, `Vui lòng chọn ${needs.join(', ')}`),
      h('ul', { class: 'perks' }, h('li', {}, '🧶 Móc tay thủ công'), h('li', {}, '🎁 Đóng gói quà tặng'), h('li', {}, '💬 Chốt đơn nhanh qua Zalo / Messenger')));
    if (fk) info.querySelector(`[data-fk="${fk}"]`)?.focus({ preventScroll: true });
  }

  function drawAll() { drawGallery(); drawInfo(); }

  const related = products.filter((x) => x.slug !== p.slug && x.category === p.category).slice(0, 4);
  fill(root,
    h('div', { class: 'wrap product' }, gallery, info),
    related.length > 0 && h('section', { class: 'section alt' }, h('div', { class: 'wrap' }, h('h2', { class: 'sec-title' }, 'Có thể bạn cũng thích'),
      h('div', { class: 'grid' }, related.map((x) => h('a', { class: 'card', href: productUrl(x.slug) },
        h('div', { class: 'card-img' }, productImage(x.images[0]?.base, { alt: x.name, seed: x.slug })),
        h('div', { class: 'card-body' }, h('h3', {}, x.name), h('div', { class: 'price' }, h('strong', {}, `${priceRange(x).min !== priceRange(x).max ? 'Từ ' : ''}${money(priceRange(x).min)}`)))))))));
  drawAll();
}

init();
