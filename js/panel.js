// Khung chọn tuỳ chọn + giá + nút mua (dùng ở hero trang chủ và trang chi tiết). Kiểu dáng y bản thiết kế đầu.
import { h, fill, ic } from './dom.js';
import { buildItem } from './cart.js';
import { defaultSelection, findVariant, hasOptions, isAvailable, missingOptions, priceRange, selectionImage, variantLabel } from './catalog.js';
import { discountPct, money } from './format.js';

/**
 * @param p        sản phẩm
 * @param ctx      {cart, openCart, toast, onChange(state)}
 * state: {selection, variant, label}
 */
export function createPanel(p, { cart, openCart, toast, onChange = () => {} }) {
  const selection = defaultSelection(p);
  let lastIdx = -1;
  const el = h('div', { class: 'bg-white p-4 sm:p-5 rounded-3xl border-2 border-amber-900/10 shadow-xl shadow-amber-900/5 space-y-4' });

  const state = () => {
    const variant = findVariant(p, selection);
    return { selection, variant, label: variant ? variantLabel(p, variant) : '', image: selectionImage(p, selection, lastIdx) };
  };

  function draw() {
    const { variant, label } = state();
    const r = priceRange(p);
    const hasOpt = hasOptions(p);
    const price = variant ? variant.price : r.min;
    const old = variant ? variant.oldPrice : r.oldPrice;
    const missing = hasOpt ? missingOptions(p, selection) : [];
    const soldOut = hasOpt && r.soldOut;
    const disabled = soldOut || missing.length > 0;
    const act = (go) => {
      let item;
      try { item = buildItem(p, selection); } catch (e) { toast(e.message); return; }
      cart.add(item, 1);
      if (go) openCart(); else toast('Đã thêm vào giỏ hàng!');
    };
    const fk = document.activeElement?.dataset?.fk;

    fill(el,
      h('div', { class: 'flex items-baseline justify-between border-b border-amber-900/10 pb-3 gap-3' },
        h('div', { class: 'min-w-0' },
          h('span', { class: 'text-[11px] font-bold text-yarn-muted block' }, hasOpt ? 'Phiên bản đang chọn:' : 'Sản phẩm:'),
          h('span', { class: 'font-bold text-sm text-yarn-dark block truncate' }, hasOpt ? (label || 'Hãy chọn bên dưới') : p.name)),
        h('div', { class: 'text-right shrink-0' },
          old && old > price && h('div', { class: 'flex items-center justify-end gap-1.5 mb-0.5' },
            h('span', { class: 'text-xs text-yarn-muted line-through' }, money(old)),
            h('span', { class: 'text-[11px] font-extrabold text-white bg-yarn-red rounded-full px-2 py-0.5' }, `-${discountPct(price, old)}%`)),
          h('span', { class: 'font-serif text-2xl sm:text-3xl font-bold text-yarn-red' }, `${!variant && hasOpt && r.min !== r.max ? 'Từ ' : ''}${money(price)}`))),

      ...(hasOpt ? p.options.map((o, oi) => h('div', {},
        h('span', { class: 'text-[11px] font-bold text-yarn-muted block mb-1.5' }, o.name,
          selection[oi] !== undefined && h('span', { class: 'text-yarn-orange' }, `: ${o.values.find((v) => v.id === selection[oi])?.label}`)),
        h('div', { class: 'flex flex-wrap gap-2' }, o.values.map((v) => {
          const on = selection[oi] === v.id;
          const ok = isAvailable(p, selection, oi, v.id);
          return h('button', {
            type: 'button', 'data-fk': `o${oi}-${v.id}`, 'aria-pressed': on ? 'true' : 'false', 'aria-disabled': ok ? null : 'true',
            title: ok ? null : 'Hết hàng với lựa chọn hiện tại',
            class: `px-3.5 py-2.5 rounded-2xl border-2 text-xs font-extrabold text-yarn-dark flex items-center gap-2 transition-all active:scale-95 ${on ? 'border-yarn-orange bg-amber-50/90' : 'border-transparent bg-cream-100'} ${ok ? '' : 'opacity-40 line-through cursor-not-allowed'}`,
            onclick: () => { if (!ok && !on) return; selection[oi] = on ? undefined : v.id; lastIdx = oi; draw(); onChange(state()); },
          }, v.image && h('img', { src: `/images/products/${v.image}-160.webp`, alt: '', loading: 'lazy', decoding: 'async', class: 'w-7 h-7 rounded-lg object-cover shrink-0 border border-black/5' }),
            !v.image && v.swatch && h('span', { class: 'w-3.5 h-3.5 rounded-full border border-black/10 shrink-0', style: { background: v.swatch }, 'aria-hidden': 'true' }), v.label);
        })))) : []),

      h('div', { class: 'grid grid-cols-12 gap-2.5 pt-1' },
        h('button', { type: 'button', disabled, onclick: () => act(false), class: 'col-span-5 bg-cream-200 hover:bg-cream-300 active:scale-95 text-yarn-dark font-extrabold py-3.5 px-3 rounded-2xl flex items-center justify-center gap-1.5 text-xs sm:text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100' },
          ic('circle-plus', 'w-4 h-4 text-yarn-orange shrink-0'), h('span', {}, 'Thêm Giỏ')),
        h('button', { type: 'button', disabled, onclick: () => act(true), class: 'col-span-7 bg-gradient-to-r from-yarn-orange to-yarn-red text-white font-extrabold py-3.5 px-4 rounded-2xl shadow-lg shadow-yarn-orange/30 flex items-center justify-center gap-2 text-xs sm:text-sm transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100' },
          ic('zap', 'w-4 h-4 shrink-0', { fill: true }), h('span', {}, 'Mua Ngay Qua Zalo/FB'))),
      soldOut ? h('p', { class: 'text-xs font-bold text-yarn-red text-center' }, 'Sản phẩm tạm hết hàng.')
        : missing.length > 0 && h('p', { class: 'text-[11px] font-bold text-yarn-orange text-center' }, `Vui lòng chọn ${missing.join(', ')}`));

    if (fk) el.querySelector(`[data-fk="${fk}"]`)?.focus({ preventScroll: true });
  }

  draw();
  return { el, state, redraw: draw };
}
