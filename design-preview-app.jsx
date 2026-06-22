/* ARMOR BIKE Future Lab preview */
(function () {
  const STORE = window.STORE || { categories: [], map: {} };
  const categories = STORE.categories || [];
  const sourceCategory = categories.find(c => (c.products || []).length > 0) || categories[0] || { label: 'Products', leaf: 'Product Lab', products: [], facets: [], mega: [] };
  const sourceProducts = sourceCategory.products || [];
  const fallbackProduct = {
    manufacturer: 'ARMOR',
    name: 'RAINBOW CNC MTB PEDAL',
    spec: 'Aluminum alloy CNC machined body, CR-MO axle, precision bearing platform.',
    price: 'Contact sales',
    badge: 'Prototype',
    leaf: 'Pedal',
    images: [{ url: 'uploads/pedal-edm-06162026.png', alt: 'ARMOR BIKE pedal campaign' }]
  };
  const products = sourceProducts.length ? sourceProducts : [fallbackProduct];
  const featured = [
    products[6] || products[0] || fallbackProduct,
    products[8] || products[1] || products[0] || fallbackProduct,
    products[10] || products[2] || products[0] || fallbackProduct,
    products[0] || fallbackProduct
  ];

  function text(value, fallback = '') {
    return String(value || fallback).trim();
  }

  function cleanMaker(product) {
    return text(product?.manufacturer, 'ARMOR').replace(/\s+/g, ' ');
  }

  function productImage(product, index = 0) {
    const images = Array.isArray(product?.images) ? product.images : [];
    return images[index]?.url || images[0]?.url || product?.image || 'uploads/pedal-edm-06162026.png';
  }

  function productAlt(product) {
    return text(product?.images?.[0]?.alt, text(product?.name, 'ARMOR BIKE product'));
  }

  function productPrice(product) {
    return text(product?.price, 'Contact sales');
  }

  function countProducts(category) {
    return (category.products || []).length;
  }

  function countBy(items, field) {
    const map = {};
    items.forEach(item => {
      const key = text(item[field]);
      if (!key) return;
      map[key] = (map[key] || 0) + 1;
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 5);
  }

  function slides() {
    return [
      {
        kicker: 'Future supply interface',
        title: 'Bike components presented like precision hardware.',
        copy: 'A lighter gray future-lab direction for ARMOR BIKE: clean sourcing paths, technical product focus, and a cooler industrial surface system.',
        product: featured[0],
        metric: '52',
        metricLabel: 'years manufacturing'
      },
      {
        kicker: 'Anodized finish program',
        title: 'Color, tooling and OEM programs in one digital lab.',
        copy: 'Hero content can rotate between product programs, factory capability, seasonal campaigns, and buyer-focused collections.',
        product: featured[1],
        metric: 'OEM',
        metricLabel: 'ODM / OBM ready'
      },
      {
        kicker: 'Accessories sourcing grid',
        title: 'A catalog that feels engineered, not templated.',
        copy: 'Product pages use data-driven counts and modular detail panels so buyers can inspect SKUs without losing context.',
        product: featured[2],
        metric: String(products.length),
        metricLabel: 'live product records'
      }
    ];
  }

  function Header({ setView }) {
    const [openMega, setOpenMega] = React.useState(null);
    const activeCategory = categories.find(c => c.id === openMega) || categories[0];

    return (
      <header className="site-header" onMouseLeave={() => setOpenMega(null)}>
        <div className="command-bar">
          <a className="wordmark" href="#home" onClick={(event) => { event.preventDefault(); setView('home'); }}>
            <span className="wordmark-mark">AB</span>
            <span>ARMOR <strong>BIKE</strong></span>
          </a>
          <div className="system-strip" aria-label="Production status">
            <span className="system-label">LAB MODE</span>
            <span className="system-scan" aria-hidden="true"></span>
            <span className="system-status">SYNC READY</span>
          </div>
          <div className="header-actions">
            <button className="utility-button" type="button" aria-label="Wishlist">WIS</button>
            <button className="utility-button" type="button" aria-label="Account">ACC</button>
            <button className="utility-button" type="button" aria-label="Cart">RFQ</button>
          </div>
        </div>
        <div className="mega-dock">
          <nav className="mega-track" aria-label="Mega menu">
            {categories.map(category => (
              <button
                key={category.id}
                className={`mega-trigger ${openMega === category.id ? 'active' : ''}`}
                type="button"
                onMouseEnter={() => setOpenMega(category.id)}
                onFocus={() => setOpenMega(category.id)}
                onClick={() => setView('products')}
              >
                {category.label}
              </button>
            ))}
          </nav>
          {openMega && activeCategory && <MegaPanel category={activeCategory} />}
        </div>
      </header>
    );
  }

  function MegaPanel({ category }) {
    const mega = category.mega || [];
    return (
      <div className="mega-panel">
        <div className="mega-panel-inner">
          <div className="mega-callout">
            <strong>{category.label}<br />source map</strong>
            <span>{countProducts(category)} active records</span>
          </div>
          {mega.map((column, index) => (
            <div className="mega-column" key={`${category.id}-${index}`}>
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

  function ViewToggle({ view, setView }) {
    return (
      <div className="view-toggle" aria-label="Preview views">
        <button className={`toggle-button ${view === 'home' ? 'active' : ''}`} type="button" onClick={() => setView('home')}>Home deck</button>
        <button className={`toggle-button ${view === 'products' ? 'active' : ''}`} type="button" onClick={() => setView('products')}>Product lab</button>
      </div>
    );
  }

  function HomePage({ setView, setSelected }) {
    const slideList = slides();
    const [active, setActive] = React.useState(0);
    const slide = slideList[active];
    const sideProducts = [featured[1], featured[2], featured[3]];

    React.useEffect(() => {
      const timer = window.setInterval(() => {
        setActive(index => (index + 1) % slideList.length);
      }, 5400);
      return () => window.clearInterval(timer);
    }, [slideList.length]);

    return (
      <main className="page" id="home">
        <section className="lab-hero">
          <div className="hero-console">
            <div>
              <span className="console-kicker">{slide.kicker}</span>
              <h1 className="hero-title">{slide.title}</h1>
              <p className="hero-copy">{slide.copy}</p>
              <div className="hero-actions">
                <button className="primary-action" type="button" onClick={() => setView('products')}>Enter product lab</button>
                <a className="secondary-action" href="mailto:?subject=ARMOR%20BIKE%20OEM%20Inquiry">Start RFQ</a>
              </div>
            </div>
            <div className="data-row">
              <div className="data-cell"><strong>52</strong><span>years</span></div>
              <div className="data-cell"><strong>OEM</strong><span>ODM / OBM</span></div>
              <div className="data-cell"><strong>{products.length}</strong><span>records</span></div>
              <div className="data-cell"><strong>QC</strong><span>validated</span></div>
            </div>
          </div>

          <div className="slide-board">
            <div className="scan-stage">
              <div className="slide-dots" aria-label="Hero slideshow">
                {slideList.map((item, index) => (
                  <button
                    className={`slide-dot ${index === active ? 'active' : ''}`}
                    type="button"
                    key={item.kicker}
                    aria-label={`Slide ${index + 1}`}
                    onClick={() => setActive(index)}
                  />
                ))}
              </div>
              <button
                className="hero-product"
                type="button"
                aria-label={text(slide.product?.name, 'Hero product')}
                onClick={() => { setSelected(slide.product); setView('products'); }}
              >
                <img src={productImage(slide.product)} alt={productAlt(slide.product)} />
              </button>
              <div className="stage-caption">
                <strong>{slide.metric}</strong>
                <span>{slide.metricLabel}</span>
              </div>
            </div>
            <div className="product-stack" aria-label="Three featured product images">
              {sideProducts.map((product, index) => (
                <button
                  className="stack-card"
                  type="button"
                  key={`${text(product?.name, 'product')}-${index}`}
                  onClick={() => { setSelected(product); setView('products'); }}
                >
                  <img src={productImage(product, index % 2)} alt={productAlt(product)} />
                  <span className="stack-label">{text(product?.name, 'ARMOR BIKE')}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section>
          <div className="section-head">
            <div>
              <h2 className="section-title">Category nodes</h2>
              <p className="section-copy">The menu data becomes a technical source map instead of a conventional retail navigation strip.</p>
            </div>
          </div>
          <div className="category-array">
            {categories.map((category, index) => (
              <a className="category-node" href="#products" key={category.id} onClick={() => setView('products')}>
                <span className="node-index">Node {String(index + 1).padStart(2, '0')}</span>
                <span className="node-name">{category.label}</span>
                <span className="node-count">{countProducts(category)} products</span>
              </a>
            ))}
          </div>
        </section>

        <section>
          <div className="section-head">
            <div>
              <h2 className="section-title">Live product modules</h2>
              <p className="section-copy">Product cards sit on a lighter technical surface with consistent image stages and direct detail access.</p>
            </div>
            <button className="secondary-action" type="button" onClick={() => setView('products')}>Open lab</button>
          </div>
          <ProductGrid products={products.slice(0, 4)} setSelected={setSelected} setView={setView} />
        </section>

        <section className="campaign-panel">
          <div className="campaign-copy">
            <span className="console-kicker">EDM signal</span>
            <h2>Campaign artwork becomes a controlled module.</h2>
            <p>Promotional visuals stay visible, but the page architecture remains a future-facing ARMOR BIKE product system.</p>
          </div>
          <div className="campaign-media">
            <img src="uploads/pedal-edm-06162026.png" alt="Rainbow CNC MTB pedals campaign" />
          </div>
        </section>
      </main>
    );
  }

  function ProductLab({ selected, setSelected, setView }) {
    const current = selected || products[0] || fallbackProduct;
    const manufacturerCounts = countBy(products, 'manufacturer');
    const typeCounts = countBy(products, 'leaf');

    return (
      <main className="page" id="products">
        <div className="catalog-layout">
          <aside className="filter-console">
            <h2 className="filter-title">Source filters</h2>
            <FilterGroup title="Availability" rows={[
              ['In stock', products.length, true],
              ['Hot deal', products.filter(p => text(p.badge).toLowerCase().includes('hot')).length, false]
            ]} />
            <FilterGroup title="Type" rows={(typeCounts.length ? typeCounts : [['Accessories', products.length]]).map((row, index) => [row[0], row[1], index === 0])} />
            <FilterGroup title="Manufacturer" rows={(manufacturerCounts.length ? manufacturerCounts : [['ARMOR', products.length]]).map((row, index) => [row[0], row[1], index === 0])} />
          </aside>

          <section>
            <div className="catalog-head">
              <div>
                <span className="console-kicker">ARMOR BIKE product lab</span>
                <h1>{sourceCategory.leaf || sourceCategory.label || 'Product Lab'}</h1>
              </div>
              <div className="catalog-tools">
                <span className="tool-chip"><strong>{products.length}</strong>records</span>
                <span className="tool-chip">live data</span>
              </div>
            </div>

            <ProductDetail product={current} />

            <div className="section-head">
              <div>
                <h2 className="section-title">Selectable SKU grid</h2>
                <p className="section-copy">Select any product to reload the inspection module above without changing the current page.</p>
              </div>
            </div>
            <ProductGrid products={products} setSelected={setSelected} setView={setView} compact />
          </section>
        </div>
      </main>
    );
  }

  function FilterGroup({ title, rows }) {
    return (
      <div className="filter-group">
        <div className="filter-label">{title}</div>
        {rows.map(([label, count, active]) => (
          <div className={`filter-row ${active ? 'active' : ''}`} key={label}>
            <span className="filter-box"></span>
            <span>{label}</span>
            <span className="filter-count">{count}</span>
          </div>
        ))}
      </div>
    );
  }

  function ProductDetail({ product }) {
    return (
      <article className="detail-module">
        <div className="detail-media">
          <img src={productImage(product)} alt={productAlt(product)} />
        </div>
        <div className="detail-copy">
          <span className="maker">{cleanMaker(product)}</span>
          <h2 className="detail-title">{text(product?.name, 'ARMOR BIKE Product')}</h2>
          <p className="detail-spec">{text(product?.spec, 'Premium component selected for OEM, ODM and aftermarket programs.')}</p>
          <div className="detail-metrics">
            <div className="metric-card"><span>Price</span><strong>{productPrice(product)}</strong></div>
            <div className="metric-card"><span>Program</span><strong>OEM ready</strong></div>
            <div className="metric-card"><span>Status</span><strong>{text(product?.badge, 'Available')}</strong></div>
          </div>
          <div className="detail-actions">
            <a className="primary-action" href={`mailto:?subject=${encodeURIComponent(text(product?.name, 'ARMOR BIKE Product') + ' Inquiry')}`}>Request quote</a>
            <a className="secondary-action" href="#home">View campaign</a>
          </div>
        </div>
      </article>
    );
  }

  function ProductGrid({ products, setSelected, setView, compact = false }) {
    return (
      <div className={compact ? 'catalog-grid' : 'product-grid'}>
        {products.map((product, index) => (
          <button
            className="product-card"
            type="button"
            key={`${text(product.name, 'product')}-${index}`}
            onClick={() => { setSelected(product); setView('products'); }}
          >
            <div className="product-media">
              {text(product.badge) && <span className="chip">{product.badge}</span>}
              <img src={productImage(product)} alt={productAlt(product)} />
            </div>
            <div className="product-info">
              <span className="maker">{cleanMaker(product)}</span>
              <span className="product-title">{text(product.name, 'ARMOR BIKE Product')}</span>
              <span className="product-spec">{text(product.spec, 'OEM ready bicycle component')}</span>
              <span className="price-row">
                <span className="price">{productPrice(product)}</span>
                <span className="detail-link">Inspect</span>
              </span>
            </div>
          </button>
        ))}
      </div>
    );
  }

  function App() {
    const [view, setView] = React.useState('home');
    const [selected, setSelected] = React.useState(products[0] || fallbackProduct);

    React.useEffect(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [view]);

    return (
      <div className="future-shell">
        <Header setView={setView} />
        <ViewToggle view={view} setView={setView} />
        {view === 'home'
          ? <HomePage setView={setView} setSelectedProduct={setSelected} setSelected={setSelected} />
          : <ProductLab selected={selected} setSelected={setSelected} setView={setView} />}
      </div>
    );
  }

  ReactDOM.createRoot(document.getElementById('root')).render(<App />);
})();
