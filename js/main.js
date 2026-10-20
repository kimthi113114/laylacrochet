import { h, fill, ic } from './dom.js';
import { card } from './card.js';
import { loadData, productUrl } from './data.js';
import { createCart } from './cart.js';
import { createPanel } from './panel.js';
import { HERO_ART, ILLUSTRATIONS } from './illustrations.js';
import { productVisual } from './dom.js';
import { mountLayout, toast } from './layout.js';

// ---------- hero ----------
function heroVisual(p) {
  const photo = p.images[0]?.base;
  const frame = (inner) => h('div', { class: 'relative mx-auto max-w-md' },
    h('div', { class: 'relative rounded-[2rem] sm:rounded-[2.5rem] bg-gradient-to-b from-[#2E3529] to-[#1A1D17] p-3 sm:p-5 shadow-2xl border-2 sm:border-4 border-white overflow-hidden' },
      h('div', { class: 'absolute top-5 left-5 z-20 flex items-center gap-1.5 bg-black/65 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-[11px] font-bold border border-white/15' },
        h('span', { class: 'w-2 h-2 rounded-full bg-yarn-green animate-ping' }), h('span', {}, p.badge || 'Mẫu Nổi Bật')),
      h('div', { class: 'relative rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden aspect-[4/4.3] sm:aspect-[4/4.6] bg-[#22261F] flex items-center justify-center' }, inner,
        h('div', { class: 'absolute bottom-3 inset-x-3 flex items-center justify-between bg-black/60 backdrop-blur-md px-3.5 py-2 rounded-2xl text-white text-[11px]' },
          h('span', { class: 'flex items-center gap-1.5 font-semibold' }, ic('flame', 'w-3.5 h-3.5 text-yarn-yellow'), 'Móc tay thủ công từng mũi len'),
          h('span', { class: 'text-yarn-yellow font-bold' }, 'Handmade 100%')))));
  if (photo) return frame(productVisual(p, { eager: true, sizes: '(min-width:1024px) 40vw, 90vw' }));
  const art = h('div', { class: 'w-full h-full relative flex items-center justify-center p-2 sm:p-4 bg-gradient-to-br from-[#2B3327] via-[#232323] to-[#181818]' });
  art.innerHTML = p.illustration === 'clown-big' ? HERO_ART
    : `<div class="w-full h-full flex items-center justify-center [&>svg]:w-3/4 [&>svg]:h-3/4 [&>svg]:max-w-none animate-float">${ILLUSTRATIONS[p.illustration] ?? ILLUSTRATIONS['clown-big']}</div>`;
  return frame(art);
}

function hero(p, cart, openCart) {
  const panel = createPanel(p, { cart, openCart, toast });
  const benefit = (name, cls, text) => h('div', { class: 'flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-amber-900/10 shrink-0' }, ic(name, `w-4 h-4 ${cls}`), h('span', { class: 'text-xs font-semibold text-yarn-dark' }, text));
  return h('section', { id: 'featured', class: 'relative pt-4 pb-10 sm:py-14 lg:py-20 overflow-hidden' },
    h('div', { class: 'max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8' },
      h('div', { class: 'grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center' },
        h('div', { class: 'lg:col-span-6 lg:order-2' }, heroVisual(p)),
        h('div', { class: 'lg:col-span-6 lg:order-1 space-y-4 sm:space-y-6' },
          h('div', { class: 'space-y-2' },
            h('div', { class: 'inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-yarn-orange text-[11px] font-extrabold uppercase tracking-wider' }, ic('sparkles', 'w-3.5 h-3.5'), h('span', {}, 'Thủ Công Độc Bản')),
            h('h1', { class: 'font-serif text-3xl sm:text-5xl font-bold text-yarn-dark leading-[1.15]' }, 'Túi Len Đựng Điện Thoại ',
              h('span', { class: 'text-transparent bg-clip-text bg-gradient-to-r from-yarn-red via-yarn-orange to-yarn-green italic' }, p.name.replace(/^túi\s+/i, ''))),
            h('p', { class: 'text-xs sm:text-base text-yarn-muted leading-relaxed' }, p.desc)),
          panel.el,
          h('div', { class: 'flex items-center gap-2.5 overflow-x-auto no-scrollbar py-1' },
            benefit('smartphone', 'text-yarn-green', 'Vừa mọi dòng Pro Max'), benefit('shield-check', 'text-yarn-orange', 'Len dày chống sốc'), benefit('gift', 'text-yarn-red', 'Quà tặng ý nghĩa'))
          , h('a', { href: productUrl(p.slug), class: 'inline-block text-xs font-bold text-yarn-orange underline' }, 'Xem chi tiết sản phẩm →')))));
}

// ---------- các khối còn lại ----------
const RINGS = ['from-yarn-yellow via-yarn-orange to-yarn-red', 'from-yarn-green to-yarn-blue', 'from-amber-300 to-yarn-orange', 'from-pink-400 to-yarn-purple', 'from-yarn-purple to-yarn-orange'];

function highlights(categories, onPick) {
  const item = (emoji, label, ring, props) => h(props.href ? 'a' : 'button', { ...props, class: 'flex flex-col items-center gap-1 shrink-0' },
    h('div', { class: `w-14 h-14 rounded-full p-0.5 bg-gradient-to-tr ${ring}` }, h('div', { class: 'w-full h-full rounded-full bg-cream-100 border-2 border-white flex items-center justify-center text-xl' }, emoji)),
    h('span', { class: 'text-[11px] font-medium text-yarn-muted' }, label));
  return h('section', { class: 'md:hidden pt-3 pb-2 px-3.5 border-b border-amber-900/5 bg-cream-50' },
    h('div', { class: 'flex items-center gap-4 overflow-x-auto no-scrollbar py-1' },
      item('🔥', 'Nổi Bật', RINGS[0], { href: '#featured' }),
      categories.map((c, i) => item(c.emoji || '🧶', c.name, RINGS[(i + 1) % RINGS.length], { type: 'button', onclick: () => onPick(c.slug) })),
      item('🛍', 'Cách Đặt', RINGS[4], { href: '#how' })));
}

function how() {
  const steps = [['1', 'Chọn túi', 'Chọn mẫu, màu và loại bạn thích rồi thêm vào giỏ.'], ['2', 'Điền thông tin', 'Nhập tên, số điện thoại và địa chỉ nhận hàng.'], ['3', 'Gửi qua Zalo / Messenger', 'Đơn được sao chép sẵn, bạn chỉ cần dán vào chat để shop xác nhận.']];
  return h('section', { id: 'how', class: 'py-10 sm:py-16' },
    h('div', { class: 'max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8' },
      h('div', { class: 'text-center mb-6 sm:mb-10' }, h('span', { class: 'text-[11px] font-extrabold uppercase tracking-widest text-yarn-orange block' }, 'Siêu đơn giản'),
        h('h2', { class: 'font-serif text-2xl sm:text-4xl font-bold text-yarn-dark' }, 'Đặt Hàng 3 Bước')),
      h('ol', { class: 'grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6' }, steps.map(([n, t, d]) => h('li', { class: 'bg-white rounded-3xl p-5 border border-amber-900/10 shadow-sm' },
        h('span', { class: 'w-9 h-9 rounded-2xl bg-gradient-to-br from-yarn-orange to-yarn-red text-white font-serif font-bold flex items-center justify-center mb-3' }, n),
        h('h3', { class: 'font-serif font-bold text-lg text-yarn-dark mb-1' }, t), h('p', { class: 'text-xs sm:text-sm text-yarn-muted leading-relaxed' }, d))))));
}

async function init() {
  const root = document.getElementById('app');
  let data;
  try { data = await loadData(); } catch {
    root.replaceChildren(h('div', { class: 'max-w-3xl mx-auto px-4 py-16 text-center text-yarn-muted' }, 'Không tải được dữ liệu sản phẩm. Vui lòng thử lại sau.'));
    return;
  }
  const { products, categories, settings } = data;
  document.title = `${settings.shopName} – ${settings.slogan || 'Túi móc len handmade'}`;
  const cart = createCart(localStorage);
  for (const n of cart.reconcile(products)) toast(n);
  const { openCart } = mountLayout({ settings, cart, products, home: true });

  let active = decodeURIComponent(location.hash.slice(1));
  if (!categories.some((c) => c.slug === active)) active = 'all';

  const grid = h('div', { id: 'product-grid', class: 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6', 'aria-live': 'polite' });
  let query = '';
  const search = h('input', { type: 'search', placeholder: 'Tìm sản phẩm...', 'aria-label': 'Tìm sản phẩm', class: 'w-full sm:w-56 px-4 py-2 rounded-full text-xs border border-amber-900/15 bg-white focus:outline-none focus:border-yarn-orange',
    oninput: (e) => { query = e.target.value.trim().toLowerCase(); draw(); } });
  const pills = h('div', { class: 'flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 -mx-3 px-3 sm:mx-0 sm:px-0 sm:flex-wrap sm:overflow-visible', role: 'group', 'aria-label': 'Lọc theo danh mục' });
  const pick = (slug, scroll = false) => {
    active = slug;
    history.replaceState(null, '', slug === 'all' ? location.pathname : `#${slug}`);
    draw();
    if (scroll) document.getElementById('collection').scrollIntoView({ behavior: 'smooth' });
  };
  // Tải dần: chỉ dựng PAGE thẻ đầu, cuộn gần tới cuối mới dựng tiếp (kèm ảnh lazy-load nên ảnh cũng chỉ tải khi hiện ra)
  const PAGE = 24;
  let list = [];
  let shown = 0;
  const more = h('button', { type: 'button', class: 'px-5 py-2.5 rounded-full bg-white border border-amber-900/15 text-xs font-bold text-yarn-dark active:scale-95', onclick: () => loadMore() }, 'Xem thêm sản phẩm');
  const counter = h('p', { class: 'text-[11px] text-yarn-muted mt-2' });
  const sentinel = h('div', { class: 'col-span-full flex flex-col items-center py-6', 'aria-live': 'polite' }, more, counter);
  function loadMore() {
    for (const p of list.slice(shown, shown + PAGE)) grid.insertBefore(card(p, cart), sentinel);
    shown = Math.min(list.length, shown + PAGE);
    sentinel.hidden = list.length === 0 || shown >= list.length;
    counter.textContent = `Đang hiện ${shown}/${list.length} sản phẩm`;
    // Nếu mốc cuối vẫn nằm trong vùng sắp cuộn tới (màn hình cao) thì dựng tiếp
    requestAnimationFrame(() => { if (!sentinel.hidden && sentinel.getBoundingClientRect().top < innerHeight + 700) loadMore(); });
  }
  if ('IntersectionObserver' in window) {
    new IntersectionObserver((es) => { if (es[0].isIntersecting && !sentinel.hidden) loadMore(); }, { rootMargin: '700px 0px' }).observe(sentinel);
  }

  function draw() {
    list = (active === 'all' ? products : products.filter((p) => p.category === active)).filter((p) => !query || p.name.toLowerCase().includes(query));
    shown = 0;
    grid.replaceChildren(sentinel);
    if (!list.length) {
      grid.insertBefore(h('p', { class: 'col-span-full text-center text-yarn-muted py-10' }, query ? 'Không tìm thấy sản phẩm phù hợp.' : 'Chưa có sản phẩm trong danh mục này.'), sentinel);
      sentinel.hidden = true;
    } else loadMore();
    const countOf = (slug) => products.filter((p) => p.category === slug).length;
    fill(pills, [{ slug: 'all', name: `Tất cả (${products.length})` }, ...categories.map((c) => ({ ...c, name: `${c.emoji ? c.emoji + ' ' : ''}${c.name} (${countOf(c.slug)})` }))].map((c) => {
      const on = c.slug === active;
      return h('button', { type: 'button', 'aria-pressed': on ? 'true' : 'false', onclick: () => pick(c.slug),
        class: `shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all ${on ? 'bg-yarn-dark text-white shadow-sm' : 'bg-white text-yarn-muted border border-amber-900/10'}` },
        c.name);
    }));
  }
  draw();

  if (!products.length) {
    fill(root, h('div', { class: 'max-w-3xl mx-auto px-4 py-20 text-center text-yarn-muted' }, 'Shop đang cập nhật sản phẩm, bạn quay lại sau nhé!'));
    return;
  }

  fill(root,
    highlights(categories, (slug) => pick(slug, true)),
    hero(products[0], cart, openCart),
    h('div', { class: 'stitch-border opacity-30' }),
    h('section', { id: 'collection', class: 'py-10 sm:py-16 bg-cream-100/70' },
      h('div', { class: 'max-w-7xl mx-auto px-3 sm:px-6 lg:px-8' },
        h('div', { class: 'mb-4 sm:mb-6' }, h('span', { class: 'text-[11px] font-extrabold uppercase tracking-widest text-yarn-orange block' }, 'Layla Lookbook'),
          h('h2', { class: 'font-serif text-2xl sm:text-4xl font-bold text-yarn-dark' }, 'Kệ Túi Móc Len Thủ Công')),
        h('div', { class: 'flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-5 sm:mb-8' }, h('div', { class: 'min-w-0 flex-1' }, pills), search),
        grid)),
    how());

  // Nội dung dựng bất đồng bộ nên phải tự cuộn tới đích của #hash (vd /#collection, /#clown, /#how)
  const hash = decodeURIComponent(location.hash.slice(1));
  const target = document.getElementById(hash) || (categories.some((c) => c.slug === hash) ? document.getElementById('collection') : null);
  target?.scrollIntoView();
}

init();
