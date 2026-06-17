import * as React from 'react';

export interface CheckboxProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: React.ReactNode;
  /** Trailing result count shown muted on the right (filter facets). */
  count?: number | string | null;
  disabled?: boolean;
  style?: React.CSSProperties;
}

/** Square filter checkbox with optional trailing count badge. */
export function Checkbox(props: CheckboxProps): JSX.Element;
