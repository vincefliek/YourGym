export interface AutocompleteProps {
  initialValue: string;
  options: { label: string; value: string; group: string }[];
  className?: string;
  onSelectOption: (value: string) => void;
  onCreateOption?: (label: string) => void;
  onClearSelection?: () => void;
}
