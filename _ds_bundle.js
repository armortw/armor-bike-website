/* @ds-bundle: {"format":3,"namespace":"BIKE24DesignSystem_2233bc","components":[{"name":"Badge","sourcePath":"components/catalog/Badge.jsx"},{"name":"ColorSwatch","sourcePath":"components/catalog/ColorSwatch.jsx"},{"name":"FilterGroup","sourcePath":"components/catalog/FilterGroup.jsx"},{"name":"ProductCard","sourcePath":"components/catalog/ProductCard.jsx"},{"name":"Button","sourcePath":"components/forms/Button.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"SearchInput","sourcePath":"components/forms/SearchInput.jsx"}],"sourceHashes":{"components/catalog/Badge.jsx":"cca8ab99a076","components/catalog/ColorSwatch.jsx":"b0bfb92838e1","components/catalog/FilterGroup.jsx":"22679de1ddb1","components/catalog/ProductCard.jsx":"eee1634ecb33","components/forms/Button.jsx":"d1c79a90c631","components/forms/Checkbox.jsx":"bf5d1fc77b3c","components/forms/SearchInput.jsx":"284f23d75845","store-app.jsx":"2184ca8d4bf8","store-data.js":"f13daf3b556a"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.BIKE24DesignSystem_2233bc = window.BIKE24DesignSystem_2233bc || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/catalog/Badge.jsx
try { (() => {
/**
 * ARMOR BIKE Badge ??small square label. Used for sale flags, "New", stock states.
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
 * ARMOR BIKE ColorSwatch ??round color chip with a count badge, as used in the
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
 * ARMOR BIKE FilterGroup ??a collapsible facet section from the sidebar:
 * bold title, chevron toggle, and a body of options (checkboxes, swatches??.
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
 * ARMOR BIKE ProductCard ??the catalog grid tile: light-gray media area on top,
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
 * ARMOR BIKE Button ??square-cornered, bold-label action button.
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
 * ARMOR BIKE Checkbox ??the square filter checkbox used throughout the facet sidebar,
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
 * ARMOR BIKE SearchInput ??the pill-shaped search field from the header bar.
 * Renders a leading magnifier icon and rounded-pill container.
 */
function SearchInput({
  value,
  onChange,
  placeholder = 'Search for bikes, gear & clothing...',
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

Object.assign(__ds_ns, __ds_scope);
})();
