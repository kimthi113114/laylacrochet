import { fill, h, ic, badgeClass, productVisual } from './dom.js';
import { loadData, productUrl } from './data.js';
import { createCart } from './cart.js';
import { createPanel } from './panel.js';
import { card } from './card.js';
import { filterProducts, listingUrl, pageOf } from './listing.js';
import { mountLayout, toast } from './layout.js';

const slugFromUrl = () => document.body.dataset.slug || new URLSearchParams(location.search).get('slug');

function notFound(root) {
  document.title = 'Không tìm thấy sản phẩm';
  fill(root, h('div', { class: 'max-w-3xl mx-auto px-4 py-20 text-center space-y-4' },
    h('h1', { class: 'font-serif text-3xl font-bold text-yarn-dark' }, 'Không tìm thấy sản phẩm'),
    h('p', { class: 'text-yarn-muted' }, 'Sản phẩm có thể đã ngừng bán hoặc đường dẫn chưa đúng.'),
    h('a', { href: '/#collection', class: 'inline-block bg-yarn-dark text-white font-bold px-5 py-3 rounded-2xl' }, 'Xem tất cả sản phẩm')));
}

async function init() {
  const root = document.getElementById('app');
  let data;
  try { data = await loadData(); } catch {
    fill(root, h('div', { class: 'max-w-3xl mx-auto px-4 py-16 text-center text-yarn-muted' }, 'Không tải được dữ liệu. Vui lòng thử lại sau.'));
    return;
  }
  const { products, categories, settings } = data;
  const cart = createCart(localStorage);
  for (const n of cart.reconcile(products)) toast(n);
  const p = products.find((x) => x.slug === slugFromUrl());
  const backHref = p ? `${listingUrl({ cat: p.category, page: pageOf(products, p.slug, p.category) })}#sp-${p.slug}` : '/';
  const { openCart } = mountLayout({ settings, cart, products, categories, back: backHref });
  if (!p) return notFound(root);
  document.title = `${p.name} – ${settings.shopName}`;
  const cat = categories.find((c) => c.slug === p.category);

  // Thư viện ảnh: ảnh sản phẩm + ảnh riêng của từng lựa chọn (màu, loại...), bỏ trùng, để khách thấy đủ mọi ảnh
  const gallery = [...new Set([...p.images.map((im) => im.base),
    ...p.options.flatMap((o) => o.values.map((v) => v.image)), ...p.variants.map((v) => v.image)].filter(Boolean))];
  let galleryIdx = 0;
  let preferVariantImg = false; // true sau khi khách đổi tuỳ chọn; false sau khi bấm ảnh nhỏ
  const stage = h('div', { class: 'relative rounded-3xl bg-gradient-to-b from-cream-100 to-cream-200/60 border border-amber-900/10 aspect-square flex items-center justify-center p-4 sm:p-6 overflow-hidden' });
  const thumbs = h('div', { class: 'flex gap-2 overflow-x-auto no-scrollbar mt-3' });

  let current = { variant: null, label: '' };
  function drawVisual() {
    const photo = (preferVariantImg && current.image) || gallery[galleryIdx] || current.image || null;
    const activeBase = preferVariantImg && current.image ? current.image : gallery[galleryIdx];
    fill(stage,
      p.badge && h('span', { class: `absolute top-3 left-3 ${badgeClass(p.badgeColor)} text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full shadow-sm z-10` }, p.badge),
      productVisual(p, { base: photo, variantLabel: current.label, eager: true, sizes: '(min-width:1024px) 50vw, 100vw',
        cls: 'w-full h-full object-cover rounded-2xl', illusCls: '[&>svg]:w-64 [&>svg]:h-72 sm:[&>svg]:w-80 sm:[&>svg]:h-96 [&>svg]:max-w-none animate-float' }));
    fill(thumbs, gallery.length > 1 && gallery.map((base, i) => h('button', {
      type: 'button', 'aria-label': `Xem ảnh ${i + 1}`, 'aria-pressed': base === activeBase ? 'true' : 'false',
      class: `w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-xl overflow-hidden border-2 ${base === activeBase ? 'border-yarn-orange' : 'border-transparent opacity-80'}`,
      onclick: () => { galleryIdx = i; preferVariantImg = false; drawVisual(); },
    }, productVisual(p, { base, sizes: '80px' }))));
    // hàng ảnh nhỏ cuộn ngang: đưa ảnh đang chọn vào tầm nhìn (không làm trang nhảy)
    const on = thumbs.querySelector('[aria-pressed=true]');
    if (on) thumbs.scrollTo({ left: on.offsetLeft - (thumbs.clientWidth - on.offsetWidth) / 2, behavior: 'smooth' });
  }

  const panel = createPanel(p, {
    cart, openCart, toast,
    onChange: (state) => { current = state; preferVariantImg = true; drawVisual(); },
  });
  current = panel.state();
  drawVisual();

  const benefit = (name, cls, text) => h('div', { class: 'flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-amber-900/10 shrink-0' }, ic(name, `w-4 h-4 ${cls}`), h('span', { class: 'text-xs font-semibold text-yarn-dark' }, text));
  // Sản phẩm trước / sau trong cùng danh mục (theo thứ tự danh sách), đi vòng tròn
  const sibs = filterProducts(products, { cat: p.category || 'all' });
  const at = sibs.findIndex((x) => x.slug === p.slug);
  const prev = sibs.length > 1 ? sibs[(at - 1 + sibs.length) % sibs.length] : null;
  const next = sibs.length > 1 ? sibs[(at + 1) % sibs.length] : null;
  const arrow = (dir, target) => h('a', { href: productUrl(target.slug), rel: dir, 'aria-label': `${dir === 'prev' ? 'Sản phẩm trước' : 'Sản phẩm tiếp theo'}: ${target.name}`, title: target.name,
    class: 'w-9 h-9 rounded-full bg-white border border-amber-900/15 text-yarn-dark flex items-center justify-center hover:bg-yarn-dark hover:text-white active:scale-90 transition-all shadow-sm' },
    ic(dir === 'prev' ? 'chevron-left' : 'chevron-right', 'w-4 h-4'));
  const pairCard = (dir, target) => h('a', { href: productUrl(target.slug), class: `group flex items-center gap-3 bg-white rounded-2xl border border-amber-900/10 p-2.5 sm:p-3 hover:shadow-lg transition-all ${dir === 'next' ? 'flex-row-reverse text-right' : ''}` },
    h('div', { class: 'w-14 h-14 sm:w-16 sm:h-16 shrink-0 rounded-xl overflow-hidden bg-cream-100' }, productVisual(target, { cls: 'w-full h-full object-cover', sizes: '64px' })),
    h('div', { class: 'min-w-0 flex-1' },
      h('span', { class: 'text-[10px] font-extrabold uppercase tracking-widest text-yarn-orange block' }, dir === 'prev' ? '‹ Sản phẩm trước' : 'Sản phẩm tiếp theo ›'),
      h('span', { class: 'font-serif font-bold text-xs sm:text-sm text-yarn-dark line-clamp-2 leading-snug' }, target.name)));
  const related = products.filter((x) => x.slug !== p.slug && x.category === p.category).slice(0, 4);

  root.removeAttribute('aria-busy');
  fill(root,
    h('section', { class: 'pt-4 pb-10 sm:py-12' },
      h('div', { class: 'max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8' },
        h('div', { class: 'flex items-center justify-between gap-3 mb-3 sm:mb-5' },
        h('nav', { 'aria-label': 'Đường dẫn', class: 'min-w-0 text-[11px] sm:text-xs font-semibold text-yarn-muted flex items-center gap-1.5 flex-wrap' },
          h('a', { href: '/', class: 'hover:text-yarn-orange' }, 'Trang chủ'), '›',
          cat && [h('a', { href: `${listingUrl({ cat: cat.slug, page: pageOf(products, p.slug, cat.slug) })}#sp-${p.slug}`, class: 'hover:text-yarn-orange', title: `Xem ${cat.name} (đúng trang có sản phẩm này)` }, cat.name), '›'],
          h('span', { class: 'text-yarn-dark truncate' }, p.name)),
          prev && h('div', { class: 'flex gap-2 shrink-0', role: 'group', 'aria-label': 'Chuyển sản phẩm' }, arrow('prev', prev), arrow('next', next))),
        h('div', { class: 'grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start' },
          h('div', { class: 'lg:col-span-6 lg:sticky lg:top-24' }, stage, thumbs),
          h('div', { class: 'lg:col-span-6 space-y-4 sm:space-y-6' },
            h('div', { class: 'space-y-2' },
              h('div', { class: 'inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-yarn-orange text-[11px] font-extrabold uppercase tracking-wider' }, ic('sparkles', 'w-3.5 h-3.5'), h('span', {}, cat ? cat.name : 'Thủ Công Độc Bản')),
              h('h1', { class: 'font-serif text-3xl sm:text-4xl font-bold text-yarn-dark leading-[1.15]' }, p.name),
              h('p', { class: 'text-xs sm:text-base text-yarn-muted leading-relaxed' }, p.desc)),
            panel.el,
            h('div', { class: 'flex items-center gap-2.5 overflow-x-auto no-scrollbar py-1' },
              benefit('smartphone', 'text-yarn-green', 'Vừa mọi dòng Pro Max'), benefit('shield-check', 'text-yarn-orange', 'Len dày chống sốc'), benefit('gift', 'text-yarn-red', 'Quà tặng ý nghĩa')))))),
    prev && h('section', { class: 'pb-8 sm:pb-12', 'aria-label': 'Sản phẩm khác trong danh mục' },
      h('div', { class: 'max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4' }, pairCard('prev', prev), pairCard('next', next))),
    related.length > 0 && h('section', { class: 'py-10 sm:py-14 bg-cream-100/70 border-t border-amber-900/5' },
      h('div', { class: 'max-w-7xl mx-auto px-3 sm:px-6 lg:px-8' },
        h('h2', { class: 'font-serif text-xl sm:text-3xl font-bold text-yarn-dark mb-5 sm:mb-8' }, 'Có Thể Bạn Cũng Thích'),
        h('div', { class: 'grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6' }, related.map((x) => card(x, cart))))));
}

init();
