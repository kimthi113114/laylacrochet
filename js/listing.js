// Logic thuần của danh sách sản phẩm: lọc, tìm, phân trang, địa chỉ (URL) của từng trang. Không đụng DOM.
export const PAGE_SIZE = 24; // chia hết cho 2, 3, 4 cột nên hàng cuối luôn đầy ở mọi cỡ màn hình

/** Bỏ dấu + chữ thường để tìm "tui" ra "Túi". */
export const fold = (s) => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/gi, 'd').toLowerCase().trim();

export const pageCount = (total, size = PAGE_SIZE) => Math.max(1, Math.ceil(total / size));

/** state: {cat: 'all' | slug, q: chuỗi tìm}. Giữ nguyên thứ tự sản phẩm. */
export function filterProducts(products, { cat = 'all', q = '' } = {}) {
  const needle = fold(q);
  return products.filter((p) => (cat === 'all' || p.category === cat) && (!needle || fold(p.name).includes(needle)));
}

/** Địa chỉ của một trang danh sách (bỏ các giá trị mặc định để URL gọn): /?danh-muc=tui-vi&trang=3&tim=hoa */
export function listingUrl({ cat = 'all', page = 1, q = '' } = {}) {
  const sp = new URLSearchParams();
  if (cat && cat !== 'all') sp.set('danh-muc', cat);
  if (page > 1) sp.set('trang', String(page));
  if (q && q.trim()) sp.set('tim', q.trim());
  const s = sp.toString();
  return s ? `/?${s}` : '/';
}

/** Đọc lại trạng thái từ địa chỉ; giá trị sai (danh mục không có, trang không hợp lệ) rơi về mặc định. */
export function parseListing(search, categories = []) {
  const sp = new URLSearchParams(search);
  const cat = sp.get('danh-muc');
  const page = Number.parseInt(sp.get('trang') ?? '1', 10);
  return {
    cat: cat && categories.some((c) => c.slug === cat) ? cat : 'all',
    page: Number.isInteger(page) && page >= 1 ? page : 1,
    q: (sp.get('tim') ?? '').slice(0, 100),
  };
}

/** Trang (bắt đầu từ 1) chứa sản phẩm `slug` trong danh sách của danh mục `cat`; 1 nếu không thấy. */
export function pageOf(products, slug, cat = 'all', size = PAGE_SIZE) {
  const i = filterProducts(products, { cat }).findIndex((p) => p.slug === slug);
  return i < 0 ? 1 : Math.floor(i / size) + 1;
}

/** Dãy số trang rút gọn có dấu ba chấm: [1, '…', 4, 5, 6, '…', 20]. */
export function pageNumbers(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const keep = new Set([1, total, current - 1, current, current + 1]);
  if (current <= 3) [2, 3, 4].forEach((n) => keep.add(n));
  if (current >= total - 2) [total - 3, total - 2, total - 1].forEach((n) => keep.add(n));
  const nums = [...keep].filter((n) => n >= 1 && n <= total).sort((a, b) => a - b);
  const out = [];
  nums.forEach((n, i) => {
    const gap = i ? n - nums[i - 1] : 0;
    if (gap === 2) out.push(n - 1); // chỉ thiếu đúng 1 trang thì hiện luôn số đó thay vì dấu …
    else if (gap > 2) out.push('…');
    out.push(n);
  });
  return out;
}
