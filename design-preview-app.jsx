/* ARMOR BIKE design preview */
(function () {
  const STORE = window.STORE || { categories: [], map: {} };
  const categories = STORE.categories || [];
  const productCategory = categories.find(c => (c.products || []).length > 0) || categories[0] || { products: [], facets: [], mega: [] };
  const products = productCategory.products || [];
  const fallbackProduct = {
    manufacturer: 'ARMOR',
    name: 'RAINBOW CNC MTB PEDAL',
    spec: 'Aluminum alloy CNC machined body, CR-MO axle, precision bearing platform.',
    price: 'Contact sales',
    badge: 'OEM Ready',
    images: [{ url: 'uploads/pedal-edm-06162026.png', alt: 'ARMOR BIKE pedal campaign' }]
  };
  const catalogProducts = products.length ? products : [fallbackProduct];
  const heroProducts = [
    catalogProducts[6] || catalogProducts[0],
    catalogProducts[0] || fallbackProduct,
    catalogProducts[8] || catalogProducts[1] || catalogProducts[0],
    catalogProducts[10] || catalogProducts[2] || catalogProducts[0]
  ];

  function cleanText(value, fallback = '') {
    return String(value || fallback).trim();
  }

  function imageOf(product, index = 0) {
    const images = product && Array.isArray(product.images) ? product.images : [];
    return images[index]?.url || images[0]?.url || product?.image || 'uploads/pedal-edm-06162026.png';
  }

  function altOf(product) {
    return cleanText(product?.images?.[0]?.alt, cleanText(product?.name, 'ARMOR BIKE product'));
  }

  function makerOf(product) {
    return cleanText(product?.manufacturer, 'ARMOR').replace(/\s+/g, ' ');
  }

  function priceOf(product) {
    return cleanText(product?.price, 'Contact sales');
  }

  function countProducts(cat) {
    return (cat.products || []).length;
  }

  function countByField(items, field) {
    const counts = {};
    items.forEach(item => {
      const key = cleanText(item[field], '');
      if (!key) return;
      counts[key] = (counts[key] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 5);
  }

  function slideData() {
    return [
      {
        eyebrow: 'OEM / ODM / OBM MANUFACTURING',
        title: 'Precision bike components built for fast-moving brands.',
        copy: 'ARMOR BIKE pairs long-run manufacturing experience with modern finishing, dependable QC, and fast-response support for distributors and private-label programs.',
        product: heroProducts[0],
        metric: '52 years',
        note: 'Manufacturing experience'
      },
      {
        eyebrow: 'RAINBOW FINISH SERIES',
        title: 'Anodized color, sharp pricing, ready for global buyers.',
        copy: 'Rainbow CNC components bring a high-impact finish to MTB builds, with competitive pricing and sample-ready options for new market launches.',
        product: heroProducts[1],
        metric: '3 lines',
        note: 'Featured product stories'
      },
      {
        eyebrow: 'ACCESSORIES COLLECTION',
        title: 'From locks to lights, make the catalog feel curated.',
        copy: 'Accessories, security products, lights, and cycling essentials are arranged for faster sourcing from first browse to quote request.',
        product: heroProducts[2],
        metric: `${catalogProducts.length}`,
        note: 'Live product records'
      }
    ];
  }

  function Header({ activeView, setActiveView }) {
    const [openMega, setOpenMega] = React.useState(null);
    const activeCategory = categories.find(c => c.id === openMega) || categories[0];
    return (
      <header className="site-header" onMouseLeave={() => setOpenMega(null)}>
        <div className="header-inner">
          <a className="brand-logo" href="#home" onClick={(event) => { event.preventDefault(); setActiveView('home'); }}>
            <img src="assets/logo-armorbike-on-light.svg" alt="ARMOR BIKE" />
          </a>
          <div className="search-pill" role="search">
            <span className="search-icon">⌕</span>
            <span>Search pedals, locks, lights and OEM parts</span>
          </div>
          <div className="header-actions">
            <button className="icon-button" type="button" aria-label="Wishlist">♡</button>
            <button className="icon-button" type="button" aria-label="Account">◎</button>
            <button className="icon-button" type="button" aria-label="Cart">▱</button>
          </div>
        </div>
        <div className="mega-wrap">
          <nav className="mega-inner" aria-label="Main menu">
            {categories.map(cat => (
              <button
                key={cat.id}
                className={`mega-trigger ${openMega === cat.id ? 'active' : ''}`}
                type="button"
                onMouseEnter={() => setOpenMega(cat.id)}
                onFocus={() => setOpenMega(cat.id)}
                onClick={() => setActiveView('products')}
              >
                {cat.label}
              </button>
            ))}
          </nav>
          {activeCategory && openMega && <MegaPanel category={activeCategory} />}
        </div>
      </header>
    );
  }

  function MegaPanel({ category }) {
    const mega = category.mega || [];
    return (
      <div className="mega-panel">
        <div className="mega-panel-inner">
          {mega.map((column, columnIndex) => (
            <div className="mega-column" key={`${category.id}-${columnIndex}`}>
              {(column || []).map(group => (
                <div key={group.title}>
                  <h3 className="mega-heading">{group.title}</h3>
                  {(group.links || []).slice(0, 8).map(link => (
                    <a className="mega-link" href="#products" key={link}>{link}</a>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  function PreviewTabs({ activeView, setActiveView }) {
    return (
      <div className="preview-tabs" aria-label="Preview sections">
        <button className={`tab-button ${activeView === 'home' ? 'active' : ''}`} type="button" onClick={() => setActiveView('home')}>Home</button>
        <button className={`tab-button ${activeView === 'products' ? 'active' : ''}`} type="button" onClick={() => setActiveView('products')}>Products</button>
      </div>
    );
  }

  function HomePage({ setActiveView, setSelectedProduct }) {
    const slides = slideData();
    const [slideIndex, setSlideIndex] = React.useState(0);
    const slide = slides[slideIndex];
    const railProducts = [heroProducts[1], heroProducts[2], heroProducts[3]];

    React.useEffect(() => {
      const timer = window.setInterval(() => {
        setSlideIndex(index => (index + 1) % slides.length);
      }, 5200);
      return () => window.clearInterval(timer);
    }, [slides.length]);

    return (
      <main className="page" id="home">
        <section className="hero">
          <div>
            <span className="eyebrow">{slide.eyebrow}</span>
            <h1>{slide.title}</h1>
            <p className="hero-copy">{slide.copy}</p>
            <div className="hero-actions">
              <button className="primary-action" type="button" onClick={() => setActiveView('products')}>View product page</button>
              <a className="secondary-action" href="mailto:?subject=ARMOR%20BIKE%20OEM%20Inquiry">Contact sales</a>
            </div>
            <div className="stats-strip" aria-label="Brand highlights">
              <div className="stat-item"><div className="stat-value">52</div><div className="stat-label">Years</div></div>
              <div className="stat-item"><div className="stat-value">OEM</div><div className="stat-label">ODM / OBM</div></div>
              <div className="stat-item"><div className="stat-value">{catalogProducts.length}</div><div className="stat-label">Products</div></div>
              <div className="stat-item"><div className="stat-value">QC</div><div className="stat-label">Controlled</div></div>
            </div>
          </div>
          <div className="hero-showcase">
            <div className="hero-stage">
              <div className="slide-controls" aria-label="Hero slideshow">
                {slides.map((item, index) => (
                  <button
                    key={item.eyebrow}
                    className={`slide-dot ${index === slideIndex ? 'active' : ''}`}
                    type="button"
                    aria-label={`Slide ${index + 1}`}
                    onClick={() => setSlideIndex(index)}
                  />
                ))}
              </div>
              <button className="hero-product" type="button" onClick={() => { setSelectedProduct(slide.product); setActiveView('products'); }} aria-label={cleanText(slide.product?.name, 'Hero product')}>
                <img src={imageOf(slide.product)} alt={altOf(slide.product)} />
              </button>
              <div className="floating-spec">
                <strong>{slide.metric}</strong>
                <span>{slide.note}</span>
              </div>
            </div>
            <div className="hero-side-rail" aria-label="Featured product images">
              {railProducts.map((product, index) => (
                <button
                  className="rail-card"
                  type="button"
                  key={`${cleanText(product?.name, 'product')}-${index}`}
                  onClick={() => { setSelectedProduct(product); setActiveView('products'); }}
                >
                  <img src={imageOf(product, index % 2)} alt={altOf(product)} />
                  <span className="rail-label">{cleanText(product?.name, 'ARMOR BIKE')}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section>
          <div className="section-head">
            <div>
              <h2 className="section-title">Explore ARMOR BIKE categories</h2>
              <p className="section-copy">Move through factory-ready ranges for bicycles, parts, accessories, electronics, and seasonal offers with a clear sourcing path.</p>
            </div>
          </div>
          <div className="category-rail">
            {categories.map(cat => (
              <a className="category-tile" href="#products" key={cat.id} onClick={() => setActiveView('products')}>
                <span className="category-name">{cat.label}</span>
                <span className="category-meta"><span>{countProducts(cat)} products</span><span className="category-arrow">›</span></span>
              </a>
            ))}
          </div>
        </section>

        <section>
          <div className="section-head">
            <div>
              <h2 className="section-title">Featured products</h2>
              <p className="section-copy">Selected accessories and components with clean imagery, fast comparison, and a direct route to product details.</p>
            </div>
            <button className="secondary-action" type="button" onClick={() => setActiveView('products')}>Open catalog</button>
          </div>
          <ProductGrid products={catalogProducts.slice(0, 4)} setSelectedProduct={setSelectedProduct} setActiveView={setActiveView} />
        </section>

        <section className="campaign">
          <div className="campaign-copy">
            <span className="eyebrow">Campaign module</span>
            <h2>Rainbow CNC MTB pedals with attention-grabbing retail energy.</h2>
            <p>Seasonal promotions stay bold and visible while the storefront keeps its premium product-first structure.</p>
          </div>
          <div className="campaign-image">
            <img src="uploads/pedal-edm-06162026.png" alt="Rainbow CNC MTB pedals promotion" />
          </div>
        </section>
      </main>
    );
  }

  function ProductPage({ selectedProduct, setSelectedProduct, setActiveView }) {
    const manufacturerCounts = countByField(catalogProducts, 'manufacturer');
    const typeCounts = countByField(catalogProducts, 'leaf');
    const current = selectedProduct || catalogProducts[0];

    return (
      <main className="page" id="products">
        <div className="catalog-layout">
          <aside className="filter-panel">
            <h2 className="filter-title">Product filters</h2>
            <div className="filter-group">
              <div className="filter-label">Availability</div>
              <div className="filter-row active"><span className="filter-box"></span><span>In stock</span><span className="filter-count">{catalogProducts.length}</span></div>
              <div className="filter-row"><span className="filter-box"></span><span>Hot deal</span><span className="filter-count">{catalogProducts.filter(p => cleanText(p.badge).toLowerCase().includes('hot')).length}</span></div>
            </div>
            <div className="filter-group">
              <div className="filter-label">Product type</div>
              {(typeCounts.length ? typeCounts : [['Accessories', catalogProducts.length]]).map(([name, count], index) => (
                <div className={`filter-row ${index === 0 ? 'active' : ''}`} key={name}><span className="filter-box"></span><span>{name}</span><span className="filter-count">{count}</span></div>
              ))}
            </div>
            <div className="filter-group">
              <div className="filter-label">Manufacturer</div>
              {(manufacturerCounts.length ? manufacturerCounts : [['ARMOR', catalogProducts.length]]).map(([name, count], index) => (
                <div className={`filter-row ${index === 0 ? 'active' : ''}`} key={name}><span className="filter-box"></span><span>{name}</span><span className="filter-count">{count}</span></div>
              ))}
            </div>
          </aside>

          <section>
            <div className="catalog-head">
              <div>
                <span className="eyebrow">ARMOR BIKE catalog</span>
                <h1>{productCategory.leaf || productCategory.label || 'Products'}</h1>
              </div>
              <div className="catalog-tools">
                <span className="count-chip"><strong>{catalogProducts.length}</strong>products</span>
                <span className="sort-chip">Newest first</span>
              </div>
            </div>

            <ProductDetail product={current} setActiveView={setActiveView} />

            <div className="section-head">
              <div>
                <h2 className="section-title">Catalog selection</h2>
                <p className="section-copy">Compare SKUs, inspect specifications, and move quickly from product interest to quote request.</p>
              </div>
            </div>
            <ProductGrid products={catalogProducts} setSelectedProduct={setSelectedProduct} setActiveView={setActiveView} compact />
          </section>
        </div>
      </main>
    );
  }

  function ProductDetail({ product }) {
    return (
      <article className="detail-panel">
        <div className="detail-media">
          <img src={imageOf(product)} alt={altOf(product)} />
        </div>
        <div className="detail-copy">
          <span className="maker">{makerOf(product)}</span>
          <h2 className="detail-title">{cleanText(product?.name, 'ARMOR BIKE Product')}</h2>
          <p className="detail-spec">{cleanText(product?.spec, 'Premium component selected for OEM, ODM and aftermarket programs.')}</p>
          <div className="detail-meta">
            <div className="detail-meta-item"><span>Price</span><strong>{priceOf(product)}</strong></div>
            <div className="detail-meta-item"><span>Program</span><strong>OEM ready</strong></div>
            <div className="detail-meta-item"><span>Status</span><strong>{cleanText(product?.badge, 'Available')}</strong></div>
          </div>
          <div className="detail-actions">
            <a className="primary-action" href={`mailto:?subject=${encodeURIComponent(cleanText(product?.name, 'ARMOR BIKE Product') + ' Inquiry')}`}>Request quote</a>
            <a className="secondary-action" href="#home">Back to home</a>
          </div>
        </div>
      </article>
    );
  }

  function ProductGrid({ products, setSelectedProduct, setActiveView, compact = false }) {
    return (
      <div className={compact ? 'catalog-grid' : 'feature-grid'}>
        {products.map((product, index) => (
          <button
            type="button"
            className="product-card"
            key={`${cleanText(product.name, 'product')}-${index}`}
            onClick={() => { setSelectedProduct(product); setActiveView('products'); }}
          >
            <div className="product-media">
              {cleanText(product.badge) && <span className="badge">{product.badge}</span>}
              <img src={imageOf(product)} alt={altOf(product)} />
            </div>
            <div className="product-info">
              <span className="maker">{makerOf(product)}</span>
              <span className="product-title">{cleanText(product.name, 'ARMOR BIKE Product')}</span>
              <span className="product-spec">{cleanText(product.spec, 'OEM ready bicycle component')}</span>
              <span className="price-row">
                <span className="price">{priceOf(product)}</span>
                <span className="quote-link">Details</span>
              </span>
            </div>
          </button>
        ))}
      </div>
    );
  }

  function App() {
    const [activeView, setActiveView] = React.useState('home');
    const [selectedProduct, setSelectedProduct] = React.useState(catalogProducts[0]);

    React.useEffect(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [activeView]);

    return (
      <div className="preview-shell">
        <Header activeView={activeView} setActiveView={setActiveView} />
        <PreviewTabs activeView={activeView} setActiveView={setActiveView} />
        {activeView === 'home'
          ? <HomePage setActiveView={setActiveView} setSelectedProduct={setSelectedProduct} />
          : <ProductPage selectedProduct={selectedProduct} setSelectedProduct={setSelectedProduct} setActiveView={setActiveView} />}
      </div>
    );
  }

  ReactDOM.createRoot(document.getElementById('root')).render(<App />);
})();
