/* ARMOR BIKE product detail page */
(function () {
  const STORE = window.STORE || { categories: [] };
  const categories = Array.isArray(STORE.categories) ? STORE.categories : [];
  const fallbackImage = "/uploads/reference-promo-ebikes.png";
  const fallbackColors = ["#111827", "#009ce0", "#c8d2df"];

  function text(value, fallback = "") {
    return String(value || fallback).trim();
  }

  function normalize(value) {
    return text(value).toLowerCase();
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
    return "/Product/?id=" + encodeURIComponent(productKey(product));
  }

  function priceFor(product) {
    return text(product && product.price, "Contact for price");
  }

  function productImages(product) {
    const records = [];
    const seen = new Set();
    const append = (entry) => {
      const url = text(entry && entry.url ? entry.url : entry);
      if (!url || seen.has(url)) return;
      seen.add(url);
      records.push({ url, alt: text(entry && entry.alt, text(product && product.name, "Product image")) });
    };
    if (Array.isArray(product && product.images)) product.images.forEach(append);
    append(product && product.image);
    if (!records.length) append(fallbackImage);
    return records;
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
    return out.length ? out : fallbackColors;
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
    const icons = {
      left: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round"></path></svg>,
      right: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"></path></svg>,
      back: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round"></path><path d="M20 12H9" strokeLinecap="round"></path></svg>
    };
    return icons[name] || null;
  }

  function Header() {
    return (
      <header className="site-header">
        <div className="header-inner">
          <a className="brand" href="/" aria-label="ARMOR BIKE home">
            <img className="brand-mark" src="https://res.cloudinary.com/dvzdptb3i/image/upload/v1782187548/tlocousnxawpnq8qjkvo.png" alt="ARMOR BIKE logo mark" />
            <img className="brand-type" src="https://res.cloudinary.com/dvzdptb3i/image/upload/v1782187520/jwnvywanec2ytbbfrqw0.png" alt="ARMOR BIKE" />
          </a>
          <nav className="header-nav" aria-label="商品頁導覽">
            <a href="/#products">Products</a>
            <a href="/admin.html">Admin</a>
          </nav>
          <a className="back-pill" href="/#products">{icon("back")}<span>Back to Catalog</span></a>
        </div>
      </header>
    );
  }

  function ProductPage() {
    const [record, setRecord] = React.useState(findRecordFromUrl);
    const [imageIndex, setImageIndex] = React.useState(0);

    React.useEffect(() => {
      const onPopState = () => { setRecord(findRecordFromUrl()); setImageIndex(0); };
      window.addEventListener("popstate", onPopState);
      return () => window.removeEventListener("popstate", onPopState);
    }, []);

    React.useEffect(() => { setImageIndex(0); }, [record && productKey(record.product)]);

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
      swatches.length ? ["Colors", swatches.map((hex) => hex.toUpperCase()).join(" / ")] : null,
      ["Spec / Description", specText],
      ["Availability", available ? "In stock" : "Contact for availability"],
      ["Product ID", productKey(product)]
    ].filter(Boolean);

    return (
      <main className="page">
        <Header />
        <div className="shell">
          <div className="breadcrumb" aria-label="Breadcrumb"><a href="/">Home</a><span>/</span><a href="/#products">{categoryLabel}</a><span>/</span><span>{leaf}</span></div>
          <section className="hero">
            <div className="gallery">
              <div className="main-image">
                <span className="image-count">{imageIndex + 1} / {images.length}</span>
                <img src={activeImage.url} alt={text(activeImage.alt, product.name)} />
                {images.length > 1 && <React.Fragment><button className="gallery-arrow prev" type="button" aria-label="Previous product image" onClick={() => showImage(imageIndex - 1)}>{icon("left")}</button><button className="gallery-arrow next" type="button" aria-label="Next product image" onClick={() => showImage(imageIndex + 1)}>{icon("right")}</button></React.Fragment>}
              </div>
              {images.length > 1 && <div className="thumbs" aria-label="Product thumbnails">{images.map((image, index) => <button className={"thumb " + (index === imageIndex ? "active" : "")} type="button" aria-label={"Show image " + (index + 1)} aria-pressed={index === imageIndex} key={image.url + index} onClick={() => showImage(index)}><img src={image.url} alt="" /></button>)}</div>}
            </div>
            <aside className="details">
              <div><div className="eyebrow">{categoryLabel}</div><h1>{text(product.name, "ARMOR Product")}</h1><p className="lead">{specText}</p><div className="meta-row"><span className="meta-chip">{leaf}</span><span className="meta-chip">{text(product.manufacturer, "ARMOR")}</span><span className="meta-chip">{available ? "Published / Available" : "Published"}</span>{badge && <span className="tag-pill">{badge}</span>}</div>{swatches.length > 0 && <div className="color-row" aria-label="Product colors">{swatches.map((hex) => <span className="detail-color" style={{ background: hex }} title={hex.toUpperCase()} key={hex}></span>)}</div>}</div>
              <div><span className="price-label">Product Price</span><strong className="price-value">{priceFor(product)}</strong><div className="action-row"><a className="primary-action" href="/#products">Back to Collection {icon("right")}</a><a className="secondary-action" href="/admin.html">Open Admin</a></div></div>
            </aside>
          </section>
          <section className="lower-grid">
            <div className="spec-panel"><h2 className="section-title">Product Details</h2><div className="spec-list">{specs.map(([label, value]) => <div className="spec-row" key={label}><span>{label}</span><strong>{value}</strong></div>)}</div></div>
            <div className="related"><div className="related-head"><h2 className="section-title">Related Products</h2><p>{categoryLabel} / {leaf}</p></div><div className="related-grid">{related.map((item) => { const image = productImages(item.product)[0]; return <a className="related-card" href={productUrl(item.product)} key={productKey(item.product)} onClick={(event) => openProduct(item, event)}><span className="related-image"><img src={image.url} alt={image.alt} /></span><span className="related-info"><strong>{text(item.product.name, "ARMOR Product")}</strong><span>{priceFor(item.product)}</span></span></a>; })}</div></div>
          </section>
        </div>
      </main>
    );
  }

  ReactDOM.createRoot(document.getElementById("root")).render(<ProductPage />);
})();