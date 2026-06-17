import * as React from 'react';

export interface ButtonProps {
  children?: React.ReactNode;
  /** Visual style. @default "primary" */
  variant?: 'primary' | 'accent' | 'sale' | 'secondary' | 'ghost';
  /** @default "md" */
  size?: 'sm' | 'md' | 'lg';
  /** Stretch to fill the container width. @default false */
  block?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

/**
 * Primary action button for the ARMOR BIKE storefront.
 * @startingPoint section="Forms" subtitle="Primary / accent / sale / outline buttons" viewport="700x150"
 */
export function Button(props: ButtonProps): JSX.Element;
