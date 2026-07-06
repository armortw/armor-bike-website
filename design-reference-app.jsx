/* ARMOR BIKE dark performance reference page */
(function () {
  const STORE = window.STORE || { categories: [], map: {}, HEX: {} };
  const categories = Array.isArray(STORE.categories) ? STORE.categories : [];
  const fallbackCategory = { id: "products", label: "Products", leaf: "Featured", products: [], facets: [], mega: [] };
  const filterColors = ["#111827", "#009ce0", "#c8d2df", "#18a34a", "#e60012", "#ffd105"];
  const CHAMELEON_VALUE = "__chameleon__";
  const CHAMELEON_COLORS = ["#65a30d", "#14b8a6", "#7c3aed"];
  const CHAMELEON_GRADIENT = "linear-gradient(135deg, #65a30d 0%, #14b8a6 48%, #7c3aed 100%)";
  function isChameleonColor(value) {
    const raw = text(value);
    return raw === "變色龍" || raw.toLowerCase() === "chameleon" || raw.toLowerCase() === CHAMELEON_VALUE;
  }
  function colorLabel(color) {
    return isChameleonColor(color) ? "變色龍" : String(color || "").toUpperCase();
  }
  function colorBackground(color) {
    return isChameleonColor(color) ? CHAMELEON_GRADIENT : color;
  }
  function text(value, fallback = "") {
    return String(value || fallback)
      .replace(/\r\n|\r|\n/g, "\n")
      .replace(/\\r\\n|\\n|\\r/g, "\n")
      .trim();
  }

  function lineBreaks(value, fallback = "") {
    const valueText = text(value, fallback);
    const lines = valueText ? valueText.split(/\n/) : [];
    if (!lines.length) return fallback;
    return lines.map((line, index) => (
      <React.Fragment key={index}>{index > 0 && <br />}{line}</React.Fragment>
    ));
  }
  function normalizeProductColor(entry) {
    const raw = text(entry && (entry.hex || entry.color || entry.value || entry.label) ? (entry.hex || entry.color || entry.value || entry.label) : entry);
    if (!raw) return "";
    if (isChameleonColor(raw)) return CHAMELEON_VALUE;
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
    const hasLegacyChameleon = CHAMELEON_COLORS.every((hex) => seen.has(hex));
    if (seen.has(CHAMELEON_VALUE) || hasLegacyChameleon) {
      return [CHAMELEON_VALUE, ...out.filter((color) => color !== CHAMELEON_VALUE && !CHAMELEON_COLORS.includes(color))];
    }
    return out;
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


  const FRONT_WISHLIST_KEY = "wishlist";
  const FRONT_CART_KEY = "cart";

  function emptyFrontLists() {
    return { [FRONT_WISHLIST_KEY]: [], [FRONT_CART_KEY]: [] };
  }

  function frontListItems(lists, key) {
    const data = lists && lists[key];
    return Array.isArray(data) ? data : [];
  }

  function nextFrontLists(lists, key, item) {
    const current = frontListItems(lists, key);
    return {
      ...emptyFrontLists(),
      ...(lists || {}),
      [key]: [item, ...current.filter((entry) => String(entry.id) !== String(item.id))].slice(0, 80)
    };
  }

  function frontProductItem(product, category) {
    const image = (productImages(product)[0] || {}).url || "";
    return {
      id: productKey(product),
      name: text(product && product.name, "ARMOR Product"),
      spec: text(product && (product.spec || product.note || product.leaf), ""),
      category: text(category && category.label, ""),
      leaf: text((product && product.leaf) || (category && category.leaf), ""),
      image,
      url: productUrl(product)
    };
  }

  function frontCatalogItems() {
    return categories.flatMap((category) => productsForCategory(category).map((product) => frontProductItem(product, category)));
  }

  const utilityLabels = {
    search: "商品搜尋",
    wishlist: "心願清單",
    account: "前台會員",
    cart: "購物車"
  };

  function FrontUtilityPanel({ type, items = [], onClear, onClose }) {
    const [query, setQuery] = React.useState("");
    const catalog = React.useMemo(() => frontCatalogItems(), []);
    const listItems = Array.isArray(items) ? items : [];
    const q = text(query).toLowerCase();
    const results = type === "search"
      ? catalog.filter((item) => !q || [item.name, item.spec, item.category, item.leaf].some((value) => text(value).toLowerCase().includes(q))).slice(0, 10)
      : listItems;
    const title = utilityLabels[type] || "前台工具";
    const canClear = (type === "wishlist" || type === "cart") && listItems.length > 0;

    return (
      <div className="front-panel-backdrop" role="presentation" onClick={onClose}>
        <aside className="front-panel" role="dialog" aria-modal="true" aria-label={title} onClick={(event) => event.stopPropagation()}>
          <div className="front-panel-head">
            <strong>{title}</strong>
            <button className="front-panel-close" type="button" aria-label="關閉" onClick={onClose}>{icon("close")}</button>
          </div>
          {type === "account" ? (
            <div className="front-panel-empty account">
              <strong>前台會員中心</strong>
              <span>前台使用者入口已與後台管理權限分開。</span>
            </div>
          ) : (
            <React.Fragment>
              {type === "search" && (
                <input
                  className="front-search-input"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="搜尋商品名稱、分類或規格"
                  autoFocus
                />
              )}
              {results.length ? (
                <div className="front-panel-list">
                  {results.map((item, index) => (
                    <a className="front-panel-item" href={item.url || "#"} onClick={onClose} key={`${item.id || item.name}-${index}`}>
                      {item.image ? <img src={item.image} alt={item.name} /> : <span className="front-panel-thumb"></span>}
                      <span>
                        <strong>{item.name}</strong>
                        <small>{[item.category, item.leaf, item.spec].filter(Boolean).join(" / ")}</small>
                      </span>
                    </a>
                  ))}
                </div>
              ) : (
                <div className="front-panel-empty">
                  <strong>{type === "search" ? "沒有符合的商品" : "目前沒有項目"}</strong>
                  <span>{type === "search" ? "請調整關鍵字後再搜尋。" : "商品加入後會顯示在這裡。"}</span>
                </div>
              )}
              {canClear && (
                <div className="front-panel-actions">
                  <button type="button" onClick={onClear}>全部清除</button>
                </div>
              )}
            </React.Fragment>
          )}
        </aside>
      </div>
    );
  }
  function Header({ selectedCategory, onSelectCategory, onSelectMegaGroup, onSelectMegaLink, frontLists = emptyFrontLists(), onClearFrontList = () => {} }) {
    const [openId, setOpenId] = React.useState(null);
    const [menuOpen, setMenuOpen] = React.useState(false);
    const [isScrolled, setIsScrolled] = React.useState(false);
    const [utilityPanel, setUtilityPanel] = React.useState(null);

    React.useEffect(() => {
      const updateScrolled = () => setIsScrolled(window.scrollY > 8);
      updateScrolled();
      window.addEventListener("scroll", updateScrolled, { passive: true });
      return () => window.removeEventListener("scroll", updateScrolled);
    }, []);
    const wishlistCount = frontListItems(frontLists, FRONT_WISHLIST_KEY).length;
    const cartCount = frontListItems(frontLists, FRONT_CART_KEY).length;
    const openUtility = (panel) => {
      setOpenId(null);
      setMenuOpen(false);
      setUtilityPanel((current) => current === panel ? null : panel);
    };
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
      <header className={`header ${menuOpen ? "menu-open" : ""} ${isScrolled ? "is-scrolled" : ""}`} onMouseLeave={() => setOpenId(null)}>
        <div className="header-inner">
          <a className="brand" href="#top" aria-label="ARMOR BIKE home">
            <img
              className="brand-logo-mark"
              src="https://res.cloudinary.com/dvzdptb3i/image/upload/v1782983166/t3sdrech4xlejtnlauog.png"
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
            <button className={`icon-button menu-toggle ${menuOpen ? "active" : ""}`} type="button" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-controls="mobile-menu" aria-expanded={menuOpen} onClick={() => { setOpenId(null); setUtilityPanel(null); setMenuOpen((value) => !value); }}>{icon(menuOpen ? "close" : "menu")}</button>
            <button className="icon-button utility-search" type="button" aria-label="搜尋商品" aria-expanded={utilityPanel === "search"} onClick={() => openUtility("search")}>{icon("search")}</button>
            <button className="icon-button utility-wishlist" type="button" aria-label="心願清單" aria-expanded={utilityPanel === "wishlist"} onClick={() => openUtility("wishlist")}>{icon("heart")}{wishlistCount > 0 && <span className="cart-badge">{wishlistCount}</span>}</button>
            <button className="icon-button utility-account" type="button" aria-label="前台會員" aria-expanded={utilityPanel === "account"} onClick={() => openUtility("account")}>{icon("user")}</button>
            <button className="icon-button utility-cart" type="button" aria-label="購物車" aria-expanded={utilityPanel === "cart"} onClick={() => openUtility("cart")}>{icon("cart")}{cartCount > 0 && <span className="cart-badge">{cartCount}</span>}</button>
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
        <MobileMenu
            navItems={navItems}
            selectedId={selectedId}
            onSelectCategory={selectCategory}
            onSelectMegaGroup={selectMegaGroup}
            onSelectMegaLink={selectMegaLink}
          isOpen={menuOpen}
        />
        {utilityPanel && (
          <FrontUtilityPanel
            type={utilityPanel}
            items={utilityPanel === "wishlist" ? frontListItems(frontLists, FRONT_WISHLIST_KEY) : utilityPanel === "cart" ? frontListItems(frontLists, FRONT_CART_KEY) : []}
            onClear={() => onClearFrontList(utilityPanel)}
            onClose={() => setUtilityPanel(null)}
          />
        )}      </header>
    );
  }

  function MobileMenu({ navItems, selectedId, onSelectCategory, isOpen }) {
    return (
      <div className={`mobile-menu ${isOpen ? "is-open" : ""}`} id="mobile-menu" aria-hidden={!isOpen}>
        <div className="mobile-menu-inner">
          <div className="mobile-menu-tabs" aria-label="Mobile categories">
            {navItems.map((item) => (
              <button
                className={`mobile-menu-tab ${selectedId === item.id ? "active" : ""}`}
                type="button"
                onClick={() => onSelectCategory(item)}
                key={item.id}
              >
                {item.label}
              </button>
            ))}
          </div>
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
    colorFilter,
    onSelectLeaf,
    onSelectColor,
    onClearFilters,
    isOpen,
    onClose
  }) {
    const leafProducts = exactLeafFilter ? filterByLeaf(products, exactLeafFilter, category.leaf || category.label) : products;
    const leaves = makeCounts(products, "leaf", category.leaf || category.label || "Products");
    const colorOptions = Array.from(new Set(leafProducts.flatMap((product) => productColors(product)))).slice(0, 8);
    const colors = colorOptions.length ? colorOptions : filterColors;
    return (
      <aside className={`filter-panel ${isOpen ? "is-open" : ""}`} id="product-filter-panel" aria-label="Product filters">
        <div className="filter-head">
          <strong>FILTER</strong>
          <div className="filter-head-actions">
            <button type="button" onClick={onClearFilters}>Clear All</button>
            <button className="filter-close" type="button" aria-label="Close filters" onClick={onClose}>{icon("close")}</button>
          </div>
        </div>
        <div className="filter-group">
          <div className="filter-title"><span>Category</span><span>+</span></div>
          <div className="filter-options">
            {leaves.length ? leaves.map((item) => (
              <FilterRow
                item={item}
                active={sameLabel(exactLeafFilter, item.label)}
                key={item.label}
                onClick={() => onSelectLeaf(item.label)}
              />
            )) : <div className="filter-empty">No category items</div>}
          </div>
        </div>
        <div className="filter-group">
          <div className="filter-title"><span>Color</span><span>+</span></div>
          <div className="color-grid">
            {colors.map((color) => (
              <button
                className={`color-filter ${sameLabel(colorFilter, color) ? "active" : ""}`}
                type="button"
                aria-label={`Filter color ${colorLabel(color)}`}
                aria-pressed={sameLabel(colorFilter, color)}
                style={{ background: colorBackground(color) }}
                key={color}
                onClick={() => onSelectColor(color)}
              ></button>
            ))}
          </div>
        </div>
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
    colorFilter,
    onSelectLeaf,
    onSelectColor,
    onClearFilters,
    onAddFrontItem
  }) {
    const [filterOpen, setFilterOpen] = React.useState(false);
    const closeFilter = React.useCallback(() => setFilterOpen(false), []);
    const selectLeafFromFilter = React.useCallback((leaf) => {
      onSelectLeaf(leaf);
      setFilterOpen(false);
    }, [onSelectLeaf]);
    const selectColorFromFilter = React.useCallback((color) => {
      onSelectColor(color);
      setFilterOpen(false);
    }, [onSelectColor]);
    const clearFromFilter = React.useCallback(() => {
      onClearFilters();
      setFilterOpen(false);
    }, [onClearFilters]);

    return (
      <section className="catalog" id="products">
        <div className="catalog-top">
          <div>
            <div className="crumbs"><span>Home</span><span>/</span><span>{category.label}</span><span>/</span><span>{currentLeaf || "Featured"}</span></div>
            <h2>{category.label} <span>({visibleProducts.length} products)</span></h2>
          </div>
          <div className="catalog-actions">
            <button className="filter-toggle" type="button" aria-controls="product-filter-panel" aria-expanded={filterOpen} onClick={() => setFilterOpen(true)}>FILTER</button>
            <button className="sort" type="button">Sort by: Featured</button>
          </div>
        </div>
        {filterOpen && <button className="filter-drawer-backdrop" type="button" aria-label="Close filters" onClick={closeFilter}></button>}
        <div className="catalog-layout">
          <FilterPanel
            category={category}
            products={baseProducts}
            exactLeafFilter={exactLeafFilter}
            colorFilter={colorFilter}
            onSelectLeaf={selectLeafFromFilter}
            onSelectColor={selectColorFromFilter}
            onClearFilters={clearFromFilter}
            isOpen={filterOpen}
            onClose={closeFilter}
          />
          <div className="product-grid">
            {visibleProducts.length ? visibleProducts.map((product, index) => (
              <ProductCard product={product} category={category} index={index} onAddFrontItem={onAddFrontItem} key={`${text(product.productId || product.sourceKey || product.name, "product")}-${index}`} />
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

  function ProductCard({ product, category, index, onAddFrontItem }) {
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
          <button className="heart-button" type="button" aria-label="加入心願清單" onClick={(event) => { event.stopPropagation(); onAddFrontItem(FRONT_WISHLIST_KEY, product, category); }}>{icon("heart")}</button>
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
          <div className="product-spec">{lineBreaks(product.spec || product.note || product.leaf, "Performance cycling equipment")}</div>
          <div className="card-actions">
            <div className="product-swatches">
              {productColors(product).slice(0, 4).map((color) => <span className="product-dot" style={{ background: colorBackground(color) }} title={colorLabel(color)} key={`${product.name}-${color}`}></span>)}
            </div>
            <button className="cart-button" type="button" aria-label="加入購物車" onClick={(event) => { event.stopPropagation(); onAddFrontItem(FRONT_CART_KEY, product, category); }}>{icon("cart")}</button>
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
    const [colorFilter, setColorFilter] = React.useState("");
    const [frontLists, setFrontLists] = React.useState(() => emptyFrontLists());
    const selectedCategory = React.useMemo(() => {
      return categories.find((category) => category.id === selectedCategoryId) || defaultCategory || fallbackCategory;
    }, [defaultCategory, selectedCategoryId]);

    const baseProducts = React.useMemo(() => productsForCategory(selectedCategory), [selectedCategory]);

    const visibleProducts = React.useMemo(() => {
      let items = exactLeafFilter ? filterByLeaf(baseProducts, exactLeafFilter, selectedCategory.leaf || selectedCategory.label) : baseProducts;
      if (colorFilter) items = items.filter((product) => productColors(product).some((color) => sameLabel(color, colorFilter)));
      return items;
    }, [baseProducts, exactLeafFilter, colorFilter]);

    const currentLeaf = displayLeaf || selectedCategory.leaf || "Featured";

    React.useEffect(() => {
      if (window.location.hash === "#products" || initialLeaf) scrollToProducts();
    }, []);

    const addFrontItem = React.useCallback((key, product, category) => {
      const item = frontProductItem(product, category);
      setFrontLists((current) => nextFrontLists(current, key, item));
    }, []);

    const clearFrontList = React.useCallback((key) => {
      if (key !== FRONT_WISHLIST_KEY && key !== FRONT_CART_KEY) return;
      setFrontLists((current) => ({ ...emptyFrontLists(), ...current, [key]: [] }));
    }, []);

    function selectCategory(category, options = {}) {
      const target = category && category.id ? category : findCategory(category) || fallbackCategory;
      setSelectedCategoryId(target.id || target.label);
      setDisplayLeaf(options.leaf || "");
      setExactLeafFilter(options.exactLeaf || "");
      setColorFilter("");
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
      setColorFilter("");
      scrollToProducts();
    }

    function selectColor(color) {
      setColorFilter((current) => sameLabel(current, color) ? "" : color);
      scrollToProducts();
    }

    function clearFilters() {
      setDisplayLeaf("");
      setExactLeafFilter("");
      setColorFilter("");
      scrollToProducts();
    }

    return (
      <main className="page">
        <Header
          selectedCategory={selectedCategory}
          onSelectCategory={selectCategory}
          onSelectMegaGroup={selectMegaGroup}
          onSelectMegaLink={selectMegaLink}
          frontLists={frontLists}
          onClearFrontList={clearFrontList}
        />
        <Hero onExplore={scrollToProducts} />
        <CategoryStrip onSelectCategory={selectCategory} />
        <Catalog
          category={selectedCategory}
          currentLeaf={currentLeaf}
          baseProducts={baseProducts}
          visibleProducts={visibleProducts}
          exactLeafFilter={exactLeafFilter}
          colorFilter={colorFilter}
          onSelectLeaf={selectFilterLeaf}
          onSelectColor={selectColor}
          onClearFilters={clearFilters}
          onAddFrontItem={addFrontItem}
        />
      </main>
    );
  }

  ReactDOM.createRoot(document.getElementById("root")).render(<App />);
})();
