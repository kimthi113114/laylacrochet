export async function loadData() {
  const get = async (p) => {
    const r = await fetch(p);
    if (!r.ok) throw new Error(`${p}: ${r.status}`);
    return r.json();
  };
  const [catalog, settings] = await Promise.all([get('/data/products.json'), get('/data/settings.json')]);
  return { categories: catalog.categories, products: catalog.products, settings };
}

// Trang tĩnh do build sinh ra (scripts/build-site.js hoặc nút Publish trong admin)
export const productUrl = (slug) => `/p/${encodeURIComponent(slug)}.html`;
