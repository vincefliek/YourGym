export interface ListItem {
  id: string;
  [key: string]: any;
}

export interface DndListProps<T extends ListItem> {
  data: T[];
  ItemsWrapper?: React.ComponentType<any>;
  onReorder: (params: {
    active: T;
    oldIndex: number;
    newIndex: number;
    newData: T[];
  }) => void;
  renderItem: (item: T) => React.ReactNode;
}
