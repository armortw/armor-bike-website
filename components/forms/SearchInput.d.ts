import * as React from 'react';

export interface SearchInputProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  /** @default "md" */
  size?: 'md' | 'lg';
  style?: React.CSSProperties;
}

/** Pill-shaped header search field with a leading magnifier icon. */
export function SearchInput(props: SearchInputProps): JSX.Element;
