import { h, ic, badgeClass, productVisual } from './dom.js';
import { productUrl } from './data.js';
import { buildItem } from './cart.js';
import { hasOptions, priceRange } from './catalog.js';
import { money } from './format.js';
import { toast } from './layout.js';

// Thẻ sản phẩm trong lưới (kiểu dáng y bản thiết kế đầu)
export function card(p, cart) {
  const r = priceRange(p);
  const href = productUrl(p.slug);
  const needsChoice = hasOptions(p);
  const addBtn = h('button', {
    type: 'button', 'aria-label': needsChoice ? `Chọn tuỳ chọn ${p.name}` : `Thêm ${p.name} vào giỏ`, disabled: r.soldOut,
    class: 'bg-yarn-dark active:scale-90 hover:bg-yarn-orange text-white w-8 h-8 sm:w-auto sm:h-auto sm:px-3.5 sm:py-2 rounded-xl flex items-center justify-center gap-1 transition-all shadow-sm shrink-0 disabled:opacity-40',
    onclick: () => {
      if (needsChoice) { location.href = href; return; }
      cart.add(buildItem(p, []), 1);
      toast('Đã thêm vào giỏ hàng!');
    },
  }, ic('plus', 'w-4 h-4'), h('span', { class: 'hidden sm:inline text-xs font-bold' }, needsChoice ? 'Chọn' : 'Thêm'));

  return h('div', { class: 'group bg-white rounded-2xl sm:rounded-3xl p-2.5 sm:p-4 border border-amber-900/10 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between [content-visibility:auto] [contain-intrinsic-size:auto_330px]' },
    h('div', {},
      h('a', { href, tabindex: '-1', 'aria-hidden': 'true', class: 'block relative rounded-xl sm:rounded-2xl bg-gradient-to-b from-cream-100 to-cream-200/60 p-2 sm:p-4 mb-2.5 overflow-hidden h-44 sm:h-60' },
        p.badge && h('span', { class: `absolute top-2 left-2 ${badgeClass(p.badgeColor)} text-[9px] sm:text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full shadow-sm z-10` }, p.badge),
        r.soldOut && h('span', { class: 'absolute bottom-2 inset-x-2 bg-yarn-dark/85 text-white text-[10px] font-bold text-center py-1 rounded-lg z-10' }, 'Tạm hết hàng'),
        productVisual(p, { cls: 'w-full h-full object-cover rounded-lg', illusCls: '[&>svg]:group-hover:scale-105 [&>svg]:transition-transform' })),
      h('h3', { class: 'font-serif font-bold text-xs sm:text-base text-yarn-dark line-clamp-2 leading-snug' },
        h('a', { href }, p.name))),
    h('div', { class: 'pt-2.5 mt-2 border-t border-amber-900/10 flex items-center justify-between gap-1' },
      h('div', {},
        h('span', { class: `text-[10px] text-yarn-muted line-through block leading-none ${r.oldPrice > r.min ? '' : 'invisible'}` }, money(r.oldPrice > r.min ? r.oldPrice : r.min)),
        h('span', { class: 'font-serif font-bold text-sm sm:text-lg text-yarn-red' }, `${r.min !== r.max ? 'Từ ' : ''}${money(r.min)}`)),
      addBtn));
}

