/* @ds-bundle: {"format":3,"namespace":"BIKE24DesignSystem_2233bc","components":[{"name":"Badge","sourcePath":"components/catalog/Badge.jsx"},{"name":"ColorSwatch","sourcePath":"components/catalog/ColorSwatch.jsx"},{"name":"FilterGroup","sourcePath":"components/catalog/FilterGroup.jsx"},{"name":"ProductCard","sourcePath":"components/catalog/ProductCard.jsx"},{"name":"Button","sourcePath":"components/forms/Button.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"SearchInput","sourcePath":"components/forms/SearchInput.jsx"}],"sourceHashes":{"components/catalog/Badge.jsx":"cca8ab99a076","components/catalog/ColorSwatch.jsx":"b0bfb92838e1","components/catalog/FilterGroup.jsx":"22679de1ddb1","components/catalog/ProductCard.jsx":"eee1634ecb33","components/forms/Button.jsx":"d1c79a90c631","components/forms/Checkbox.jsx":"bf5d1fc77b3c","components/forms/SearchInput.jsx":"284f23d75845","store-app.jsx":"2184ca8d4bf8","store-data.js":"f13daf3b556a"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.BIKE24DesignSystem_2233bc = window.BIKE24DesignSystem_2233bc || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/catalog/Badge.jsx
try { (() => {
/**
 * ARMOR BIKE Badge — small square label. Used for sale flags, "New", stock states.
 */
function Badge({
  children,
  variant = 'sale',
  style = {}
}) {
  const variants = {
    sale: {
      bg: 'var(--brand-sale)',
      color: '#fff'
    },
    accent: {
      bg: 'var(--brand-accent)',
      color: 'var(--gray-900)'
    },
    info: {
      bg: 'var(--brand-primary)',
      color: '#fff'
    },
    success: {
      bg: 'var(--status-success-surface)',
      color: 'var(--green-600)'
    },
    neutral: {
      bg: 'var(--gray-100)',
      color: 'var(--text-body)'
    }
  };
  const v = variants[variant] || variants.sale;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      height: 22,
      padding: '0 8px',
      fontFamily: 'var(--font-sans)',
      fontWeight: 'var(--fw-bold)',
      fontSize: 'var(--text-2xs)',
      letterSpacing: 'var(--tracking-wide)',
      textTransform: 'uppercase',
      borderRadius: 'var(--radius-sm)',
      background: v.bg,
      color: v.color,
      ...style
    }
  }, children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/catalog/Badge.jsx", error: String((e && e.message) || e) }); }

// components/catalog/ColorSwatch.jsx
try { (() => {
/**
 * ARMOR BIKE ColorSwatch — round color chip with a count badge, as used in the
 * "Colors" facet. Multi-color values render as a conic gradient.
 */
function ColorSwatch({
  color = '#000',
  count = null,
  selected = false,
  onClick,
  title,
  style = {}
}) {
  const isMulti = Array.isArray(color);
  const bg = isMulti ? `conic-gradient(${color.map((c, i) => `${c} ${i * 100 / color.length}% ${(i + 1) * 100 / color.length}%`).join(', ')})` : color;
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onClick,
    title: title,
    style: {
      position: 'relative',
      width: 38,
      height: 38,
      borderRadius: 'var(--radius-circle)',
      background: bg,
      border: selected ? '2px solid var(--brand-primary)' : '1px solid var(--border-default)',
      boxShadow: selected ? '0 0 0 2px #fff inset' : 'none',
      cursor: 'pointer',
      padding: 0,
      ...style
    }
  }, count != null && /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      right: -4,
      bottom: -4,
      minWidth: 18,
      height: 18,
      padding: '0 4px',
      borderRadius: 'var(--radius-sm)',
      background: 'var(--gray-900)',
      color: '#fff',
      fontFamily: 'var(--font-sans)',
      fontWeight: 'var(--fw-bold)',
      fontSize: 10,
      lineHeight: '18px',
      textAlign: 'center'
    }
  }, count));
}
Object.assign(__ds_scope, { ColorSwatch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/catalog/ColorSwatch.jsx", error: String((e && e.message) || e) }); }

// components/catalog/FilterGroup.jsx
try { (() => {
/**
 * ARMOR BIKE FilterGroup — a collapsible facet section from the sidebar:
 * bold title, chevron toggle, and a body of options (checkboxes, swatches…).
 */
function FilterGroup({
  title,
  children,
  defaultOpen = true,
  style = {}
}) {
  const [open, setOpen] = React.useState(defaultOpen);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      borderBottom: '1px solid var(--border-subtle)',
      padding: 'var(--space-5) 0',
      ...style
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setOpen(o => !o),
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      background: 'none',
      border: 'none',
      padding: 0,
      cursor: 'pointer',
      fontFamily: 'var(--font-display)',
      fontWeight: 'var(--fw-bold)',
      fontSize: 'var(--text-lg)',
      color: 'var(--text-strong)'
    }
  }, title, /*#__PURE__*/React.createElement("svg", {
    width: "18",
    height: "18",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "var(--text-strong)",
    strokeWidth: "2.4",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: {
      transform: open ? 'rotate(180deg)' : 'none',
      transition: 'transform var(--dur-fast) var(--ease-standard)'
    }
  }, /*#__PURE__*/React.createElement("polyline", {
    points: "6 9 12 15 18 9"
  }))), open && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-3)',
      marginTop: 'var(--space-4)'
    }
  }, children));
}
Object.assign(__ds_scope, { FilterGroup });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/catalog/FilterGroup.jsx", error: String((e && e.message) || e) }); }

// components/catalog/ProductCard.jsx
try { (() => {
/**
 * ARMOR BIKE ProductCard — the catalog grid tile: light-gray media area on top,
 * uppercase manufacturer eyebrow, product name, spec line, and bold price.
 */
function ProductCard({
  manufacturer,
  name,
  spec,
  price,
  oldPrice = null,
  currency = '€',
  image = null,
  badge = null,
  note = null,
  onClick,
  style = {}
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--surface-card)',
      border: '1px solid transparent',
      borderRadius: 'var(--radius-sm)',
      cursor: 'pointer',
      transition: 'box-shadow var(--dur-normal) var(--ease-standard), border-color var(--dur-normal) var(--ease-standard)',
      boxShadow: hover ? 'var(--shadow-card-hover)' : 'none',
      borderColor: hover ? 'var(--border-subtle)' : 'transparent',
      overflow: 'hidden',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      aspectRatio: '1 / 1',
      background: 'var(--surface-media)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'var(--space-6)'
    }
  }, badge && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 'var(--space-3)',
      left: 'var(--space-3)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    variant: "sale"
  }, badge)), image ? /*#__PURE__*/React.createElement("img", {
    src: image,
    alt: name,
    style: {
      maxWidth: '100%',
      maxHeight: '100%',
      objectFit: 'contain',
      mixBlendMode: 'multiply'
    }
  }) : /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--gray-300)',
      fontSize: 'var(--text-sm)',
      fontFamily: 'var(--font-mono)'
    }
  }, "image")), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 'var(--space-4)',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-1)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontWeight: 'var(--fw-bold)',
      fontSize: 'var(--text-xs)',
      letterSpacing: 'var(--tracking-caps)',
      textTransform: 'uppercase',
      color: 'var(--text-strong)'
    }
  }, manufacturer), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontWeight: 'var(--fw-semibold)',
      fontSize: 'var(--text-md)',
      color: 'var(--text-strong)',
      lineHeight: 'var(--leading-snug)'
    }
  }, name), spec && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--text-sm)',
      color: 'var(--text-muted)',
      lineHeight: 'var(--leading-snug)'
    }
  }, spec), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 'var(--space-2)',
      marginTop: 'var(--space-3)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 'var(--fw-extra)',
      fontSize: 'var(--text-2xl)',
      color: oldPrice ? 'var(--text-sale)' : 'var(--text-strong)'
    }
  }, price, "\xA0", currency, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-md)'
    }
  }, "*")), oldPrice && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-sm)',
      color: 'var(--text-muted)',
      textDecoration: 'line-through'
    }
  }, oldPrice, "\xA0", currency)), note && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--text-xs)',
      color: 'var(--text-sale)',
      fontWeight: 'var(--fw-semibold)',
      marginTop: 'var(--space-1)'
    }
  }, note)));
}
Object.assign(__ds_scope, { ProductCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/catalog/ProductCard.jsx", error: String((e && e.message) || e) }); }

// components/forms/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * ARMOR BIKE Button — square-cornered, bold-label action button.
 * Variants: primary (blue), accent (yellow), sale (magenta), secondary (outline), ghost.
 */
function Button({
  children,
  variant = 'primary',
  size = 'md',
  block = false,
  disabled = false,
  type = 'button',
  iconLeft = null,
  iconRight = null,
  style = {},
  ...rest
}) {
  const sizes = {
    sm: {
      height: 34,
      padding: '0 14px',
      font: 'var(--text-sm)'
    },
    md: {
      height: 44,
      padding: '0 20px',
      font: 'var(--text-md)'
    },
    lg: {
      height: 52,
      padding: '0 28px',
      font: 'var(--text-lg)'
    }
  };
  const variants = {
    primary: {
      bg: 'var(--brand-primary)',
      color: '#fff',
      border: 'transparent',
      hover: 'var(--brand-primary-hover)'
    },
    accent: {
      bg: 'var(--brand-accent)',
      color: 'var(--gray-900)',
      border: 'transparent',
      hover: 'var(--yellow-600)'
    },
    sale: {
      bg: 'var(--brand-sale)',
      color: '#fff',
      border: 'transparent',
      hover: 'var(--sale-600)'
    },
    secondary: {
      bg: 'transparent',
      color: 'var(--brand-primary)',
      border: 'var(--brand-primary)',
      hover: 'var(--blue-50)'
    },
    ghost: {
      bg: 'transparent',
      color: 'var(--text-strong)',
      border: 'transparent',
      hover: 'var(--gray-100)'
    }
  };
  const s = sizes[size] || sizes.md;
  const v = variants[variant] || variants.primary;
  const [hover, setHover] = React.useState(false);
  const bg = hover && !disabled ? variant === 'secondary' || variant === 'ghost' ? v.hover : v.hover : v.bg;
  return /*#__PURE__*/React.createElement("button", _extends({
    type: type,
    disabled: disabled,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: block ? 'flex' : 'inline-flex',
      width: block ? '100%' : 'auto',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 'var(--space-2)',
      height: s.height,
      padding: s.padding,
      fontFamily: 'var(--font-sans)',
      fontWeight: 'var(--fw-bold)',
      fontSize: s.font,
      lineHeight: 1,
      color: v.color,
      background: bg,
      border: `2px solid ${v.border === 'transparent' ? bg : v.border}`,
      borderRadius: 'var(--radius-sm)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.45 : 1,
      transition: 'background var(--dur-fast) var(--ease-standard), border-color var(--dur-fast) var(--ease-standard)',
      whiteSpace: 'nowrap',
      ...style
    }
  }, rest), iconLeft, children, iconRight);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Button.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
/**
 * ARMOR BIKE Checkbox — the square filter checkbox used throughout the facet sidebar,
 * with an optional trailing count badge (e.g. "In stock  75").
 */
function Checkbox({
  checked = false,
  onChange,
  label,
  count = null,
  disabled = false,
  style = {}
}) {
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-3)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-md)',
      color: 'var(--text-body)',
      userSelect: 'none',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    onClick: () => !disabled && onChange && onChange(!checked),
    style: {
      width: 18,
      height: 18,
      flexShrink: 0,
      borderRadius: 'var(--radius-sm)',
      border: `2px solid ${checked ? 'var(--brand-primary)' : 'var(--border-default)'}`,
      background: checked ? 'var(--brand-primary)' : '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all var(--dur-fast) var(--ease-standard)'
    }
  }, checked && /*#__PURE__*/React.createElement("svg", {
    width: "11",
    height: "11",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#fff",
    strokeWidth: "3.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("polyline", {
    points: "20 6 9 17 4 12"
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }, label), count != null && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-sm)',
      color: 'var(--text-muted)'
    }
  }, count));
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/SearchInput.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * ARMOR BIKE SearchInput — the pill-shaped search field from the header bar.
 * Renders a leading magnifier icon and rounded-pill container.
 */
function SearchInput({
  value,
  onChange,
  placeholder = 'Search for bikes, gear & clothing…',
  size = 'md',
  style = {},
  ...rest
}) {
  const h = size === 'lg' ? 52 : 44;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-3)',
      height: h,
      padding: '0 20px',
      background: '#fff',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-pill)',
      boxShadow: 'var(--shadow-xs)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "20",
    height: "20",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "var(--text-muted)",
    strokeWidth: "2.2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: {
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "11",
    cy: "11",
    r: "7"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "21",
    y1: "21",
    x2: "16.65",
    y2: "16.65"
  })), /*#__PURE__*/React.createElement("input", _extends({
    value: value,
    onChange: onChange,
    placeholder: placeholder,
    style: {
      flex: 1,
      border: 'none',
      outline: 'none',
      background: 'transparent',
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-md)',
      color: 'var(--text-strong)'
    }
  }, rest)));
}
Object.assign(__ds_scope, { SearchInput });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/SearchInput.jsx", error: String((e && e.message) || e) }); }

// store-app.jsx
try { (() => {
/* ARMOR BIKE Storefront — interactive prototype app
   Consumes the compiled design-system bundle (window.BIKE24DesignSystem_2233bc). */
(function () {
  const DS = window.BIKE24DesignSystem_2233bc;
  const {
    Button,
    ProductCard,
    Badge,
    Checkbox,
    ColorSwatch,
    FilterGroup,
    SearchInput
  } = DS;
  const STORE = window.STORE;
  const TOTALS = {
    bikes: 103,
    parts: 1240,
    accessories: 864,
    electronics: 312,
    clothing: 978,
    shoes: 246,
    outdoor: 531,
    moresports: 489,
    brands: 207,
    sale: 248
  };
  const SORTS = ['Popularity', 'Price: low to high', 'Price: high to low', 'Newest'];
  function parsePrice(p) {
    return parseFloat(String(p).replace(/\./g, '').replace(',', '.')) || 0;
  }

  // ---------- small inline icons ----------
  const Icon = {
    burger: p => React.createElement('svg', {
      width: 26,
      height: 26,
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth: 2.2,
      strokeLinecap: 'round',
      ...p
    }, React.createElement('line', {
      x1: 3,
      y1: 6,
      x2: 21,
      y2: 6
    }), React.createElement('line', {
      x1: 3,
      y1: 12,
      x2: 21,
      y2: 12
    }), React.createElement('line', {
      x1: 3,
      y1: 18,
      x2: 21,
      y2: 18
    })),
    heart: p => React.createElement('svg', {
      width: 24,
      height: 24,
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth: 1.9,
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      ...p
    }, React.createElement('path', {
      d: 'M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z'
    })),
    user: p => React.createElement('svg', {
      width: 24,
      height: 24,
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth: 1.9,
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      ...p
    }, React.createElement('circle', {
      cx: 12,
      cy: 8,
      r: 4
    }), React.createElement('path', {
      d: 'M4 21a8 8 0 0 1 16 0'
    })),
    cart: p => React.createElement('svg', {
      width: 24,
      height: 24,
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth: 1.9,
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      ...p
    }, React.createElement('circle', {
      cx: 9,
      cy: 20,
      r: 1.4
    }), React.createElement('circle', {
      cx: 18,
      cy: 20,
      r: 1.4
    }), React.createElement('path', {
      d: 'M2 3h3l2.2 11.2a1.6 1.6 0 0 0 1.6 1.3h8.7a1.6 1.6 0 0 0 1.6-1.2L22 7H6'
    })),
    chevron: p => React.createElement('svg', {
      width: 16,
      height: 16,
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth: 2.4,
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      ...p
    }, React.createElement('polyline', {
      points: '6 9 12 15 18 9'
    })),
    sliders: p => React.createElement('svg', {
      width: 18,
      height: 18,
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth: 2,
      strokeLinecap: 'round',
      ...p
    }, React.createElement('line', {
      x1: 4,
      y1: 6,
      x2: 20,
      y2: 6
    }), React.createElement('line', {
      x1: 4,
      y1: 12,
      x2: 20,
      y2: 12
    }), React.createElement('line', {
      x1: 4,
      y1: 18,
      x2: 20,
      y2: 18
    }), React.createElement('circle', {
      cx: 9,
      cy: 6,
      r: 2,
      fill: '#fff'
    }), React.createElement('circle', {
      cx: 15,
      cy: 12,
      r: 2,
      fill: '#fff'
    }), React.createElement('circle', {
      cx: 8,
      cy: 18,
      r: 2,
      fill: '#fff'
    }))
  };

  // ---------- Header ----------
  function Header() {
    return React.createElement('header', {
      style: {
        background: 'var(--surface-header)',
        color: '#fff'
      }
    }, React.createElement('div', {
      style: {
        maxWidth: 'var(--container-max)',
        margin: '0 auto',
        height: 'var(--header-bar-h)',
        padding: '0 28px',
        display: 'flex',
        alignItems: 'center',
        gap: 26
      }
    }, React.createElement('button', {
      'aria-label': 'Menu',
      style: iconBtn
    }, React.createElement(Icon.burger, null)), React.createElement('img', {
      src: 'assets/logo-armorbike-on-blue.svg',
      alt: 'ARMOR BIKE',
      style: {
        height: 34,
        display: 'block'
      }
    }), React.createElement('div', {
      style: {
        flex: 1,
        maxWidth: 720,
        margin: '0 8px'
      }
    }, React.createElement(SearchInput, {
      placeholder: 'Search for bikes, gear & clothing…'
    })), React.createElement(HeaderAction, {
      icon: Icon.heart,
      label: 'Wishlist'
    }), React.createElement(HeaderAction, {
      icon: Icon.user,
      label: 'Account'
    }), React.createElement(HeaderAction, {
      icon: Icon.cart,
      label: 'Cart',
      badge: 2
    })));
  }
  function HeaderAction({
    icon,
    label,
    badge
  }) {
    return React.createElement('button', {
      style: {
        ...iconBtn,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 3,
        fontFamily: 'var(--font-sans)',
        fontSize: 12,
        fontWeight: 600
      }
    }, React.createElement('span', {
      style: {
        position: 'relative',
        display: 'block'
      }
    }, React.createElement(icon, null), badge ? React.createElement('span', {
      style: {
        position: 'absolute',
        top: -6,
        right: -8,
        minWidth: 17,
        height: 17,
        padding: '0 4px',
        borderRadius: 999,
        background: 'var(--brand-accent)',
        color: 'var(--gray-900)',
        fontSize: 10,
        fontWeight: 800,
        lineHeight: '17px',
        textAlign: 'center'
      }
    }, badge) : null), React.createElement('span', null, label));
  }
  const iconBtn = {
    background: 'none',
    border: 'none',
    color: '#fff',
    cursor: 'pointer',
    padding: 0,
    display: 'flex',
    alignItems: 'center'
  };

  // ---------- Nav + Mega menu ----------
  function NavBar({
    openMenu,
    activeCat,
    onTopClick,
    onTopEnter,
    onSubClick,
    onClose
  }) {
    return React.createElement('div', {
      onMouseLeave: onClose,
      style: {
        position: 'relative',
        borderBottom: '1px solid var(--border-subtle)',
        background: '#fff',
        zIndex: 40
      }
    }, React.createElement('nav', {
      style: {
        maxWidth: 'var(--container-max)',
        margin: '0 auto',
        padding: '0 28px',
        height: 'var(--nav-bar-h)',
        display: 'flex',
        alignItems: 'stretch',
        gap: 4
      }
    }, STORE.categories.map(c => {
      const open = openMenu === c.id;
      const active = activeCat === c.id;
      const isSale = !!c.accent;
      return React.createElement('button', {
        key: c.id,
        onClick: () => onTopClick(c),
        onMouseEnter: () => onTopEnter(c),
        style: {
          position: 'relative',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '0 14px',
          fontFamily: 'var(--font-sans)',
          fontSize: 'var(--text-md)',
          fontWeight: isSale ? 800 : open || active ? 700 : 600,
          letterSpacing: isSale ? '0.04em' : 0,
          color: isSale ? 'var(--brand-sale)' : open ? 'var(--brand-primary)' : 'var(--text-strong)',
          borderBottom: '3px solid ' + (open ? 'var(--brand-primary)' : 'transparent'),
          marginBottom: -1,
          transition: 'color .12s, border-color .12s'
        }
      }, c.label);
    })), openMenu ? React.createElement(MegaMenu, {
      cat: STORE.map[openMenu],
      onSubClick
    }) : null);
  }
  function MegaMenu({
    cat,
    onSubClick
  }) {
    return React.createElement('div', {
      style: {
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
        background: '#fff',
        borderTop: '1px solid var(--border-subtle)',
        boxShadow: 'var(--shadow-lg)'
      }
    }, React.createElement('div', {
      style: {
        maxWidth: 'var(--container-max)',
        margin: '0 auto',
        padding: '32px 28px 38px',
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr) 300px',
        gap: 28
      }
    }, cat.mega.map((column, ci) => React.createElement('div', {
      key: ci,
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 26
      }
    }, column.map((grp, gi) => React.createElement('div', {
      key: gi
    }, React.createElement('div', {
      style: {
        fontFamily: 'var(--font-display)',
        fontWeight: 800,
        fontSize: 'var(--text-lg)',
        color: 'var(--text-strong)',
        marginBottom: 12
      }
    }, grp.title), React.createElement('ul', {
      style: {
        listStyle: 'none',
        margin: 0,
        padding: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 9
      }
    }, grp.links.map(lk => React.createElement('li', {
      key: lk
    }, React.createElement('a', {
      href: '#',
      onClick: e => {
        e.preventDefault();
        onSubClick(cat, lk);
      },
      style: megaLink,
      onMouseEnter: e => e.currentTarget.style.color = 'var(--brand-primary)',
      onMouseLeave: e => e.currentTarget.style.color = 'var(--text-body)'
    }, lk)))))))), React.createElement(BestSellers, {
      cat,
      onSubClick
    })));
  }
  const megaLink = {
    textDecoration: 'none',
    color: 'var(--text-body)',
    fontFamily: 'var(--font-sans)',
    fontSize: 'var(--text-md)',
    transition: 'color .12s',
    cursor: 'pointer'
  };
  function BestSellers({
    cat,
    onSubClick
  }) {
    return React.createElement('div', {
      style: {
        borderLeft: '1px solid var(--border-subtle)',
        paddingLeft: 26,
        display: 'flex',
        flexDirection: 'column',
        gap: 14
      }
    }, React.createElement('div', {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8
      }
    }, React.createElement('span', {
      style: {
        width: 8,
        height: 8,
        borderRadius: 2,
        background: 'var(--brand-sale)'
      }
    }), React.createElement('div', {
      style: {
        fontFamily: 'var(--font-display)',
        fontWeight: 800,
        fontSize: 'var(--text-lg)',
        color: 'var(--text-strong)'
      }
    }, 'This Week\u2019s Best Sellers')), cat.products.slice(0, 3).map((p, i) => React.createElement('a', {
      key: i,
      href: '#',
      onClick: e => {
        e.preventDefault();
        onSubClick(cat, cat.leaf);
      },
      style: {
        display: 'flex',
        gap: 12,
        alignItems: 'center',
        textDecoration: 'none',
        padding: '6px 0'
      }
    }, React.createElement('div', {
      style: {
        width: 60,
        height: 60,
        flexShrink: 0,
        background: 'var(--surface-media)',
        borderRadius: 'var(--radius-sm)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--gray-300)',
        fontFamily: 'var(--font-mono)',
        fontSize: 10
      }
    }, 'IMG'), React.createElement('div', {
      style: {
        minWidth: 0
      }
    }, React.createElement('div', {
      style: {
        fontFamily: 'var(--font-sans)',
        fontWeight: 700,
        fontSize: 11,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        color: 'var(--text-strong)'
      }
    }, p.manufacturer), React.createElement('div', {
      style: {
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--text-sm)',
        color: 'var(--text-body)',
        lineHeight: 1.25,
        margin: '2px 0 4px',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden'
      }
    }, p.name), React.createElement('div', {
      style: {
        fontFamily: 'var(--font-display)',
        fontWeight: 800,
        fontSize: 'var(--text-md)',
        color: p.oldPrice ? 'var(--text-sale)' : 'var(--text-strong)'
      }
    }, p.price + '\u00a0\u20ac*')))), React.createElement('a', {
      href: '#',
      onClick: e => {
        e.preventDefault();
        onSubClick(cat, cat.leaf);
      },
      style: {
        fontFamily: 'var(--font-sans)',
        fontWeight: 700,
        fontSize: 'var(--text-sm)',
        color: 'var(--text-link)',
        textDecoration: 'none',
        marginTop: 2
      }
    }, 'See all best sellers \u2192'));
  }

  // ---------- Breadcrumb ----------
  function Breadcrumb({
    cat,
    leaf
  }) {
    const parts = ['Home'].concat(cat.crumb, [leaf]);
    return React.createElement('div', {
      style: {
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: 8,
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--text-sm)',
        color: 'var(--text-muted)',
        padding: '18px 0 4px'
      }
    }, parts.map((p, i) => React.createElement('span', {
      key: i,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8
      }
    }, React.createElement('span', {
      style: {
        color: i === parts.length - 1 ? 'var(--text-body)' : 'var(--text-link)',
        fontWeight: i === parts.length - 1 ? 600 : 400
      }
    }, p), i < parts.length - 1 ? React.createElement('span', {
      style: {
        color: 'var(--border-default)'
      }
    }, '\u203a') : null)));
  }

  // ---------- Sidebar ----------
  function Sidebar({
    cat,
    checked,
    toggleCheck,
    colors,
    toggleColor
  }) {
    return React.createElement('aside', {
      style: {
        width: 290,
        flexShrink: 0
      }
    }, cat.facets.map((f, i) => React.createElement(Facet, {
      key: cat.id + i,
      facet: f,
      fkey: cat.id + i,
      checked,
      toggleCheck,
      colors,
      toggleColor
    })), React.createElement('div', {
      style: {
        display: 'flex',
        justifyContent: 'center',
        padding: '22px 0 8px'
      }
    }, React.createElement(Button, {
      variant: 'ghost',
      iconLeft: React.createElement(Icon.sliders, {
        stroke: 'var(--brand-primary)'
      }),
      style: {
        color: 'var(--brand-primary)'
      }
    }, 'More filter')));
  }
  function Facet({
    facet,
    fkey,
    checked,
    toggleCheck,
    colors,
    toggleColor
  }) {
    if (facet.kind === 'range') return React.createElement(RangeFacet, {
      facet
    });
    if (facet.kind === 'toggles') return React.createElement('div', {
      style: {
        padding: 'var(--space-5) 0',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-3)'
      }
    }, facet.options.map(o => React.createElement(Checkbox, {
      key: o.label,
      checked: !!checked[fkey + ':' + o.label],
      onChange: () => toggleCheck(fkey, o.label),
      count: o.count,
      label: React.createElement('span', {
        style: {
          color: o.sale ? 'var(--text-sale)' : 'var(--text-body)',
          fontWeight: o.sale ? 700 : 400
        }
      }, o.label)
    })));
    if (facet.kind === 'color') return React.createElement(FilterGroup, {
      title: facet.title
    }, React.createElement('div', {
      style: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: 14,
        paddingTop: 4
      }
    }, facet.options.map((o, idx) => React.createElement(ColorSwatch, {
      key: idx,
      color: o.color,
      count: o.count,
      selected: !!colors[fkey + ':' + idx],
      onClick: () => toggleColor(fkey, idx)
    }))));
    // check
    return React.createElement(FilterGroup, {
      title: facet.title
    }, facet.options.map(o => React.createElement(Checkbox, {
      key: o.label,
      checked: !!checked[fkey + ':' + o.label],
      onChange: () => toggleCheck(fkey, o.label),
      label: o.label,
      count: o.count
    })), facet.more ? React.createElement('button', {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '2px 0',
        color: 'var(--text-link)',
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--text-sm)',
        fontWeight: 600
      }
    }, React.createElement(Icon.chevron, {
      stroke: 'var(--text-link)'
    }), 'Show more') : null);
  }
  function RangeFacet({
    facet
  }) {
    return React.createElement('div', {
      style: {
        padding: '4px 0 var(--space-6)',
        borderBottom: '1px solid var(--border-subtle)'
      }
    }, React.createElement('div', {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12
      }
    }, React.createElement(PriceBox, {
      value: facet.min
    }), React.createElement('span', {
      style: {
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--text-sm)',
        color: 'var(--text-muted)'
      }
    }, 'To'), React.createElement(PriceBox, {
      value: facet.max
    })), React.createElement('div', {
      style: {
        position: 'relative',
        height: 4,
        background: 'var(--gray-200)',
        borderRadius: 999,
        margin: '22px 6px 6px'
      }
    }, React.createElement('div', {
      style: {
        position: 'absolute',
        left: '4%',
        right: '4%',
        top: 0,
        bottom: 0,
        background: 'var(--brand-primary)',
        borderRadius: 999
      }
    }), React.createElement('span', {
      style: rangeHandle('4%')
    }), React.createElement('span', {
      style: rangeHandle('96%')
    })));
  }
  function rangeHandle(left) {
    return {
      position: 'absolute',
      left,
      top: '50%',
      width: 16,
      height: 16,
      transform: 'translate(-50%,-50%)',
      background: '#fff',
      border: '2px solid var(--brand-primary)',
      borderRadius: '50%',
      boxShadow: 'var(--shadow-xs)'
    };
  }
  function PriceBox({
    value
  }) {
    return React.createElement('div', {
      style: {
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        height: 40,
        padding: '0 12px',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-sm)',
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--text-md)',
        color: 'var(--text-strong)'
      }
    }, React.createElement('span', {
      style: {
        color: 'var(--text-muted)'
      }
    }, '\u20ac'), React.createElement('span', null, value));
  }

  // ---------- Main / product grid ----------
  function Main({
    cat,
    leaf,
    sort,
    setSort
  }) {
    const products = React.useMemo(() => {
      const arr = cat.products.slice();
      if (sort === 'Price: low to high') arr.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));else if (sort === 'Price: high to low') arr.sort((a, b) => parsePrice(b.price) - parsePrice(a.price));else if (sort === 'Newest') arr.sort((a, b) => (b.badge === 'New' ? 1 : 0) - (a.badge === 'New' ? 1 : 0));
      return arr;
    }, [cat, sort]);
    return React.createElement('section', {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, React.createElement('h1', {
      style: {
        fontFamily: 'var(--font-display)',
        fontWeight: 900,
        fontSize: 'var(--text-4xl)',
        letterSpacing: '-0.02em',
        color: 'var(--text-strong)',
        margin: '0 0 18px'
      }
    }, leaf), React.createElement('div', {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 22
      }
    }, React.createElement('div', {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10
      }
    }, React.createElement('span', {
      style: {
        background: 'var(--gray-100)',
        color: 'var(--text-strong)',
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: 'var(--text-sm)',
        padding: '4px 10px',
        borderRadius: 'var(--radius-sm)'
      }
    }, TOTALS[cat.id].toLocaleString()), React.createElement('span', {
      style: {
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--text-md)',
        color: 'var(--text-muted)'
      }
    }, 'products')), React.createElement(SortMenu, {
      sort,
      setSort
    })), React.createElement('div', {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 24
      }
    }, products.map((p, i) => React.createElement(ProductCard, {
      key: cat.id + i,
      ...p
    }))));
  }
  function SortMenu({
    sort,
    setSort
  }) {
    const [open, setOpen] = React.useState(false);
    return React.createElement('div', {
      style: {
        position: 'relative'
      },
      onMouseLeave: () => setOpen(false)
    }, React.createElement('button', {
      onClick: () => setOpen(o => !o),
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        fontFamily: 'var(--font-sans)',
        fontWeight: 700,
        fontSize: 'var(--text-md)',
        color: 'var(--brand-primary)'
      }
    }, sort, React.createElement(Icon.chevron, {
      stroke: 'var(--brand-primary)',
      style: {
        transform: open ? 'rotate(180deg)' : 'none',
        transition: 'transform .12s'
      }
    })), open ? React.createElement('div', {
      style: {
        position: 'absolute',
        top: '100%',
        right: 0,
        marginTop: 8,
        background: '#fff',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-sm)',
        boxShadow: 'var(--shadow-md)',
        minWidth: 200,
        zIndex: 30,
        overflow: 'hidden'
      }
    }, SORTS.map(s => React.createElement('button', {
      key: s,
      onClick: () => {
        setSort(s);
        setOpen(false);
      },
      style: {
        display: 'block',
        width: '100%',
        textAlign: 'left',
        padding: '10px 14px',
        background: s === sort ? 'var(--blue-50)' : '#fff',
        border: 'none',
        cursor: 'pointer',
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--text-md)',
        color: s === sort ? 'var(--brand-primary)' : 'var(--text-body)',
        fontWeight: s === sort ? 700 : 400
      }
    }, s))) : null);
  }

  // ---------- App ----------
  function App() {
    const [openMenu, setOpenMenu] = React.useState(null);
    const [activeCat, setActiveCat] = React.useState('bikes');
    const [leaf, setLeaf] = React.useState(STORE.map.bikes.leaf);
    const [sort, setSort] = React.useState('Popularity');
    const [checked, setChecked] = React.useState({});
    const [colors, setColors] = React.useState({});
    const cat = STORE.map[activeCat];
    const resetFilters = () => {
      setChecked({});
      setColors({});
      setSort('Popularity');
    };
    const toggleCheck = (fkey, label) => setChecked(s => {
      const k = fkey + ':' + label;
      const n = {
        ...s
      };
      if (n[k]) delete n[k];else n[k] = true;
      return n;
    });
    const toggleColor = (fkey, idx) => setColors(s => {
      const k = fkey + ':' + idx;
      const n = {
        ...s
      };
      if (n[k]) delete n[k];else n[k] = true;
      return n;
    });
    const onTopClick = c => {
      setActiveCat(c.id);
      setLeaf(c.leaf);
      resetFilters();
      setOpenMenu(null);
    };
    const onTopEnter = c => setOpenMenu(c.id);
    const onSubClick = (c, label) => {
      setActiveCat(c.id);
      setLeaf(label);
      resetFilters();
      setOpenMenu(null);
    };
    const onClose = () => setOpenMenu(null);
    return React.createElement(React.Fragment, null, React.createElement(Header, null), React.createElement(NavBar, {
      openMenu,
      activeCat,
      onTopClick,
      onTopEnter,
      onSubClick,
      onClose
    }), openMenu ? React.createElement('div', {
      onClick: onClose,
      style: {
        position: 'fixed',
        inset: 0,
        background: 'rgba(22,24,29,0.28)',
        zIndex: 20
      }
    }) : null, React.createElement('main', {
      style: {
        maxWidth: 'var(--container-max)',
        margin: '0 auto',
        padding: '0 28px 80px'
      }
    }, React.createElement(Breadcrumb, {
      cat,
      leaf
    }), React.createElement('div', {
      style: {
        display: 'flex',
        gap: 40,
        alignItems: 'flex-start',
        marginTop: 14
      }
    }, React.createElement(Sidebar, {
      cat,
      checked,
      toggleCheck,
      colors,
      toggleColor
    }), React.createElement(Main, {
      cat,
      leaf,
      sort,
      setSort
    }))));
  }
  ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(App));
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "store-app.jsx", error: String((e && e.message) || e) }); }

// store-data.js
try { (() => {
/* ============================================================
   ARMOR BIKE Storefront — demo data
   Exposed as window.STORE for the prototype app.
   ============================================================ */
(function () {
  var HEX = {
    grey: '#9aa6b4',
    black: '#16181d',
    white: '#ffffff',
    silver: '#cbd4de',
    blue: '#006ee0',
    red: '#e0004b',
    yellow: '#ffd105',
    green: '#1a8a4f',
    orange: '#f97316',
    purple: '#6d28d9',
    teal: '#14b8a6',
    pink: '#ec4899',
    brown: '#8b5e3c'
  };

  // ---- shorthand builders -------------------------------------
  function g(title, links) {
    return {
      title: title,
      links: links
    };
  }
  function chk(title, options, more) {
    return {
      kind: 'check',
      title: title,
      options: options,
      more: !!more
    };
  }
  function col(title, opts) {
    return {
      kind: 'color',
      title: title,
      options: opts
    };
  }
  function opt(label, count) {
    return {
      label: label,
      count: count
    };
  }
  function sw(color, count) {
    return {
      color: color,
      count: count
    };
  }
  function range(min, max) {
    return {
      kind: 'range',
      min: min,
      max: max
    };
  }
  function toggles(options) {
    return {
      kind: 'toggles',
      options: options
    };
  }
  var colorsBig = col('Colors', [sw(HEX.grey, 16), sw(HEX.purple, 15), sw(HEX.black, 14), sw(HEX.blue, 13), sw(HEX.yellow, 11), sw(HEX.green, 8), sw(HEX.orange, 7), sw(HEX.teal, 7), sw(HEX.red, 5), sw(HEX.silver, 4), sw(HEX.pink, 2), sw(HEX.brown, 2)]);
  var categories = [{
    id: 'bikes',
    label: 'Bikes',
    leaf: 'Mountain Bikes',
    crumb: ['Cycling', 'Bikes'],
    mega: [[g('Mountain Bikes', ['Hardtail', 'Full Suspension', 'Trail', 'Enduro', 'Downhill', 'Cross Country'])], [g('E-Bikes', ['E-Mountain', 'E-Trekking', 'E-City', 'E-Road', 'E-Cargo'])], [g('Road & Gravel', ['Road Bikes', 'Gravel Bikes', 'Cyclocross', 'Triathlon']), g('City & Trekking', ['City Bikes', 'Trekking', 'Touring', 'Folding'])], [g("Kids' Bikes", ['Kids Mountain Bikes', 'Balance Bikes', '16" Wheels', '20" Wheels', '24" Wheels'])]],
    facets: [range('310', '2353'), toggles([{
      label: 'Sale %',
      count: 14,
      sale: true
    }, {
      label: 'In stock',
      count: 75
    }]), chk('Wheel Size', [opt('29" (622mm)', 42), opt('27.5" (584mm)', 38), opt('26" (559mm)', 11), opt('24" (507mm)', 35), opt('20" (406mm)', 40), opt('16" (305mm)', 8)], true), chk('Manufacturer', [opt('Academy', 10), opt('CUBE', 24), opt('Canyon', 16), opt('Orbea', 12), opt('SCOTT', 18)], true), chk('Frame Size', [opt('S', 21), opt('M', 34), opt('L', 28), opt('XL', 14)]), colorsBig, chk('Number Of Gears', [opt('1 × 12', 22), opt('1 × 11', 19), opt('1 × 9', 16), opt('2 × 11', 14)], true), chk('Brake Type', [opt('Disc Brake', 81), opt('Rim Brake', 22)])],
    products: [{
      manufacturer: 'CUBE',
      name: 'Reaction Hybrid Pro 625 — 29" E-Mountain',
      spec: '2026 · grey / blue',
      price: '2.299,00',
      oldPrice: '2.799,00',
      badge: '-18%',
      note: 'Ships in 24h'
    }, {
      manufacturer: 'Canyon',
      name: 'Spectral 29 CF 8 — Trail Full Suspension',
      spec: '2026 · stealth black',
      price: '3.499,00'
    }, {
      manufacturer: 'Orbea',
      name: 'Alma M30 — 29" Cross-Country Hardtail',
      spec: '2026 · metallic sunset',
      price: '2.099,00',
      badge: 'New'
    }, {
      manufacturer: 'SCOTT',
      name: 'Scale 970 — 29" Mountain Bike',
      spec: '2026 · black / lime',
      price: '1.299,00',
      oldPrice: '1.499,00',
      note: 'Only 3 left'
    }, {
      manufacturer: 'Academy',
      name: 'Trail 5 — 24" Kids Mountain Bike',
      spec: '2026 · space grey',
      price: '738,66'
    }, {
      manufacturer: 'Marin',
      name: 'Rift Zone JR 24 — Kids Mountain Bike',
      spec: '2026 · green / yellow fade',
      price: '1.427,73',
      badge: 'Bestseller'
    }]
  }, {
    id: 'parts',
    label: 'Parts',
    leaf: 'Drivetrain',
    crumb: ['Cycling', 'Parts'],
    mega: [[g('Drivetrain', ['Cassettes', 'Cranks', 'Chains', 'Chainrings', 'Bottom Brackets', 'Power Meters']), g('Shifting Parts', ['Groupsets', 'Rear Derailleurs', 'Shifters', 'Hub Gears'])], [g('Cockpit', ['Handlebars', 'Stems', 'Handlebar Tape', 'Grips', 'Headsets', 'Bar Ends']), g('Brakes', ['Disc Brakes', 'Rim Brakes', 'Bleed Kits', 'Brake Parts'])], [g('Wheels', ['Wheelsets', 'Hubs & Freewheels', 'Rims', 'Spokes & Nipples']), g('Tires & Tubes', ['Tires', 'Inner Tubes', 'Tubeless'])], [g('Pedals', ['Flat Pedals', 'Clipless Pedals', 'Hybrid Pedals', 'Cleats']), g('Seatposts & Saddles', ['Saddles', 'Dropper Posts', 'Rigid Posts', 'Seat Clamps'])]],
    facets: [range('12', '899'), toggles([{
      label: 'Sale %',
      count: 9,
      sale: true
    }, {
      label: 'In stock',
      count: 142
    }]), chk('Part Type', [opt('Drivetrain', 64), opt('Brakes', 38), opt('Wheels', 27), opt('Cockpit', 41), opt('Pedals', 22)], true), chk('Manufacturer', [opt('Shimano', 58), opt('SRAM', 44), opt('DT Swiss', 19), opt('Fox', 12), opt('Race Face', 16)], true), chk('Material', [opt('Aluminium', 71), opt('Carbon', 33), opt('Steel', 24), opt('Titanium', 9)]), colorsBig],
    products: [{
      manufacturer: 'Shimano',
      name: 'Deore XT M8100 Groupset — 1 × 12',
      spec: 'Disc · 10–51T',
      price: '549,00',
      oldPrice: '629,00',
      badge: '-13%',
      note: 'Ships in 24h'
    }, {
      manufacturer: 'SRAM',
      name: 'GX Eagle Cassette — 10–52T',
      spec: '12-speed · XD',
      price: '312,90'
    }, {
      manufacturer: 'DT Swiss',
      name: 'XR 1700 Spline Wheelset — 29"',
      spec: 'Centerlock · Boost',
      price: '689,00',
      badge: 'New'
    }, {
      manufacturer: 'Fox',
      name: '36 Float Performance Fork — 160mm',
      spec: '29" · GRIP damper',
      price: '899,00',
      note: 'Only 2 left'
    }, {
      manufacturer: 'Shimano',
      name: 'Deore XT Disc Brake Set — Front + Rear',
      spec: '4-piston · Ice-Tech',
      price: '274,50',
      oldPrice: '319,00'
    }, {
      manufacturer: 'Race Face',
      name: 'Aeffect R Crank Set — 32T',
      spec: 'Boost · 170mm',
      price: '189,90'
    }]
  }, {
    id: 'accessories',
    label: 'Accessories',
    leaf: 'Bags & Backpacks',
    crumb: ['Cycling', 'Accessories'],
    mega: [[g('Bags & Backpacks', ['Saddle Bags', 'Frame Bags', 'Panniers', 'Backpacks', 'Bar Bags'])], [g('Lights & Locks', ['Front Lights', 'Rear Lights', 'Light Sets', 'Frame Locks', 'Chain Locks'])], [g('Care & Tools', ['Multi-Tools', 'Pumps', 'Cleaning', 'Lubricants', 'Workstands'])], [g('Hydration', ['Bottles', 'Cages', 'Hydration Packs']), g('Protection', ['Mudguards', 'Frame Protection', 'Bells'])]],
    facets: [range('9', '199'), toggles([{
      label: 'Sale %',
      count: 6,
      sale: true
    }, {
      label: 'In stock',
      count: 210
    }]), chk('Type', [opt('Bags', 48), opt('Locks', 22), opt('Lights', 36), opt('Pumps', 18), opt('Bottles', 41), opt('Mudguards', 14)], true), chk('Manufacturer', [opt('Ortlieb', 24), opt('Abus', 19), opt('Lezyne', 28), opt('Topeak', 22), opt('SKS', 17)], true), colorsBig],
    products: [{
      manufacturer: 'Ortlieb',
      name: 'Back-Roller Classic Panniers — 40L',
      spec: 'Waterproof · pair',
      price: '129,90',
      badge: 'Bestseller'
    }, {
      manufacturer: 'Abus',
      name: 'Bordo 6000 Folding Lock — 90cm',
      spec: 'Security level 10',
      price: '89,95',
      oldPrice: '99,95',
      badge: '-10%'
    }, {
      manufacturer: 'Lezyne',
      name: 'Macro Drive 1300 Front Light',
      spec: '1300 lumen · USB-C',
      price: '64,90'
    }, {
      manufacturer: 'Topeak',
      name: 'JoeBlow Sport III Floor Pump',
      spec: '160 psi · gauge',
      price: '44,90'
    }, {
      manufacturer: 'Fidlock',
      name: 'TWIST Bottle 600 + Base Mount',
      spec: 'Magnetic · 600ml',
      price: '34,90',
      badge: 'New'
    }, {
      manufacturer: 'SKS',
      name: 'Bluemels Mudguard Set — 29"',
      spec: 'Front + rear',
      price: '39,99'
    }]
  }, {
    id: 'electronics',
    label: 'Electronics',
    leaf: 'Bike Computers',
    crumb: ['Cycling', 'Electronics'],
    mega: [[g('Bike Computers', ['GPS Computers', 'Mounts', 'Speed & Cadence', 'Heart Rate'])], [g('Lights', ['Front Lights', 'Rear Lights', 'Helmet Lights', 'Light Sets'])], [g('Cameras & Audio', ['Action Cameras', 'Camera Mounts', 'Headphones'])], [g('Power', ['Power Banks', 'Chargers', 'Dynamos']), g('Smart Trainers', ['Direct Drive', 'Wheel-On', 'Rollers'])]],
    facets: [range('99', '699'), toggles([{
      label: 'Sale %',
      count: 5,
      sale: true
    }, {
      label: 'In stock',
      count: 64
    }]), chk('Type', [opt('GPS Computers', 22), opt('Action Cameras', 11), opt('Lights', 28), opt('Sensors', 19), opt('Displays', 9)], true), chk('Manufacturer', [opt('Garmin', 26), opt('Wahoo', 14), opt('GoPro', 8), opt('Sigma', 12), opt('Bosch', 10)], true), chk('Connectivity', [opt('ANT+', 38), opt('Bluetooth', 41), opt('WiFi', 17), opt('GPS', 24)])],
    products: [{
      manufacturer: 'Garmin',
      name: 'Edge 1040 Solar — GPS Computer',
      spec: 'Solar · 45h battery',
      price: '629,00',
      badge: 'Bestseller'
    }, {
      manufacturer: 'Wahoo',
      name: 'ELEMNT BOLT V2 — GPS Computer',
      spec: 'Color · aero',
      price: '279,90',
      oldPrice: '299,90',
      badge: '-7%'
    }, {
      manufacturer: 'GoPro',
      name: 'HERO12 Black — Action Camera',
      spec: '5.3K · HyperSmooth',
      price: '399,00'
    }, {
      manufacturer: 'Garmin',
      name: 'Varia RCT715 — Radar Rear Light',
      spec: 'Camera + radar',
      price: '349,00',
      badge: 'New'
    }, {
      manufacturer: 'Sigma',
      name: 'ROX 11.1 EVO — GPS Set',
      spec: 'With sensors',
      price: '169,95'
    }, {
      manufacturer: 'Bosch',
      name: 'Kiox 300 — Display Kit',
      spec: 'Smart System',
      price: '159,90'
    }]
  }, {
    id: 'clothing',
    label: 'Clothing',
    leaf: 'Jerseys',
    crumb: ['Cycling', 'Clothing'],
    mega: [[g('Jerseys & Tops', ['Short Sleeve', 'Long Sleeve', 'Base Layers', 'Wind Vests'])], [g('Shorts & Tights', ['Bib Shorts', 'Shorts', 'Tights', 'Trousers'])], [g('Jackets', ['Rain Jackets', 'Wind Jackets', 'Thermal', 'Gilets'])], [g('Accessories', ['Gloves', 'Socks', 'Caps', 'Arm Warmers']), g('By Gender', ['Men', 'Women', 'Kids'])]],
    facets: [range('29', '249'), toggles([{
      label: 'Sale %',
      count: 12,
      sale: true
    }, {
      label: 'In stock',
      count: 96
    }]), chk('Size', [opt('XS', 14), opt('S', 38), opt('M', 52), opt('L', 47), opt('XL', 29)], true), chk('Gender', [opt('Men', 64), opt('Women', 41), opt('Unisex', 22)]), chk('Manufacturer', [opt('Castelli', 22), opt('GORE', 18), opt('Assos', 14), opt('Endura', 20), opt('Maloja', 11)], true), colorsBig],
    products: [{
      manufacturer: 'Castelli',
      name: 'Free Aero RC — Bib Shorts',
      spec: "Men's · black",
      price: '159,95',
      badge: 'Bestseller'
    }, {
      manufacturer: 'GORE',
      name: 'Spinshift GTX — Rain Jacket',
      spec: 'GORE-TEX · orange',
      price: '199,99',
      oldPrice: '249,99',
      badge: '-20%'
    }, {
      manufacturer: 'Assos',
      name: 'Mille GT Jersey C2 — Short Sleeve',
      spec: "Men's · blue",
      price: '89,90'
    }, {
      manufacturer: 'Endura',
      name: 'MT500 Burner — Trail Shorts',
      spec: "Men's · olive",
      price: '99,99',
      badge: 'New'
    }, {
      manufacturer: 'Maloja',
      name: 'NadelM. — Long Sleeve Jersey',
      spec: "Women's · plum",
      price: '79,90'
    }, {
      manufacturer: 'Shimano',
      name: 'Vertex Thermal — Tights',
      spec: 'Unisex · black',
      price: '119,95'
    }]
  }, {
    id: 'shoes',
    label: 'Shoes',
    leaf: 'Road Shoes',
    crumb: ['Cycling', 'Shoes'],
    mega: [[g('Road Shoes', ['Performance', 'Endurance', 'Triathlon', "Women's"])], [g('MTB Shoes', ['Clipless', 'Flat', 'Gravel', 'Winter'])], [g('Casual & Urban', ['Commuter', 'Lifestyle', 'Sandals'])], [g('Accessories', ['Insoles', 'Cleats', 'Shoe Covers', 'Laces'])]],
    facets: [range('99', '449'), toggles([{
      label: 'Sale %',
      count: 7,
      sale: true
    }, {
      label: 'In stock',
      count: 58
    }]), chk('Shoe Size', [opt('40', 22), opt('41', 31), opt('42', 44), opt('43', 41), opt('44', 33), opt('45', 18)], true), chk('Discipline', [opt('Road', 36), opt('MTB', 41), opt('Gravel', 17), opt('Urban', 12)]), chk('Manufacturer', [opt('Shimano', 24), opt('Five Ten', 14), opt('Sidi', 11), opt('Giro', 19), opt('Fizik', 16)], true), colorsBig],
    products: [{
      manufacturer: 'Shimano',
      name: 'RC903 S-PHYRE — Road Shoe',
      spec: 'Carbon · BOA',
      price: '379,95',
      badge: 'Bestseller'
    }, {
      manufacturer: 'Five Ten',
      name: 'Freerider Pro — MTB Flat Shoe',
      spec: 'Stealth rubber',
      price: '149,95',
      oldPrice: '169,95',
      badge: '-13%'
    }, {
      manufacturer: 'Sidi',
      name: 'Wire 2 Carbon — Road Shoe',
      spec: 'Tecno-3 dial',
      price: '449,00'
    }, {
      manufacturer: 'Giro',
      name: 'Empire VR90 — MTB Shoe',
      spec: 'Lace-up · Vibram',
      price: '259,95',
      badge: 'New'
    }, {
      manufacturer: 'Northwave',
      name: 'Origin Plus 2 — Gravel Shoe',
      spec: 'SLW3 dial',
      price: '139,95'
    }, {
      manufacturer: 'Fizik',
      name: 'Terra Atlas — Gravel Shoe',
      spec: 'Velcro · grippy',
      price: '159,00'
    }]
  }, {
    id: 'outdoor',
    label: 'Outdoor',
    leaf: 'Backpacks',
    crumb: ['Outdoor'],
    mega: [[g('Camping', ['Tents', 'Sleeping Bags', 'Sleeping Mats', 'Stoves'])], [g('Backpacks', ['Daypacks', 'Hiking Packs', 'Hydration Packs'])], [g('Apparel', ['Jackets', 'Base Layers', 'Trousers', 'Footwear'])], [g('Navigation', ['GPS Devices', 'Compasses', 'Headlamps']), g('Accessories', ['Trekking Poles', 'Water Filters', 'First Aid'])]],
    facets: [range('39', '249'), toggles([{
      label: 'Sale %',
      count: 8,
      sale: true
    }, {
      label: 'In stock',
      count: 73
    }]), chk('Category', [opt('Backpacks', 28), opt('Tents', 14), opt('Sleeping', 19), opt('Lighting', 22), opt('Cooking', 11)], true), chk('Manufacturer', [opt('Vaude', 18), opt('The North Face', 14), opt('Deuter', 21), opt('Petzl', 9), opt('Primus', 7)], true), colorsBig],
    products: [{
      manufacturer: 'Vaude',
      name: 'Asymmetric 42+8 — Hiking Backpack',
      spec: 'Green Shape · blue',
      price: '179,90',
      badge: 'Bestseller'
    }, {
      manufacturer: 'The North Face',
      name: 'Stormbreak 2 — Tent',
      spec: '2-person · 3-season',
      price: '199,95',
      oldPrice: '234,95',
      badge: '-15%'
    }, {
      manufacturer: 'Deuter',
      name: 'Aircontact Lite 50+10 — Pack',
      spec: 'Trekking · slate',
      price: '169,95'
    }, {
      manufacturer: 'Petzl',
      name: 'Actik Core — Headlamp',
      spec: '600 lumen · USB',
      price: '64,95',
      badge: 'New'
    }, {
      manufacturer: 'Primus',
      name: 'Lite+ — Stove System',
      spec: 'Integrated · 0.5L',
      price: '99,90'
    }, {
      manufacturer: 'Therm-a-Rest',
      name: 'NeoAir XLite — Sleeping Mat',
      spec: 'R-value 4.5',
      price: '209,95'
    }]
  }, {
    id: 'moresports',
    label: 'More Sports',
    leaf: 'Running',
    crumb: ['Sports'],
    mega: [[g('Running', ['Shoes', 'Apparel', 'Watches', 'Accessories'])], [g('Swimming', ['Wetsuits', 'Goggles', 'Caps', 'Swimwear'])], [g('Fitness', ['Smart Trainers', 'Weights', 'Mats', 'Bands'])], [g('Winter', ['Ski', 'Snowboard', 'Apparel', 'Goggles']), g('Triathlon', ['Tri Suits', 'Race Belts', 'Transition'])]],
    facets: [range('39', '649'), toggles([{
      label: 'Sale %',
      count: 10,
      sale: true
    }, {
      label: 'In stock',
      count: 88
    }]), chk('Sport', [opt('Running', 34), opt('Swimming', 18), opt('Fitness', 26), opt('Winter', 14), opt('Triathlon', 9)], true), chk('Manufacturer', [opt('Garmin', 16), opt('Speedo', 11), opt('On', 14), opt('Wahoo', 9), opt('Salomon', 12)], true)],
    products: [{
      manufacturer: 'Garmin',
      name: 'Forerunner 965 — Running Watch',
      spec: 'AMOLED · maps',
      price: '649,00',
      badge: 'Bestseller'
    }, {
      manufacturer: 'Speedo',
      name: 'Fastskin Pure Focus — Goggles',
      spec: 'Mirror · racing',
      price: '39,95',
      oldPrice: '49,95',
      badge: '-20%'
    }, {
      manufacturer: 'On',
      name: 'Cloudmonster — Running Shoe',
      spec: 'Max cushion',
      price: '169,95'
    }, {
      manufacturer: 'Wahoo',
      name: 'KICKR Core — Smart Trainer',
      spec: 'Direct drive',
      price: '599,99',
      badge: 'New'
    }, {
      manufacturer: 'Salomon',
      name: 'S/Lab Trail 5 — Hydration Vest',
      spec: 'Race fit · 5L',
      price: '139,95'
    }, {
      manufacturer: 'Arena',
      name: 'Powerskin Carbon — Race Suit',
      spec: 'FINA approved',
      price: '289,00'
    }]
  }, {
    id: 'brands',
    label: 'Brands',
    leaf: 'All Brands',
    crumb: ['Brands'],
    mega: [[g('Popular', ['CUBE', 'Canyon', 'Trek', 'Specialized', 'Giant'])], [g('Components', ['Shimano', 'SRAM', 'DT Swiss', 'Fox', 'RockShox'])], [g('Apparel', ['Castelli', 'GORE', 'Endura', 'Assos', 'Maloja'])], [g('Browse', ['A – E', 'F – J', 'K – O', 'P – T', 'U – Z', 'All Brands'])]],
    facets: [range('749', '4799'), toggles([{
      label: 'Sale %',
      count: 18,
      sale: true
    }, {
      label: 'In stock',
      count: 132
    }]), chk('Category', [opt('Bikes', 64), opt('Parts', 88), opt('Clothing', 52), opt('Accessories', 47)], true), chk('First Letter', [opt('A – E', 24), opt('F – J', 18), opt('K – O', 21), opt('P – T', 29), opt('U – Z', 14)]), chk('Manufacturer', [opt('CUBE', 24), opt('Canyon', 16), opt('Trek', 19), opt('Specialized', 22), opt('Giant', 17)], true)],
    products: [{
      manufacturer: 'CUBE',
      name: 'Stereo One77 — Trail Full Suspension',
      spec: '2026 · carbon',
      price: '4.299,00',
      badge: 'Bestseller'
    }, {
      manufacturer: 'Canyon',
      name: 'Ultimate CF SLX 8 — Road Bike',
      spec: '2026 · Di2',
      price: '4.799,00',
      badge: 'New'
    }, {
      manufacturer: 'Trek',
      name: 'Marlin 7 Gen 3 — Hardtail',
      spec: '2026 · matte black',
      price: '949,00',
      oldPrice: '1.049,00',
      badge: '-10%'
    }, {
      manufacturer: 'Specialized',
      name: 'Rockhopper Comp — 29" MTB',
      spec: '2026 · satin red',
      price: '899,00'
    }, {
      manufacturer: 'Giant',
      name: 'Talon 1 — 29" Hardtail',
      spec: '2026 · blue',
      price: '799,00'
    }, {
      manufacturer: 'SCOTT',
      name: 'Aspect 940 — 29" Mountain Bike',
      spec: '2026 · grey',
      price: '749,00'
    }]
  }, {
    id: 'sale',
    label: 'SALE %',
    accent: true,
    leaf: 'Bikes on Sale',
    crumb: ['Sale'],
    mega: [[g('Bikes on Sale', ['Mountain Bikes', 'E-Bikes', 'Road & Gravel', "Kids' Bikes"])], [g('Parts on Sale', ['Drivetrain', 'Brakes', 'Wheels', 'Cockpit'])], [g('Clothing on Sale', ['Jerseys', 'Jackets', 'Shorts', 'Shoes'])], [g('Accessories on Sale', ['Lights', 'Locks', 'Bags', 'Electronics'])]],
    facets: [range('129', '1899'), toggles([{
      label: 'On sale only',
      count: 248,
      sale: true
    }, {
      label: 'In stock',
      count: 201
    }]), chk('Discount', [opt('-10% or more', 248), opt('-20% or more', 162), opt('-30% or more', 74), opt('-40% or more', 21)], true), chk('Category', [opt('Bikes', 48), opt('Parts', 96), opt('Clothing', 64), opt('Accessories', 40)]), chk('Manufacturer', [opt('CUBE', 14), opt('GORE', 11), opt('Shimano', 22), opt('Giro', 9), opt('Garmin', 12)], true)],
    products: [{
      manufacturer: 'CUBE',
      name: 'Attain GTC SLT — Road Bike',
      spec: '2025 · carbon',
      price: '1.899,00',
      oldPrice: '2.499,00',
      badge: '-24%',
      note: 'Sale ends Sunday'
    }, {
      manufacturer: 'GORE',
      name: 'C5 GTX — Trail Jacket',
      spec: "Men's · black",
      price: '149,99',
      oldPrice: '219,99',
      badge: '-32%',
      note: 'Sale ends Sunday'
    }, {
      manufacturer: 'Shimano',
      name: 'XT M8100 — Disc Brake Set',
      spec: '4-piston',
      price: '219,00',
      oldPrice: '289,00',
      badge: '-24%',
      note: 'Sale ends Sunday'
    }, {
      manufacturer: 'Giro',
      name: 'Aether MIPS — Road Helmet',
      spec: 'Spherical · matte',
      price: '179,95',
      oldPrice: '279,95',
      badge: '-36%',
      note: 'Sale ends Sunday'
    }, {
      manufacturer: 'Garmin',
      name: 'Edge 530 — GPS Computer',
      spec: 'ClimbPro',
      price: '199,00',
      oldPrice: '279,00',
      badge: '-28%',
      note: 'Sale ends Sunday'
    }, {
      manufacturer: 'Castelli',
      name: 'Perfetto RoS 2 — Jacket',
      spec: "Men's · blue",
      price: '129,95',
      oldPrice: '184,95',
      badge: '-30%',
      note: 'Sale ends Sunday'
    }]
  }];
  var map = {};
  categories.forEach(function (c) {
    map[c.id] = c;
  });
  window.STORE = {
    categories: categories,
    map: map,
    HEX: HEX
  };
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "store-data.js", error: String((e && e.message) || e) }); }

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.ColorSwatch = __ds_scope.ColorSwatch;

__ds_ns.FilterGroup = __ds_scope.FilterGroup;

__ds_ns.ProductCard = __ds_scope.ProductCard;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.SearchInput = __ds_scope.SearchInput;

})();
