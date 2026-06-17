import * as React from 'react';

export interface ColorSwatchProps {
  /** Single hex/CSS color, or an array of colors (rendered as a conic gradient). */
  color?: string | string[];
  /** Result count badge, bottom-right. */
  count?: number | string | null;
  selected?: boolean;
  onClick?: () => void;
  title?: string;
  style?: React.CSSProperties;
}

/** Round color facet chip with a count badge; arrays render a multi-color conic gradient. */
export function ColorSwatch(props: ColorSwatchProps): JSX.Element;
