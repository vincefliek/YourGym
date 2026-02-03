export interface ListItem {
  id: string;
  [key: string]: any;
}

export interface DndListProps<T extends ListItem> {
  data: T[];
  containerClassName?: string;
  containerDataTestId?: string;
  animationClassNames?: {
    enter?: string;
    enterActive?: string;
    exit?: string;
    exitActive?: string;
  };
  onReorder: (params: {
    active: T;
    oldIndex: number;
    newIndex: number;
    newData: T[];
  }) => void;
  renderItem: (item: T, props: any) => React.ReactNode;
}
