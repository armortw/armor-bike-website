import * as React from 'react';

export interface ProductCardProps {
  /** Uppercase manufacturer eyebrow, e.g. "CUBE". */
  manufacturer: string;
  /** Product name / headline. */
  name: string;
  /** Muted spec line, e.g. "Mountainbike · 2026 · carbon / blue / red". */
  spec?: string;
  /** Formatted price string, e.g. "1.427,73". */
  price: string;
  /** Optional struck-through original price. */
  oldPrice?: string | null;
  /** @default "€" */
  currency?: string;
  /** Product image URL (rendered with multiply blend on the gray media area). */
  image?: string | null;
  /** Corner flag text, e.g. "-20%". */
  badge?: string | null;
  /** Small note under the price, e.g. "Not shippable to Taiwan". */
  note?: string | null;
  onClick?: () => void;
  style?: React.CSSProperties;
}

/**
 * Catalog grid tile — manufacturer, name, spec and price over a light media area.
 * @startingPoint section="Catalog" subtitle="Product grid tile" viewport="320x420"
 */
export function ProductCard(props: ProductCardProps): JSX.Element;
