The signature ARMOR BIKE catalog tile. Compose grids of these.

```jsx
<ProductCard
  manufacturer="CUBE"
  name="Elite 240 C:62 Pro — 24″ Carbon Children's"
  spec="Mountainbike · 2026 · carbon / blue / red"
  price="1.427,73"
  note="Not shippable to Taiwan"
  image="/assets/bike.png"
/>
```

Media area is a light gray square; product images sit on it with `mix-blend: multiply`. Manufacturer is an uppercase eyebrow; price uses the display font in bold. Pass `oldPrice` + `badge="-20%"` for sale tiles (price turns magenta). The whole card lifts on hover.
