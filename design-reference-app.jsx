/* ARMOR BIKE dark performance reference page */
(function () {
  const STORE = window.STORE || { categories: [], map: {}, HEX: {} };
  const categories = Array.isArray(STORE.categories) ? STORE.categories : [];
  const fallbackCategory = { id: "products", label: "Products", leaf: "Featured", products: [], facets: [], mega: [] };
  const colors = ["#111827", "#009ce0", "#c8d2df", "#18a34a", "#e60012", "#ffd105"];

  function text(value, fallback = "") {
    return String(value || fallback).trim();
  }

  function normalizeProductColor(entry) {
    const raw = text(entry && (entry.hex || entry.color || entry.value || entry.label) ? (entry.hex || entry.color || entry.value || entry.label) : entry);
    if (!raw) return "";
    const mapped = STORE.HEX && STORE.HEX[raw.toLowerCase()] ? STORE.HEX[raw.toLowerCase()] : raw;
    const compact = String(mapped).replace(/\s+/g, "");
    const short = compact.match(/^#?([0-9a-f]{3})$/i);
    if (short) return "#" + short[1].split("").map((ch) => ch + ch).join("").toLowerCase();
    const full = compact.match(/^#?([0-9a-f]{6})$/i);
    return full ? "#" + full[1].toLowerCase() : "";
  }

  function productColors(product) {
    const raw = product && (product.colors || product.colorOptions || product.color);
    const source = Array.isArray(raw) ? raw : text(raw).split(/[\n,;]+/).filter(Boolean);
    const seen = new Set();
    const out = [];
    source.forEach((entry) => {
      const hex = normalizeProductColor(entry);
      if (!hex || seen.has(hex)) return;
      seen.add(hex);
      out.push(hex);
    });
    return out.length ? out : colors;
  }

  function normalizeLabel(value) {
    return text(value)
      .toLowerCase()
      .replace(/&/g, "and")
      .replace(/[^a-z0-9]+/g, "");
  }

  function sameLabel(a, b) {
    const left = normalizeLabel(a);
    const right = normalizeLabel(b);
    return Boolean(left && right && left === right);
  }

  function isPublishedProduct(product) {
    if (!product) return false;
    if (product.published === false || product.isPublished === false || product.visible === false) return false;
    if (product.hidden === true || product.draft === true || product.deleted === true) return false;
    const status = text(product.status || product.state || product.visibility || product.publishStatus).toLowerCase();
    return !["draft", "hidden", "inactive", "archived", "unpublished", "disabled", "deleted", "private"].includes(status);
  }

  function isAvailableProduct(product) {
    if (!product) return false;
    if (product.inStock === false || product.available === false) return false;
    const stock = Number(product.stock);
    if (Number.isFinite(stock) && stock <= 0) return false;
    const status = text(product.availability || product.stockStatus).toLowerCase();
    return !["out of stock", "sold out", "unavailable", "preorder only"].includes(status);
  }

  function productsForCategory(category) {
    const items = Array.isArray(category && category.products) ? category.products : [];
    return items.filter(isPublishedProduct);
  }

  function initialCategory() {
    return categories.find((category) => productsForCategory(category).length) || categories[0] || fallbackCategory;
  }

  function findCategory(value) {
    const key = normalizeLabel(value);
    return categories.find((category) => {
      return normalizeLabel(category.id) === key || normalizeLabel(category.label) === key;
    });
  }

  function initialCatalogSelection(defaultCategory) {
    const params = new URLSearchParams(window.location.search);
    const requestedCategory = params.get("category") || params.get("cat") || "";
    const requestedLeaf = params.get("leaf") || params.get("group") || "";
    const category = requestedCategory ? (findCategory(requestedCategory) || defaultCategory) : defaultCategory;
    return { category, leaf: requestedLeaf };
  }

  function hasLeaf(items, leaf, fallbackLeaf = "") {
    return Boolean(text(leaf) && items.some((product) => sameLabel(text(product && product.leaf, fallbackLeaf), leaf)));
  }

  function filterByLeaf(items, leaf, fallbackLeaf = "") {
    if (!text(leaf)) return items;
    return items.filter((product) => sameLabel(text(product && product.leaf, fallbackLeaf), leaf));
  }

  function scrollToProducts() {
    window.requestAnimationFrame(() => {
      const target = document.getElementById("products");
      if (target) target.scrollIntoView({ behavior: "auto", block: "start" });
    });
  }

  function imageFor(product, fallback = "uploads/reference-promo-ebikes.png") {
    const images = Array.isArray(product && product.images) ? product.images : [];
    return text((images[0] && images[0].url) || product?.image, fallback);
  }

  function productImages(product) {
    const records = [];
    const seen = new Set();
    const append = (entry) => {
      const url = text(entry && entry.url ? entry.url : entry);
      if (!url || seen.has(url)) return;
      seen.add(url);
      records.push({
        url,
        alt: text(entry && entry.alt, text(product && product.name, "Product image"))
      });
    };

    if (Array.isArray(product && product.images)) {
      product.images.forEach(append);
    }
    append(product && product.image);
    if (!records.length) append("uploads/reference-promo-ebikes.png");
    return records;
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

  function productKey(product) {
    return text(product && (product.productId || product.sourceKey || product.name), "product");
  }

  function productUrl(product) {
    return `/Product/?id=${encodeURIComponent(productKey(product))}`;
  }

  function goToProduct(product) {
    window.location.assign(productUrl(product));
  }
  function numericPrice(product) {
    const match = text(product && product.price).replace(/,/g, "").match(/(\d+(?:\.\d+)?)/);
    if (!match) return null;
    const value = Number(match[1]);
    return Number.isFinite(value) ? value : null;
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
      .slice(0, 8)
      .map(([label, count]) => ({ label, count }));
  }

  function parsePrices(items) {
    const values = items
      .map(numericPrice)
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
    if (name === "menu") {
      return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16" {...common}></path><path d="M4 12h16" {...common}></path><path d="M4 17h16" {...common}></path></svg>;
    }
    if (name === "close") {
      return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12" {...common}></path><path d="M18 6L6 18" {...common}></path></svg>;
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

  function Header({ selectedCategory, onSelectCategory, onSelectMegaGroup, onSelectMegaLink }) {
    const [openId, setOpenId] = React.useState(null);
    const [menuOpen, setMenuOpen] = React.useState(false);
    const navItems = categories.length ? categories : [
      { id: "bikes", label: "Bikes", mega: [] },
      { id: "parts", label: "Parts", mega: [] },
      { id: "accessories", label: "Accessories", mega: [] },
      { id: "electronics", label: "Electronics", mega: [] },
      { id: "moresports", label: "More Sports", mega: [] },
      { id: "sale", label: "SALE %", mega: [] }
    ];
    const selectedId = selectedCategory && selectedCategory.id;
    const openCategory = navItems.find((item) => item.id === openId);
    const selectCategory = (category) => {
      setOpenId(null);
      setMenuOpen(false);
      onSelectCategory(category);
    };
    const selectMegaGroup = (category, groupTitle) => {
      setOpenId(null);
      setMenuOpen(false);
      onSelectMegaGroup(category, groupTitle);
    };
    const selectMegaLink = (category, link) => {
      setOpenId(null);
      setMenuOpen(false);
      onSelectMegaLink(category, link);
    };

    return (
      <header className={`header ${menuOpen ? "menu-open" : ""}`} onMouseLeave={() => setOpenId(null)}>
        <div className="header-inner">
          <a className="brand" href="#top" aria-label="ARMOR BIKE home">
            <img
              className="brand-logo-mark"
              src="https://res.cloudinary.com/dvzdptb3i/image/upload/v1782812454/hu6yu8efbexuhis3ulii.png"
              alt="ARMOR BIKE logo mark"
            />
            <img
              className="brand-logo-type"
              src="https://res.cloudinary.com/dvzdptb3i/image/upload/v1782187520/jwnvywanec2ytbbfrqw0.png"
              alt="ARMOR BIKE"
            />
          </a>
          <nav className="main-nav" aria-label="Main navigation">
            {navItems.map((item) => (
              <button
                className={`nav-button ${item.id === "sale" ? "sale" : ""} ${openId === item.id || selectedId === item.id ? "active" : ""}`}
                key={item.id}
                onMouseEnter={() => setOpenId(item.id)}
                onFocus={() => setOpenId(item.id)}
                onClick={() => selectCategory(item)}
                type="button"
              >
                {item.label}
              </button>
            ))}
          </nav>
          <div className="header-tools">
            <button className={`icon-button menu-toggle ${menuOpen ? "active" : ""}`} type="button" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-controls="mobile-menu" aria-expanded={menuOpen} onClick={() => { setOpenId(null); setMenuOpen((value) => !value); }}>{icon(menuOpen ? "close" : "menu")}</button>
            <button className="icon-button utility-search" type="button" aria-label="Search">{icon("search")}</button>
            <button className="icon-button utility-account" type="button" aria-label="Account">{icon("user")}</button>
            <button className="icon-button utility-cart" type="button" aria-label="Cart">{icon("cart")}<span className="cart-badge">2</span></button>
          </div>
        </div>
        {!menuOpen && openCategory && (
          <MegaMenu
            category={openCategory}
            onSelectCategory={selectCategory}
            onSelectMegaGroup={selectMegaGroup}
            onSelectMegaLink={selectMegaLink}
          />
        )}
        {menuOpen && (
          <MobileMenu
            navItems={navItems}
            selectedId={selectedId}
            onSelectCategory={selectCategory}
            onSelectMegaGroup={selectMegaGroup}
            onSelectMegaLink={selectMegaLink}
          />
        )}
      </header>
    );
  }

  function MobileMenu({ navItems, selectedId, onSelectCategory, onSelectMegaGroup, onSelectMegaLink }) {
    const fallbackId = (navItems[0] && navItems[0].id) || "";
    const [activeId, setActiveId] = React.useState(selectedId || fallbackId);

    React.useEffect(() => {
      if (selectedId) {
        setActiveId(selectedId);
      }
    }, [selectedId]);

    const activeItem = navItems.find((item) => item.id === activeId) || navItems[0];
    const groups = activeItem ? (Array.isArray(activeItem.mega) ? activeItem.mega : []).flat().filter(Boolean).slice(0, 3) : [];

    return (
      <div className="mobile-menu" id="mobile-menu">
        <div className="mobile-menu-inner">
          <div className="mobile-menu-tabs" role="tablist" aria-label="Mobile categories">
            {navItems.map((item) => (
              <button
                className={`mobile-menu-tab ${activeItem && activeItem.id === item.id ? "active" : ""}`}
                type="button"
                role="tab"
                aria-selected={activeItem && activeItem.id === item.id}
                onClick={() => setActiveId(item.id)}
                key={item.id}
              >
                {item.label}
              </button>
            ))}
          </div>
          {activeItem && (
            <div className="mobile-menu-current">
              <button className="mobile-menu-button" type="button" onClick={() => onSelectCategory(activeItem)}>
                <span>{activeItem.label}</span>
                <small>View all</small>
              </button>
              {groups.length > 0 && (
                <div className="mobile-menu-groups">
                  {groups.map((group) => (
                    <div className="mobile-menu-group" key={group.title}>
                      <button className="mobile-menu-group-title" type="button" onClick={() => onSelectMegaGroup(activeItem, group.title)}>
                        {group.title}
                      </button>
                      <div className="mobile-menu-links">
                        {(group.links || []).slice(0, 5).map((link) => (
                          <button className="mobile-menu-link" type="button" onClick={() => onSelectMegaLink(activeItem, link)} key={link}>
                            {link}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }


  function MegaMenu({ category, onSelectCategory, onSelectMegaGroup, onSelectMegaLink }) {
    const mega = Array.isArray(category.mega) ? category.mega : [];
    return (
      <div className="mega-panel">
        <div className="mega-inner">
          <button className="mega-feature" type="button" onClick={() => onSelectCategory(category)}>
            <strong>{category.label}<br />Collection</strong>
            <span>Performance paths, product families and fast entry points from the live catalog.</span>
          </button>
          {mega.slice(0, 4).map((column, columnIndex) => (
            <div className="mega-column" key={`${category.id}-${columnIndex}`}>
              {(column || []).map((group) => (
                <div className="mega-group" key={group.title}>
                  <button className="mega-group-title" type="button" onClick={() => onSelectMegaGroup(category, group.title)}>
                    {group.title}
                  </button>
                  {(group.links || []).slice(0, 8).map((link) => (
                    <button className="mega-link" type="button" onClick={() => onSelectMegaLink(category, link)} key={link}>
                      {link}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  function Hero({ onExplore }) {
    return (
      <section className="hero" id="top" aria-label="Ride beyond limits hero">
        <img className="hero-picture" src="uploads/reference-dark-hero-full.png" alt="Cyclist riding through mountain road with ARMOR BIKE performance graphics" />
        <h1 className="sr-only">Ride Beyond Limits</h1>
        <button className="hero-hotspot" type="button" aria-label="Explore collection" onClick={onExplore}></button>
        <button className="hero-arrow prev" type="button" aria-label="Previous slide">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round"></path></svg>
        </button>
        <button className="hero-arrow next" type="button" aria-label="Next slide">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"></path></svg>
        </button>
      </section>
    );
  }

  function CategoryStrip({ onSelectCategory }) {
    const [activeCard, setActiveCard] = React.useState(null);
    const cards = [
      { id: "bikes", label: "Bikes", image: "uploads/reference-card-bikes.png", x: "0%", w: "21.476%", shape: "polygon(0% 0%, 100% 0%, 76.78% 100%, 0% 100%)" },
      { id: "parts", label: "Parts", image: "uploads/reference-card-parts.png", x: "16.489%", w: "21.277%", shape: "polygon(23.44% 0%, 100% 0%, 77.5% 100%, 0% 100%)" },
      { id: "accessories", label: "Accessories", image: "uploads/reference-card-accessories.png", x: "32.979%", w: "20.678%", shape: "polygon(23.15% 0%, 100% 0%, 76.53% 100%, 0% 100%)" },
      { id: "electronics", label: "Electronics", image: "uploads/reference-card-electronics.png", x: "48.803%", w: "19.083%", shape: "polygon(25.44% 0%, 100% 0%, 74.91% 100%, 0% 100%)" },
      { id: "moresports", label: "More Sports", image: "uploads/reference-card-more-sports.png", x: "63.098%", w: "22.54%", shape: "polygon(21.24% 0%, 100% 0%, 76.99% 100%, 0% 100%)" },
      { id: "sale", label: "Sale", image: "uploads/reference-card-sale.png", x: "80.452%", w: "19.548%", shape: "polygon(26.53% 0%, 100% 0%, 73.47% 100%, 0% 100%)" }
    ];
    return (
      <section className="category-shell" aria-label="Featured category shortcuts" onMouseLeave={() => setActiveCard(null)}>
        <div className="category-strip">
          {cards.map((card, index) => (
            <a
              className={`category-card${activeCard && activeCard.label === card.label ? " is-active" : ""}`}
              href="#products"
              key={card.label}
              style={{ "--x": card.x, "--w": card.w, "--shape": card.shape, "--z": index + 2 }}
              aria-label={card.label}
              onClick={(event) => {
                event.preventDefault();
                onSelectCategory(findCategory(card.id) || findCategory(card.label) || { id: card.id, label: card.label, products: [] });
              }}
              onMouseEnter={() => setActiveCard(card)}
              onFocus={() => setActiveCard(card)}
              onBlur={() => setActiveCard(null)}
            >
              <img src={card.image} alt="" aria-hidden="true" />
            </a>
          ))}
          {activeCard && (
            <div
              className="category-popout"
              style={{ "--x": activeCard.x, "--w": activeCard.w, "--shape": activeCard.shape }}
              aria-hidden="true"
            >
              <img src={activeCard.image} alt="" />
            </div>
          )}
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

  function PromoRow({ onSelectCategory, onSelectMegaLink }) {
    const bikes = findCategory("bikes") || { id: "bikes", label: "Bikes", leaf: "E-Bikes", products: [] };
    const parts = findCategory("parts") || fallbackCategory;
    return (
      <section className="promo-row" aria-label="Promotions">
        <button className="promo-card" type="button" onClick={() => onSelectMegaLink(bikes, "E-Bikes")}><img src="uploads/reference-promo-ebikes.png" alt="E-bikes promotion" /></button>
        <button className="promo-card" type="button" onClick={() => onSelectCategory(parts)}><img src="uploads/reference-promo-arrivals.png" alt="New arrivals promotion" /></button>
        <button className="promo-card" type="button" onClick={() => onSelectCategory(parts)}><img src="uploads/reference-promo-bestsellers.png" alt="Best sellers promotion" /></button>
      </section>
    );
  }

  function FilterPanel({
    category,
    products,
    exactLeafFilter,
    manufacturerFilter,
    inStockOnly,
    onSelectLeaf,
    onSelectManufacturer,
    onToggleAvailability,
    onClearFilters
  }) {
    const leafProducts = exactLeafFilter ? filterByLeaf(products, exactLeafFilter, category.leaf || category.label) : products;
    const manufacturerProducts = manufacturerFilter ? leafProducts.filter((product) => sameLabel(product.manufacturer, manufacturerFilter)) : leafProducts;
    const manufacturers = makeCounts(leafProducts, "manufacturer", "ARMOR");
    const leaves = makeCounts(products, "leaf", category.leaf || category.label || "Products");
    const price = parsePrices(products);
    const availableCount = manufacturerProducts.filter(isAvailableProduct).length;
    return (
      <aside className="filter-panel" aria-label="Product filters">
        <div className="filter-head">
          <strong>FILTER</strong>
          <button type="button" onClick={onClearFilters}>Clear All</button>
        </div>
        <div className="filter-group">
          <div className="filter-title"><span>Category</span><span>+</span></div>
          {leaves.length ? leaves.map((item) => (
            <FilterRow
              item={item}
              active={sameLabel(exactLeafFilter, item.label)}
              key={item.label}
              onClick={() => onSelectLeaf(item.label)}
            />
          )) : <div className="filter-empty">No category items</div>}
        </div>
        <div className="filter-group">
          <div className="filter-title"><span>Price Range</span><span>+</span></div>
          <div className="range-track"></div>
          <div className="range-labels"><span>USD {price.min}</span><span>USD {price.max || 199}+</span></div>
        </div>
        <div className="filter-group">
          <div className="filter-title"><span>Brand</span><span>+</span></div>
          {manufacturers.length ? manufacturers.map((item) => (
            <FilterRow
              item={item}
              active={sameLabel(manufacturerFilter, item.label)}
              key={item.label}
              onClick={() => onSelectManufacturer(item.label)}
            />
          )) : <div className="filter-empty">No brands</div>}
        </div>
        <div className="filter-group">
          <div className="filter-title"><span>Color</span><span>+</span></div>
          <div className="color-grid">
            {colors.map((color) => <span className="swatch" style={{ background: color }} key={color}></span>)}
          </div>
        </div>
        <div className="filter-group">
          <div className="filter-title"><span>Availability</span><span>+</span></div>
          <FilterRow item={{ label: "In stock", count: availableCount }} active={inStockOnly} onClick={onToggleAvailability} />
        </div>
        <button className="apply-button" type="button" onClick={scrollToProducts}>APPLY FILTERS</button>
      </aside>
    );
  }

  function FilterRow({ item, active, onClick }) {
    return (
      <button className={`filter-row ${active ? "active" : ""}`} type="button" aria-pressed={active} onClick={onClick}>
        <span className="check"></span>
        <span>{item.label}</span>
        <span className="filter-count">{item.count}</span>
      </button>
    );
  }

  function Catalog({
    category,
    currentLeaf,
    baseProducts,
    visibleProducts,
    exactLeafFilter,
    manufacturerFilter,
    inStockOnly,
    onSelectLeaf,
    onSelectManufacturer,
    onToggleAvailability,
    onClearFilters
  }) {
    return (
      <section className="catalog" id="products">
        <div className="catalog-top">
          <div>
            <div className="crumbs"><span>Home</span><span>/</span><span>{category.label}</span><span>/</span><span>{currentLeaf || "Featured"}</span></div>
            <h2>{category.label} <span>({visibleProducts.length} products)</span></h2>
          </div>
          <button className="sort" type="button">Sort by: Featured</button>
        </div>
        <div className="catalog-layout">
          <FilterPanel
            category={category}
            products={baseProducts}
            exactLeafFilter={exactLeafFilter}
            manufacturerFilter={manufacturerFilter}
            inStockOnly={inStockOnly}
            onSelectLeaf={onSelectLeaf}
            onSelectManufacturer={onSelectManufacturer}
            onToggleAvailability={onToggleAvailability}
            onClearFilters={onClearFilters}
          />
          <div className="product-grid">
            {visibleProducts.length ? visibleProducts.map((product, index) => (
              <ProductCard product={product} index={index} key={`${text(product.productId || product.sourceKey || product.name, "product")}-${index}`} />
            )) : (
              <div className="empty-catalog">
                <strong>No listed products in this section yet.</strong>
                <span>Only published catalog items from the selected menu path are shown here.</span>
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }

  function ProductCard({ product, index }) {
    const badge = badgeFor(product, index);
    const badgeClass = badge.toLowerCase().includes("sale") ? "sale" : badge.toLowerCase().includes("hot") ? "hot" : "";
    const images = productImages(product);
    const [imageIndex, setImageIndex] = React.useState(0);
    const activeImage = images[imageIndex] || images[0];
    const hasMultipleImages = images.length > 1;

    React.useEffect(() => {
      setImageIndex(0);
    }, [product && product.productId, product && product.sourceKey, product && product.name]);

    function showImage(nextIndex) {
      setImageIndex((current) => {
        const next = typeof nextIndex === "number" ? nextIndex : current;
        return (next + images.length) % images.length;
      });
    }

    return (
      <article
        className="product-card"
        role="link"
        tabIndex="0"
        aria-label={`View ${text(product.name, "product")}`}
        onClick={(event) => {
          if (event.target.closest("button, a")) return;
          goToProduct(product);
        }}
        onKeyDown={(event) => {
          if (event.key !== "Enter" && event.key !== " ") return;
          event.preventDefault();
          goToProduct(product);
        }}
      >
        <div className="product-media">
          {badge && <span className={`badge ${badgeClass}`}>{badge}</span>}
          <span className="heart-button">{icon("heart")}</span>
          <img src={activeImage.url} alt={text(activeImage.alt, text(product.name, "Product"))} onClick={(event) => { event.stopPropagation(); goToProduct(product); }} />
          {hasMultipleImages && (
            <React.Fragment>
              <button
                className="product-image-control prev"
                type="button"
                aria-label="Previous product image"
                onClick={() => showImage(imageIndex - 1)}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round"></path></svg>
              </button>
              <button
                className="product-image-control next"
                type="button"
                aria-label="Next product image"
                onClick={() => showImage(imageIndex + 1)}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"></path></svg>
              </button>
              <div className="product-image-dots" aria-label="Product image selector">
                {images.map((image, dotIndex) => (
                  <button
                    className={`product-image-dot ${dotIndex === imageIndex ? "active" : ""}`}
                    type="button"
                    aria-label={`Show product image ${dotIndex + 1}`}
                    aria-pressed={dotIndex === imageIndex}
                    key={`${image.url}-${dotIndex}`}
                    onClick={() => showImage(dotIndex)}
                  ></button>
                ))}
              </div>
            </React.Fragment>
          )}
        </div>
        <div className="product-info">
          <div className="product-name">{text(product.name, "ARMOR Product")}</div>
          <div className="product-maker">{text(product.manufacturer, "ARMOR")}</div>
          <div className="product-spec">{text(product.spec || product.note || product.leaf, "Performance cycling equipment")}</div>
          <div className="product-price">{priceFor(product)}</div>
          <div className="rating">***** <span>({index + 8})</span></div>
          <div className="card-actions">
            <div className="product-swatches">
              {productColors(product).slice(0, 4).map((color) => <span className="product-dot" style={{ background: color }} key={`${product.name}-${color}`}></span>)}
            </div>
            <span className="cart-button">{icon("cart")}</span>
          </div>
        </div>
      </article>
    );
  }
  function App() {
    const defaultCategory = React.useMemo(() => initialCategory(), []);
    const initialSelection = React.useMemo(() => initialCatalogSelection(defaultCategory), [defaultCategory]);
    const initialLeaf = initialSelection.leaf || "";
    const [selectedCategoryId, setSelectedCategoryId] = React.useState((initialSelection.category && (initialSelection.category.id || initialSelection.category.label)) || defaultCategory.id || defaultCategory.label);
    const [displayLeaf, setDisplayLeaf] = React.useState(initialLeaf);
    const [exactLeafFilter, setExactLeafFilter] = React.useState(initialLeaf);
    const [manufacturerFilter, setManufacturerFilter] = React.useState("");
    const [inStockOnly, setInStockOnly] = React.useState(false);

    const selectedCategory = React.useMemo(() => {
      return categories.find((category) => category.id === selectedCategoryId) || defaultCategory || fallbackCategory;
    }, [defaultCategory, selectedCategoryId]);

    const baseProducts = React.useMemo(() => productsForCategory(selectedCategory), [selectedCategory]);

    const visibleProducts = React.useMemo(() => {
      let items = exactLeafFilter ? filterByLeaf(baseProducts, exactLeafFilter, selectedCategory.leaf || selectedCategory.label) : baseProducts;
      if (manufacturerFilter) items = items.filter((product) => sameLabel(product.manufacturer, manufacturerFilter));
      if (inStockOnly) items = items.filter(isAvailableProduct);
      return items;
    }, [baseProducts, exactLeafFilter, manufacturerFilter, inStockOnly]);

    const currentLeaf = displayLeaf || selectedCategory.leaf || "Featured";

    React.useEffect(() => {
      if (window.location.hash === "#products" || initialLeaf) scrollToProducts();
    }, []);

    function selectCategory(category, options = {}) {
      const target = category && category.id ? category : findCategory(category) || fallbackCategory;
      setSelectedCategoryId(target.id || target.label);
      setDisplayLeaf(options.leaf || "");
      setExactLeafFilter(options.exactLeaf || "");
      setManufacturerFilter("");
      setInStockOnly(false);
      if (options.scroll !== false) scrollToProducts();
    }

    function selectMegaGroup(category, leaf) {
      const exactLeaf = hasLeaf(productsForCategory(category), leaf, category.leaf || category.label) ? leaf : "";
      selectCategory(category, { leaf, exactLeaf });
    }

    function selectMegaLink(category, leaf) {
      selectCategory(category, { leaf, exactLeaf: leaf });
    }

    function selectFilterLeaf(leaf) {
      const nextLeaf = sameLabel(exactLeafFilter, leaf) ? "" : leaf;
      setDisplayLeaf(nextLeaf);
      setExactLeafFilter(nextLeaf);
      setManufacturerFilter("");
      scrollToProducts();
    }

    function selectManufacturer(manufacturer) {
      setManufacturerFilter((current) => sameLabel(current, manufacturer) ? "" : manufacturer);
      scrollToProducts();
    }

    function toggleAvailability() {
      setInStockOnly((current) => !current);
      scrollToProducts();
    }

    function clearFilters() {
      setDisplayLeaf("");
      setExactLeafFilter("");
      setManufacturerFilter("");
      setInStockOnly(false);
      scrollToProducts();
    }

    return (
      <main className="page">
        <Header
          selectedCategory={selectedCategory}
          onSelectCategory={selectCategory}
          onSelectMegaGroup={selectMegaGroup}
          onSelectMegaLink={selectMegaLink}
        />
        <Hero onExplore={scrollToProducts} />
        <CategoryStrip onSelectCategory={selectCategory} />
        <Services />
        <PromoRow onSelectCategory={selectCategory} onSelectMegaLink={selectMegaLink} />
        <Catalog
          category={selectedCategory}
          currentLeaf={currentLeaf}
          baseProducts={baseProducts}
          visibleProducts={visibleProducts}
          exactLeafFilter={exactLeafFilter}
          manufacturerFilter={manufacturerFilter}
          inStockOnly={inStockOnly}
          onSelectLeaf={selectFilterLeaf}
          onSelectManufacturer={selectManufacturer}
          onToggleAvailability={toggleAvailability}
          onClearFilters={clearFilters}
        />
      </main>
    );
  }

  ReactDOM.createRoot(document.getElementById("root")).render(<App />);
})();
