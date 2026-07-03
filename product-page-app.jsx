/* ARMOR BIKE product detail page */
(function () {
  const STORE = window.STORE || { categories: [] };
  const categories = Array.isArray(STORE.categories) ? STORE.categories : [];
  const fallbackImage = "/uploads/reference-promo-ebikes.png";
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
    return String(value || fallback).trim();
  }

  function normalize(value) {
    return text(value).toLowerCase();
  }

  function normalizeLabel(value) {
    return text(value)
      .toLowerCase()
      .replace(/&/g, "and")
      .replace(/[^a-z0-9]+/g, "");
  }

  function findCategory(value) {
    const key = normalizeLabel(value);
    return categories.find((category) => normalizeLabel(category.id) === key || normalizeLabel(category.label) === key);
  }

  function isPublishedProduct(product) {
    if (!product) return false;
    if (product.published === false || product.isPublished === false || product.visible === false) return false;
    if (product.hidden === true || product.draft === true || product.deleted === true) return false;
    const status = normalize(product.status || product.state || product.visibility || product.publishStatus);
    return !["draft", "hidden", "inactive", "archived", "unpublished", "disabled", "deleted", "private"].includes(status);
  }

  function isAvailableProduct(product) {
    if (!product) return false;
    if (product.inStock === false || product.available === false) return false;
    const stock = Number(product.stock);
    if (Number.isFinite(stock) && stock <= 0) return false;
    const status = normalize(product.availability || product.stockStatus);
    return !["out of stock", "sold out", "unavailable", "preorder only"].includes(status);
  }

  function productKey(product) {
    return text(product && (product.productId || product.sourceKey || product.name), "product");
  }

  function productUrl(product) {
    const deploy = new URLSearchParams(window.location.search).get("deploy");
    const suffix = deploy ? "&deploy=" + encodeURIComponent(deploy) : "";
    return "/Product/?id=" + encodeURIComponent(productKey(product)) + suffix;
  }

  function homeCatalogUrl(category, leaf = "") {
    const params = new URLSearchParams();
    const target = category && category.id ? category : findCategory(category) || {};
    if (target.id || target.label) params.set("category", target.id || target.label);
    if (leaf) params.set("leaf", leaf);
    const deploy = new URLSearchParams(window.location.search).get("deploy");
    if (deploy) params.set("deploy", deploy);
    const query = params.toString();
    return "/" + (query ? "?" + query : "") + "#products";
  }

  function priceFor(product) {
    return text(product && product.price, "Contact for price");
  }

  function imageUrlFrom(entry) {
    if (!entry) return "";
    if (typeof entry === "string") return text(entry);
    const fields = ["url", "secure_url", "src", "href", "image", "imageUrl", "imageURL", "mainImage", "mainImageUrl", "featuredImage", "featuredImageUrl", "thumbnail", "thumbnailUrl", "cdnUrl", "cloudinaryUrl", "preview"];
    for (const field of fields) {
      const value = entry[field];
      if (value) return typeof value === "string" ? text(value) : imageUrlFrom(value);
    }
    return "";
  }

  function imageAltFrom(entry, product) {
    if (entry && typeof entry === "object") {
      return text(entry.alt || entry.altText || entry.title || entry.caption, text(product && product.name, "Product image"));
    }
    return text(product && product.name, "Product image");
  }

  function productImages(product) {
    const records = [];
    const seen = new Set();
    const append = (entry) => {
      const url = imageUrlFrom(entry);
      if (!url || seen.has(url)) return;
      seen.add(url);
      records.push({ url, alt: imageAltFrom(entry, product) });
    };
    if (Array.isArray(product && product.images)) product.images.forEach(append);
    ["image", "imageUrl", "imageURL", "mainImage", "mainImageUrl", "featuredImage", "featuredImageUrl", "thumbnail", "thumbnailUrl", "cdnUrl", "cloudinaryUrl", "preview"].forEach((field) => append(product && product[field]));
    if (!records.length) append(fallbackImage);
    return records;
  }

  function handleImageError(event) {
    const img = event.currentTarget;
    if (!img || img.dataset.fallbackApplied === "true") return;
    img.dataset.fallbackApplied = "true";
    img.src = fallbackImage;
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
  const records = categories.flatMap((category) => {
    const products = Array.isArray(category.products) ? category.products : [];
    return products.filter(isPublishedProduct).map((product) => ({ category, product }));
  });

  function findRecordFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const id = normalize(params.get("id") || params.get("product") || params.get("sku"));
    if (!id) return records[0] || null;
    return records.find(({ product }) => [product.productId, product.sourceKey, product.name].map(normalize).some((value) => value && value === id)) || records[0] || null;
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
    if (name === "left") {
      return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" {...common}></path></svg>;
    }
    if (name === "right") {
      return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" {...common}></path></svg>;
    }
    if (name === "back") {
      return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 18l-6-6 6-6" {...common}></path><path d="M20 12H9" {...common}></path></svg>;
    }
    return null;
  }

  function Header({ selectedCategory }) {
    const [openId, setOpenId] = React.useState(null);
    const [menuOpen, setMenuOpen] = React.useState(false);
    const [isScrolled, setIsScrolled] = React.useState(false);

    React.useEffect(() => {
      const updateScrolled = () => setIsScrolled(window.scrollY > 8);
      updateScrolled();
      window.addEventListener("scroll", updateScrolled, { passive: true });
      return () => window.removeEventListener("scroll", updateScrolled);
    }, []);
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
    const openCatalog = (category, leaf = "") => {
      setOpenId(null);
      setMenuOpen(false);
      window.location.assign(homeCatalogUrl(category, leaf));
    };

    return (
      <header className={`header ${menuOpen ? "menu-open" : ""} ${isScrolled ? "is-scrolled" : ""}`} onMouseLeave={() => setOpenId(null)}>
        <div className="header-inner">
          <a className="brand" href="/" aria-label="ARMOR BIKE home">
            <img className="brand-logo-mark" src="https://res.cloudinary.com/dvzdptb3i/image/upload/v1782983166/t3sdrech4xlejtnlauog.png" alt="ARMOR BIKE logo mark" />
            <img className="brand-logo-type" src="https://res.cloudinary.com/dvzdptb3i/image/upload/v1782187520/jwnvywanec2ytbbfrqw0.png" alt="ARMOR BIKE" />
          </a>
          <nav className="main-nav" aria-label="Main navigation">
            {navItems.map((item) => (
              <button
                className={`nav-button ${item.id === "sale" ? "sale" : ""} ${openId === item.id || selectedId === item.id ? "active" : ""}`}
                key={item.id}
                onMouseEnter={() => setOpenId(item.id)}
                onFocus={() => setOpenId(item.id)}
                onClick={() => openCatalog(item)}
                type="button"
              >
                {item.label}
              </button>
            ))}
          </nav>
          <div className="header-tools">
            <button className={`icon-button menu-toggle ${menuOpen ? "active" : ""}`} type="button" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-controls="mobile-menu" aria-expanded={menuOpen} onClick={() => { setOpenId(null); setMenuOpen((value) => !value); }}>{icon(menuOpen ? "close" : "menu")}</button>
            <button className="icon-button utility-search" type="button" aria-label="Search">{icon("search")}</button>
            <a className="icon-button utility-account" href="/admin.html" aria-label="Account">{icon("user")}</a>
            <a className="icon-button utility-cart" href="/#products" aria-label="Cart">{icon("cart")}<span className="cart-badge">2</span></a>
          </div>
        </div>
        {!menuOpen && openCategory && (
          <MegaMenu
            category={openCategory}
            onSelectCategory={(category) => openCatalog(category)}
            onSelectMegaGroup={(category, groupTitle) => openCatalog(category, groupTitle)}
            onSelectMegaLink={(category, link) => openCatalog(category, link)}
          />
        )}
        {menuOpen && (
          <MobileMenu
            navItems={navItems}
            selectedId={selectedId}
            onSelectCategory={(category) => openCatalog(category)}
            onSelectMegaGroup={(category, groupTitle) => openCatalog(category, groupTitle)}
            onSelectMegaLink={(category, link) => openCatalog(category, link)}
          />
        )}
      </header>
    );
  }

  function MobileMenu({ navItems, selectedId, onSelectCategory }) {
    return (
      <div className="mobile-menu" id="mobile-menu">
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

  function ProductPage() {
    const [record, setRecord] = React.useState(findRecordFromUrl);
    const [imageIndex, setImageIndex] = React.useState(0);
    const [imageFit, setImageFit] = React.useState("");

    React.useEffect(() => {
      const onPopState = () => { setRecord(findRecordFromUrl()); setImageIndex(0); setImageFit(""); };
      window.addEventListener("popstate", onPopState);
      return () => window.removeEventListener("popstate", onPopState);
    }, []);

    React.useEffect(() => { setImageIndex(0); setImageFit(""); }, [record && productKey(record.product)]);
    React.useEffect(() => { setImageFit(""); }, [imageIndex]);

    if (!record) {
      return <main className="page"><Header /><section className="empty"><div><h1>No Product</h1><p className="lead">目前沒有已上架商品。</p><div className="action-row"><a className="primary-action" href="/">返回首頁</a></div></div></section></main>;
    }

    const { category, product } = record;
    const images = productImages(product);
    const activeImage = images[imageIndex] || images[0];
    const categoryLabel = text(category.label, "Products");
    const leaf = text(product.leaf, text(category.leaf, categoryLabel));
    const specText = text(product.spec || product.note, leaf + " product from the ARMOR BIKE catalog.");
    const available = isAvailableProduct(product);
    const swatches = productColors(product);
    const badge = text(product.badge);
    const related = records.filter((item) => productKey(item.product) !== productKey(product)).filter((item) => item.category.id === category.id || text(item.product.leaf) === text(product.leaf)).slice(0, 4);

    function showImage(nextIndex) {
      setImageIndex((current) => (nextIndex + images.length) % images.length);
    }

    function handleMainImageLoad(event) {
      const img = event.currentTarget;
      const ratio = img && img.naturalHeight ? img.naturalWidth / img.naturalHeight : 1;
      const nextFit = ratio < 0.48 ? "is-portrait" : ratio > 2.15 ? "is-wide" : "";
      setImageFit((current) => current === nextFit ? current : nextFit);
    }

    function handleMainImageError(event) {
      handleImageError(event);
      setImageFit("");
    }
    function openProduct(nextRecord, event) {
      event.preventDefault();
      window.history.pushState(null, "", productUrl(nextRecord.product));
      setRecord(nextRecord);
      setImageIndex(0);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    const specs = [
      ["Category", categoryLabel],
      ["Collection", leaf],
      ["Manufacturer", text(product.manufacturer, "ARMOR")],
      badge ? ["Product Tag", badge] : null,
      swatches.length ? ["Colors", swatches.map(colorLabel).join(" / ")] : null,
      ["Spec / Description", specText],
      ["Availability", available ? "In stock" : "Contact for availability"],
      ["Product ID", productKey(product)]
    ].filter(Boolean);

    return (
      <main className="page">
        <Header selectedCategory={category} />
        <div className="shell">
          <div className="breadcrumb" aria-label="Breadcrumb"><a href="/">Home</a><span>/</span><a href="/#products">{categoryLabel}</a><span>/</span><span>{leaf}</span></div>
          <section className="hero">
            <div className="gallery">
              <div className="main-image">
                <span className="image-count">{imageIndex + 1} / {images.length}</span>
                <img className={imageFit} src={activeImage.url} alt={text(activeImage.alt, product.name)} onLoad={handleMainImageLoad} onError={handleMainImageError} />
                {images.length > 1 && <React.Fragment><button className="gallery-arrow prev" type="button" aria-label="Previous product image" onClick={() => showImage(imageIndex - 1)}>{icon("left")}</button><button className="gallery-arrow next" type="button" aria-label="Next product image" onClick={() => showImage(imageIndex + 1)}>{icon("right")}</button></React.Fragment>}
              </div>
              {images.length > 1 && <div className="thumbs" aria-label="Product thumbnails">{images.map((image, index) => <button className={"thumb " + (index === imageIndex ? "active" : "")} type="button" aria-label={"Show image " + (index + 1)} aria-pressed={index === imageIndex} key={image.url + index} onClick={() => showImage(index)}><img src={image.url} alt="" onError={handleImageError} /></button>)}</div>}
            </div>
            <aside className="details">
              <div><div className="eyebrow">{categoryLabel}</div><h1>{text(product.name, "ARMOR Product")}</h1><p className="lead">{specText}</p><div className="meta-row"><span className="meta-chip">{leaf}</span><span className="meta-chip">{text(product.manufacturer, "ARMOR")}</span><span className="meta-chip">{available ? "Published / Available" : "Published"}</span>{badge && <span className={"tag-pill " + (badge.toLowerCase().includes("hot") ? "hot" : "")}>{badge}</span>}</div>{swatches.length > 0 && <div className="color-row" aria-label="Product colors">{swatches.map((color) => <span className="detail-color" style={{ background: colorBackground(color) }} title={colorLabel(color)} key={color}></span>)}</div>}</div>
              <div><span className="price-label">Product Price</span><strong className="price-value">{priceFor(product)}</strong><div className="action-row"><a className="primary-action" href="/#products">Back to Collection {icon("right")}</a></div></div>
            </aside>
          </section>
          <section className="lower-grid">
            <div className="spec-panel"><h2 className="section-title">Product Details</h2><div className="spec-list">{specs.map(([label, value]) => <div className="spec-row" key={label}><span>{label}</span><strong>{value}</strong></div>)}</div></div>
            <div className="related"><div className="related-head"><h2 className="section-title">Related Products</h2><p>{categoryLabel} / {leaf}</p></div><div className="related-grid">{related.map((item) => { const image = productImages(item.product)[0]; return <a className="related-card" href={productUrl(item.product)} key={productKey(item.product)} onClick={(event) => openProduct(item, event)}><span className="related-image"><img src={image.url} alt={image.alt} onError={handleImageError} /></span><span className="related-info"><strong>{text(item.product.name, "ARMOR Product")}</strong><span>{text(item.product.spec || item.product.note || item.product.leaf, "Performance cycling equipment")}</span></span></a>; })}</div></div>
          </section>
        </div>
      </main>
    );
  }

  ReactDOM.createRoot(document.getElementById("root")).render(<ProductPage />);
})();
