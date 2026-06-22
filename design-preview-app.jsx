/* ARMOR BIKE reference-style preview */
(function () {
  const STORE = window.STORE || { categories: [], map: {} };
  const categories = STORE.categories || [];
  const activeCategory = categories.find(c => (c.products || []).length > 0) || categories[0] || { label: 'Bikes', products: [], facets: [], mega: [] };
  const realProducts = activeCategory.products || [];
  const fallbackProducts = [
    {
      manufacturer: 'ARMOR',
      name: 'Trek Fuel EX 9.8 XT',
      spec: 'Carbon trail platform',
      price: '$4,799.99',
      badge: 'NEW',
      images: [{ url: 'uploads/design-preview-rider.png', alt: 'Mountain bike' }]
    }
  ];
  const products = realProducts.length ? realProducts : fallbackProducts;

  function txt(value, fallback = '') {
    return String(value || fallback).trim();
  }

  function maker(product) {
    return txt(product?.manufacturer, 'ARMOR').replace(/\s+/g, ' ');
  }

  function productImage(product, index = 0) {
    const images = Array.isArray(product?.images) ? product.images : [];
    return images[index]?.url || images[0]?.url || product?.image || 'uploads/design-preview-rider.png';
  }

  function productPrice(product, fallback = '$2,999.00') {
    return txt(product?.price, fallback);
  }

  function productBadge(product, index) {
    if (txt(product?.badge)) return product.badge;
    return index % 5 === 1 ? 'BEST SELLER' : index % 3 === 0 ? 'NEW' : index % 4 === 0 ? 'SALE' : '';
  }

  function iconPath(name) {
    const common = { strokeLinecap: 'round', strokeLinejoin: 'round' };
    if (name === 'search') return <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" {...common}></circle><path d="M20 20l-4-4" {...common}></path></svg>;
    if (name === 'user') return <svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" {...common}></circle><path d="M4 21c1.7-4 4.4-6 8-6s6.3 2 8 6" {...common}></path></svg>;
    return <svg viewBox="0 0 24 24"><path d="M6 6h15l-2 9H8L6 3H3" {...common}></path><circle cx="9" cy="20" r="1.5"></circle><circle cx="18" cy="20" r="1.5"></circle></svg>;
  }

  function Header() {
    const [open, setOpen] = React.useState(null);
    const openCategory = categories.find(c => c.id === open);

    return (
      <header className="header" onMouseLeave={() => setOpen(null)}>
        <div className="header-inner">
          <a className="brand" href="#top" aria-label="ARMOR BIKE">
            <span className="shield"></span>
            <span>ARMOR<strong>BIKE</strong></span>
          </a>
          <nav className="nav" aria-label="Main menu">
            {categories.map((cat, index) => (
              <button
                key={cat.id}
                type="button"
                className={`nav-button ${index === 0 || open === cat.id ? 'active' : ''}`}
                onMouseEnter={() => setOpen(cat.id)}
                onFocus={() => setOpen(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </nav>
          <div className="header-icons">
            <button className="icon-btn" type="button" aria-label="Search">{iconPath('search')}</button>
            <button className="icon-btn" type="button" aria-label="Account">{iconPath('user')}</button>
            <button className="icon-btn" type="button" aria-label="Cart">{iconPath('cart')}<span className="cart-badge">2</span></button>
          </div>
        </div>
        {openCategory && <MegaMenu category={openCategory} />}
      </header>
    );
  }

  function MegaMenu({ category }) {
    const mega = category.mega || [];
    return (
      <div className="mega-panel">
        <div className="mega-inner">
          <div className="mega-feature">
            <strong>{category.label}<br />Collection</strong>
            <span>Explore categories, parts families and buyer-ready product paths.</span>
          </div>
          {mega.map((column, index) => (
            <div className="mega-column" key={`${category.id}-${index}`}>
              {(column || []).map(group => (
                <div key={group.title}>
                  <h3>{group.title}</h3>
                  {(group.links || []).slice(0, 8).map(link => <a className="mega-link" href="#products" key={link}>{link}</a>)}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  function Hero() {
    return (
      <section className="hero-wrap" id="top">
        <div className="hero">
          <div className="slide-index">
            <span>01</span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div className="hero-copy">
            <div className="eyebrow">ENGINEERED FOR PERFORMANCE</div>
            <h1 className="hero-title">
              <span>PUSH</span>
              <strong>BEYOND</strong>
              <span className="nowrap">YOUR LIMITS</span>
            </h1>
            <p className="hero-subcopy">Precision. Innovation. Passion.<br />Every ride, elevated.</p>
            <div className="hero-actions">
              <a className="primary-action" href="#products">SHOP BIKES <span>-></span></a>
              <button className="video-action" type="button"><span className="play-dot">></span>WATCH VIDEO</button>
            </div>
          </div>
          <div className="benefit-stack">
            <Benefit icon="trend" title="LIGHTWEIGHT CARBON FRAME" text="20% Lighter" />
            <Benefit icon="shield" title="PREMIUM WARRANTY" text="2 Years Coverage" />
            <Benefit icon="truck" title="FREE SHIPPING" text="On orders over $100" />
          </div>
          <div className="spec-strip">
            <Spec icon="W" title="WEIGHT" value="7.8 kg" />
            <Spec icon="G" title="GEARS" value="24 Speed" />
            <Spec icon="R" title="WHEELS" value='29"' />
            <Spec icon="F" title="FRAME" value="Carbon" />
          </div>
          <div className="hero-arrows">
            <button className="round-btn" type="button" aria-label="Previous">‹</button>
            <button className="round-btn" type="button" aria-label="Next">›</button>
          </div>
        </div>
      </section>
    );
  }

  function Benefit({ icon, title, text }) {
    return (
      <div className="benefit-card">
        <span className="benefit-icon">{benefitIcon(icon)}</span>
        <div><strong>{title}</strong><span>{text}</span></div>
      </div>
    );
  }

  function benefitIcon(icon) {
    if (icon === 'trend') return <svg viewBox="0 0 24 24"><path d="M4 17l5-5 4 4 7-9"></path><path d="M14 7h6v6"></path></svg>;
    if (icon === 'shield') return <svg viewBox="0 0 24 24"><path d="M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6l7-3z"></path><path d="M9 12l2 2 4-5"></path></svg>;
    return <svg viewBox="0 0 24 24"><path d="M3 7h11v9H3z"></path><path d="M14 10h4l3 3v3h-7z"></path><circle cx="7" cy="18" r="2"></circle><circle cx="18" cy="18" r="2"></circle></svg>;
  }

  function Spec({ icon, title, value }) {
    return (
      <div className="spec-item">
        <span className="spec-icon">{icon}</span>
        <div><span>{title}</span><strong>{value}</strong></div>
      </div>
    );
  }

  function CategoryRow() {
    const labels = [
      ['Bikes', 'Explore'],
      ['Parts', 'Upgrade'],
      ['Accessories', 'Gear up'],
      ['Electronics', 'Smart tech'],
      ['More Sports', 'Beyond cycling'],
      ['SALE %', 'Up to 50% off']
    ];
    return (
      <div className="category-row">
        {labels.map(([label, sub], index) => {
          const product = products[index] || products[0];
          return (
            <a className={`category-card ${index === 0 ? 'active' : ''}`} href="#products" key={label}>
              <img src={index === 5 ? 'uploads/pedal-edm-06162026.png' : productImage(product)} alt={label} />
              <div><strong>{label}</strong><span>{sub}</span></div>
            </a>
          );
        })}
      </div>
    );
  }

  function FilterPanel() {
    const groups = [
      ['CATEGORY', ['Mountain Bikes (45)', 'Road Bikes (32)', 'Gravel Bikes (18)', 'E-Bikes (24)', 'Hybrid Bikes (16)']],
      ['PRICE RANGE', ['$300', '$6,000+']],
      ['BRAND', ['Armor (18)', 'Viking X (18)', 'Canyon (12)', 'Santa Cruz (10)', '+ View More']],
      ['WHEEL SIZE', []],
      ['FRAME SIZE', []],
      ['SUSPENSION', []],
      ['COLOR', []],
      ['AVAILABILITY', []]
    ];
    return (
      <aside className="filter-panel">
        <div className="filter-head"><strong>FILTER</strong><button type="button">Clear All</button></div>
        {groups.map((group, groupIndex) => (
          <div className="filter-group" key={group[0]}>
            <div className="filter-title"><span>{group[0]}</span><span>{groupIndex < 3 ? '^' : 'v'}</span></div>
            {group[1].map((label, index) => (
              <div className={`filter-row ${groupIndex === 0 && index === 0 ? 'active' : ''}`} key={label}>
                <span className="box"></span><span>{label}</span>
              </div>
            ))}
          </div>
        ))}
        <button className="apply-btn" type="button">APPLY FILTERS</button>
      </aside>
    );
  }

  function ProductGrid() {
    return (
      <div className="product-grid">
        {products.slice(0, 6).map((product, index) => <ProductCard product={product} index={index} key={`${txt(product.name, 'product')}-${index}`} />)}
      </div>
    );
  }

  function ProductCard({ product, index }) {
    const badge = productBadge(product, index);
    return (
      <button className="product-card" type="button">
        <div className="product-media">
          {badge && <span className={`badge ${badge === 'SALE' ? 'sale' : ''}`}>{badge}</span>}
          <span className="wish">♡</span>
          <img src={productImage(product)} alt={txt(product.name, 'Product')} />
        </div>
        <div className="product-info">
          <div className="product-name">{txt(product.name, 'Armor Bike Product')}</div>
          <div className="product-maker">{maker(product)}</div>
          <div className="price">{productPrice(product)}</div>
          <div className="rating-row">★★★★★ <span style={{ color: '#7a8796' }}>({index + 7})</span></div>
          <div className="card-actions">
            <div className="colors">
              <span className="color-dot" style={{ background: '#111827' }}></span>
              <span className="color-dot" style={{ background: index % 2 ? '#7a8c46' : '#0078ff' }}></span>
              <span className="color-dot" style={{ background: '#c8d0da' }}></span>
            </div>
            <span className="cart-btn">+</span>
          </div>
        </div>
      </button>
    );
  }

  function PromoRow() {
    return (
      <div className="promo-row">
        <Promo title="E-BIKES" text="Power your adventure" image={productImage(products[0])} />
        <Promo title="NEW ARRIVALS" text="Discover the latest collection" image={productImage(products[4] || products[0])} />
        <Promo title="BUY NOW PAY LATER" text="0% interest for 12 months" image="uploads/design-preview-rider.png" />
      </div>
    );
  }

  function Promo({ title, text, image }) {
    return (
      <div className="promo-card">
        <h3>{title}</h3>
        <p>{text}</p>
        <a className="mini-btn" href="#products">LEARN MORE</a>
        <img src={image} alt={title} />
      </div>
    );
  }

  function ServiceRow() {
    return (
      <div className="service-row">
        <Service icon="T" title="FREE SHIPPING" text="On orders over $100" />
        <Service icon="W" title="2-YEAR WARRANTY" text="On selected products" />
        <Service icon="R" title="EASY RETURNS" text="30 days return policy" />
        <Service icon="S" title="EXPERT SUPPORT" text="We're here to help" />
      </div>
    );
  }

  function Service({ icon, title, text }) {
    return <div className="service-item"><span className="service-icon">{icon}</span><div><strong>{title}</strong><span>{text}</span></div></div>;
  }

  function App() {
    return (
      <div className="site">
        <Header />
        <main className="page">
          <Hero />
          <section className="catalog-shell" id="products">
            <CategoryRow />
            <div className="shop-layout">
              <FilterPanel />
              <section>
                <div className="content-head">
                  <div>
                    <div className="crumb">Home › Bikes › Mountain Bikes</div>
                    <h2 className="content-title">Mountain Bikes <span>({products.length || 128} products)</span></h2>
                  </div>
                  <button className="sort-select" type="button">Sort by: Featured v</button>
                </div>
                <ProductGrid />
                <div className="pagination">
                  <button className="page-dot active" type="button">1</button>
                  <button className="page-dot" type="button">2</button>
                  <button className="page-dot" type="button">3</button>
                  <button className="page-dot" type="button">4</button>
                  <button className="page-dot" type="button">›</button>
                </div>
                <PromoRow />
              </section>
            </div>
            <ServiceRow />
          </section>
        </main>
      </div>
    );
  }

  ReactDOM.createRoot(document.getElementById('root')).render(<App />);
})();
