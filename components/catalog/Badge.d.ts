import * as React from 'react';

export interface BadgeProps {
  children?: React.ReactNode;
  /** @default "sale" */
  variant?: 'sale' | 'accent' | 'info' | 'success' | 'neutral';
  style?: React.CSSProperties;
}

/** Small uppercase square label for sale flags, stock states and tags. */
export function Badge(props: BadgeProps): JSX.Element;
