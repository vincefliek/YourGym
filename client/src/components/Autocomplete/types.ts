export interface AutocompleteProps {
  initialValue: string;
  onSelectOption: (value: string) => void;
  onCreateOption: (label: string) => void;
  options: { label: string; value: string; group: string }[];
  className?: string;
  'data-testid'?: string;
}
