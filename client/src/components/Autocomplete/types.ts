export interface AutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
  className?: string;
  'data-testid'?: string;
}
