/* ARMOR BIKE dark performance reference page */
(function () {
  const STORE = window.STORE || { categories: [], map: {}, HEX: {} };
  const categories = Array.isArray(STORE.categories) ? STORE.categories : [];
  const catalogCategory = categories.find((category) => Array.isArray(category.products) && category.products.length) || categories[0] || { label: "Products", products: [], facets: [], mega: [] };
  const products = Array.isArray(catalogCategory.products) ? catalogCategory.products : [];
  const colors = ["#111827", "#009ce0", "#c8d2df", "#18a34a", "#e60012", "#ffd105"];

  function text(value, fallback = "") {
    return String(value || fallback).trim();
  }

  function imageFor(product, fallback = "uploads/reference-promo-ebikes.png") {
    const images = Array.isArray(product && product.images) ? product.images : [];
    return text((images[0] && images[0].url) || product?.image, fallback);
  }

  function badgeFor(product, index) {
    const badge = text(product && product.badge);
    if (badge) return badge;
    if (index === 0) return "New";
    if (index === 3) return "Sale";
    if (index === 5) return "Hot";
    return "";
  }

  function priceFor(product) {
    return text(product && product.price, "Contact for price");
  }

  function makeCounts(items, key, fallbackLabel) {
    const counts = new Map();
    items.forEach((item) => {
      const label = text(item && item[key], fallbackLabel);
      if (!label) return;
      counts.set(label, (counts.get(label) || 0) + 1);
    });
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .slice(0, 6)
      .map(([label, count]) => ({ label, count }));
  }

  function parsePrices(items) {
    const values = items
      .map((item) => text(item && item.price).match(/(\d+(?:\.\d+)?)/))
      .filter(Boolean)
      .map((match) => Number(match[1]))
      .filter((value) => Number.isFinite(value));
    if (!values.length) return { min: 0, max: 0 };
    return { min: Math.floor(Math.min(...values)), max: Math.ceil(Math.max(...values)) };
  }

  function icon(name) {
    const common = { strokeLinecap: "round", strokeLinejoin: "round" };
    if (name === "search") {
      return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7" {...common}></circle><path d="M20 20l-4.2-4.2" {...common}></path></svg>;
    }
    if (name === "user") {
      return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="7.8" r="4" {...common}></circle><path d="M4 21c1.8-4.3 4.4-6.4 8-6.4s6.2 2.1 8 6.4" {...common}></path></svg>;
    }
    if (name === "cart") {
      return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5.2 5.8h15.2l-2.1 9.4H7.7L5.2 2.8H2.8" {...common}></path><circle cx="9" cy="20" r="1.5"></circle><circle cx="18" cy="20" r="1.5"></circle></svg>;
    }
    if (name === "truck") {
      return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 7h11v9H3z" {...common}></path><path d="M14 10h4l3 3v3h-7z" {...common}></path><circle cx="7" cy="18" r="2"></circle><circle cx="18" cy="18" r="2"></circle></svg>;
    }
    if (name === "shield") {
      return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l7 3v5.2c0 4.6-2.7 7.7-7 9.8-4.3-2.1-7-5.2-7-9.8V6l7-3z" {...common}></path><path d="M8.8 12l2.1 2.1 4.5-5" {...common}></path></svg>;
    }
    if (name === "return") {
      return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 9a7.5 7.5 0 1 1 1.6 10.3" {...common}></path><path d="M5 4v5h5" {...common}></path></svg>;
    }
    if (name === "support") {
      return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 13a8 8 0 0 1 16 0" {...common}></path><path d="M4 13v4a2 2 0 0 0 2 2h1v-7H6a2 2 0 0 0-2 2" {...common}></path><path d="M20 13v4a2 2 0 0 1-2 2h-1v-7h1a2 2 0 0 1 2 2" {...common}></path><path d="M14 21h-3" {...common}></path></svg>;
    }
    if (name === "heart") {
      return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.4 6.8c-1.5-2.1-4.7-2.2-6.3-.2L12 9.1 9.9 6.6c-1.6-2-4.8-1.9-6.3.2-1.5 2-.9 4.8 1 6.5L12 20l7.4-6.7c1.9-1.7 2.5-4.5 1-6.5z" strokeLinecap="round" strokeLinejoin="round"></path></svg>;
    }
    return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6h15l-2 9H8L6 3H3" strokeLinecap="round" strokeLinejoin="round"></path><circle cx="9" cy="20" r="1.4"></circle><circle cx="18" cy="20" r="1.4"></circle></svg>;
  }

  function Header() {
    const [openId, setOpenId] = React.useState(null);
    const navItems = categories.length ? categories : [
      { id: "bikes", label: "Bikes", mega: [] },
      { id: "parts", label: "Parts", mega: [] },
      { id: "accessories", label: "Accessories", mega: [] },
      { id: "electronics", label: "Electronics", mega: [] },
      { id: "moresports", label: "More Sports", mega: [] },
      { id: "sale", label: "SALE %", mega: [] }
    ];
    const openCategory = navItems.find((item) => item.id === openId);

    return (
      <header className="header" onMouseLeave={() => setOpenId(null)}>
        <div className="header-inner">
          <a className="brand" href="#top" aria-label="ARMOR BIKE home">
            <span className="brand-mark" aria-hidden="true"></span>
            <span className="brand-text"><span>ARMOR</span><span>BIKE</span></span>
          </a>
          <nav className="main-nav" aria-label="Main navigation">
            {navItems.map((item, index) => (
              <button
                className={`nav-button ${item.id === "sale" ? "sale" : ""} ${openId === item.id || (!openId && index === 0) ? "active" : ""}`}
                key={item.id}
                onMouseEnter={() => setOpenId(item.id)}
                onFocus={() => setOpenId(item.id)}
                onClick={() => setOpenId(openId === item.id ? null : item.id)}
                type="button"
              >
                {item.label}
              </button>
            ))}
          </nav>
          <div className="header-tools">
            <button className="icon-button" type="button" aria-label="Search">{icon("search")}</button>
            <button className="icon-button" type="button" aria-label="Account">{icon("user")}</button>
            <button className="icon-button" type="button" aria-label="Cart">{icon("cart")}<span className="cart-badge">2</span></button>
          </div>
        </div>
        {openCategory && <MegaMenu category={openCategory} />}
      </header>
    );
  }

  function MegaMenu({ category }) {
    const mega = Array.isArray(category.mega) ? category.mega : [];
    return (
      <div className="mega-panel">
        <div className="mega-inner">
          <a className="mega-feature" href="#products">
            <strong>{category.label}<br />Collection</strong>
            <span>Performance paths, product families and fast entry points from the live catalog.</span>
          </a>
          {mega.slice(0, 4).map((column, columnIndex) => (
            <div className="mega-column" key={`${category.id}-${columnIndex}`}>
              {(column || []).map((group) => (
                <div className="mega-group" key={group.title}>
                  <h3>{group.title}</h3>
                  {(group.links || []).slice(0, 8).map((link) => (
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

  function Hero() {
    return (
      <section className="hero" id="top" aria-label="Ride beyond limits hero">
        <img className="hero-picture" src="uploads/reference-dark-hero-full.png" alt="Cyclist riding through mountain road with ARMOR BIKE performance graphics" />
        <h1 className="sr-only">Ride Beyond Limits</h1>
        <a className="hero-hotspot" href="#products" aria-label="Explore collection"></a>
        <button className="hero-arrow prev" type="button" aria-label="Previous slide">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round"></path></svg>
        </button>
        <button className="hero-arrow next" type="button" aria-label="Next slide">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"></path></svg>
        </button>
      </section>
    );
  }

  function CategoryStrip() {
    const cards = [
      { label: "Bikes", image: "uploads/reference-card-bikes.png", x: "0%", w: "21.476%", shape: "polygon(0% 0%, 100% 0%, 76.78% 100%, 0% 100%)" },
      { label: "Parts", image: "uploads/reference-card-parts.png", x: "16.489%", w: "21.277%", shape: "polygon(23.44% 0%, 100% 0%, 77.5% 100%, 0% 100%)" },
      { label: "Accessories", image: "uploads/reference-card-accessories.png", x: "32.979%", w: "20.678%", shape: "polygon(23.15% 0%, 100% 0%, 76.53% 100%, 0% 100%)" },
      { label: "Electronics", image: "uploads/reference-card-electronics.png", x: "48.803%", w: "19.083%", shape: "polygon(25.44% 0%, 100% 0%, 74.91% 100%, 0% 100%)" },
      { label: "More Sports", image: "uploads/reference-card-more-sports.png", x: "63.098%", w: "22.54%", shape: "polygon(21.24% 0%, 100% 0%, 76.99% 100%, 0% 100%)" },
      { label: "Sale", image: "uploads/reference-card-sale.png", x: "80.452%", w: "19.548%", shape: "polygon(26.53% 0%, 100% 0%, 73.47% 100%, 0% 100%)" }
    ];
    return (
      <section className="category-shell" aria-label="Featured category shortcuts">
        <div className="category-strip">
          {cards.map((card, index) => (
            <a
              className="category-card"
              href="#products"
              key={card.label}
              style={{ "--x": card.x, "--w": card.w, "--shape": card.shape, "--z": index + 2 }}
              aria-label={card.label}
            >
              <img src={card.image} alt="" aria-hidden="true" />
            </a>
          ))}
        </div>
      </section>
    );
  }

  function Services() {
    const services = [
      ["truck", "FREE SHIPPING", "On orders over $100"],
      ["shield", "2-YEAR WARRANTY", "On selected products"],
      ["return", "EASY RETURNS", "30 days return policy"],
      ["support", "EXPERT SUPPORT", "We are here to help"]
    ];
    return (
      <section className="services" aria-label="Service promises">
        {services.map(([iconName, title, copy]) => (
          <div className="service" key={title}>
            {icon(iconName)}
            <div><strong>{title}</strong><span>{copy}</span></div>
          </div>
        ))}
      </section>
    );
  }

  function PromoRow() {
    return (
      <section className="promo-row" aria-label="Promotions">
        <a className="promo-card" href="#products"><img src="uploads/reference-promo-ebikes.png" alt="E-bikes promotion" /></a>
        <a className="promo-card" href="#products"><img src="uploads/reference-promo-arrivals.png" alt="New arrivals promotion" /></a>
        <a className="promo-card" href="#products"><img src="uploads/reference-promo-bestsellers.png" alt="Best sellers promotion" /></a>
      </section>
    );
  }

  function FilterPanel() {
    const manufacturers = makeCounts(products, "manufacturer", "ARMOR");
    const leaves = makeCounts(products, "leaf", catalogCategory.leaf || catalogCategory.label || "Products");
    const price = parsePrices(products);
    return (
      <aside className="filter-panel" aria-label="Product filters">
        <div className="filter-head">
          <strong>FILTER</strong>
          <button type="button">Clear All</button>
        </div>
        <div className="filter-group">
          <div className="filter-title"><span>Category</span><span>+</span></div>
          {leaves.map((item, index) => <FilterRow item={item} active={index === 0} key={item.label} />)}
        </div>
        <div className="filter-group">
          <div className="filter-title"><span>Price Range</span><span>+</span></div>
          <div className="range-track"></div>
          <div className="range-labels"><span>USD {price.min}</span><span>USD {price.max || 199}+</span></div>
        </div>
        <div className="filter-group">
          <div className="filter-title"><span>Brand</span><span>+</span></div>
          {manufacturers.map((item, index) => <FilterRow item={item} active={index === 0} key={item.label} />)}
        </div>
        <div className="filter-group">
          <div className="filter-title"><span>Color</span><span>+</span></div>
          <div className="color-grid">
            {colors.map((color) => <span className="swatch" style={{ background: color }} key={color}></span>)}
          </div>
        </div>
        <div className="filter-group">
          <div className="filter-title"><span>Availability</span><span>+</span></div>
          <FilterRow item={{ label: "In stock", count: products.length }} active={true} />
        </div>
        <button className="apply-button" type="button">APPLY FILTERS</button>
      </aside>
    );
  }

  function FilterRow({ item, active }) {
    return (
      <div className={`filter-row ${active ? "active" : ""}`}>
        <span className="check"></span>
        <span>{item.label}</span>
        <span className="filter-count">{item.count}</span>
      </div>
    );
  }

  function Catalog() {
    const visibleProducts = products.length ? products : [{
      manufacturer: "ARMOR",
      name: "Performance Bike Kit",
      spec: "Reference product layout",
      price: "Contact for price",
      images: [{ url: "uploads/reference-promo-ebikes.png", alt: "Performance bike kit" }]
    }];
    return (
      <section className="catalog" id="products">
        <div className="catalog-top">
          <div>
            <div className="crumbs"><span>Home</span><span>/</span><span>{catalogCategory.label}</span><span>/</span><span>{catalogCategory.leaf || "Featured"}</span></div>
            <h2>{catalogCategory.label} <span>({visibleProducts.length} products)</span></h2>
          </div>
          <button className="sort" type="button">Sort by: Featured</button>
        </div>
        <div className="catalog-layout">
          <FilterPanel />
          <div className="product-grid">
            {visibleProducts.slice(0, 12).map((product, index) => <ProductCard product={product} index={index} key={`${text(product.name, "product")}-${index}`} />)}
          </div>
        </div>
      </section>
    );
  }

  function ProductCard({ product, index }) {
    const badge = badgeFor(product, index);
    const badgeClass = badge.toLowerCase().includes("sale") ? "sale" : badge.toLowerCase().includes("hot") ? "hot" : "";
    return (
      <button className="product-card" type="button">
        <div className="product-media">
          {badge && <span className={`badge ${badgeClass}`}>{badge}</span>}
          <span className="heart-button">{icon("heart")}</span>
          <img src={imageFor(product)} alt={text(product?.images?.[0]?.alt, text(product.name, "Product"))} />
        </div>
        <div className="product-info">
          <div className="product-name">{text(product.name, "ARMOR Product")}</div>
          <div className="product-maker">{text(product.manufacturer, "ARMOR")}</div>
          <div className="product-spec">{text(product.spec || product.note || product.leaf, "Performance cycling equipment")}</div>
          <div className="product-price">{priceFor(product)}</div>
          <div className="rating">***** <span>({index + 8})</span></div>
          <div className="card-actions">
            <div className="product-swatches">
              {colors.slice(0, 3).map((color) => <span className="product-dot" style={{ background: color }} key={`${product.name}-${color}`}></span>)}
            </div>
            <span className="cart-button">{icon("cart")}</span>
          </div>
        </div>
      </button>
    );
  }

  function App() {
    return (
      <main className="page">
        <Header />
        <Hero />
        <CategoryStrip />
        <Services />
        <PromoRow />
        <Catalog />
      </main>
    );
  }

  ReactDOM.createRoot(document.getElementById("root")).render(<App />);
})();
