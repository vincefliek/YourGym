import {
  DndContext,
  PointerSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';

import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import type { DndListProps, ListItem } from './types';
import style from './style.module.scss';

export function DndList<T extends ListItem>({
  data,
  ItemsWrapper = ({ children }) => <>{children}</>,
  onReorder,
  renderItem,
}: DndListProps<T>) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 200, // long press before drag starts
        tolerance: 5,
      },
    }),
    // ✅ iOS / Android touch support
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200, // long press before drag starts
        tolerance: 5,
      },
    }),
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={() => document.body.classList.add(style.dragging)}
      onDragEnd={({ active, over }) => {
        document.body.classList.remove(style.dragging);

        if (!over || active.id === over.id) return;

        const oldIndex = data.findIndex((x) => x.id === active.id);
        const newIndex = data.findIndex((x) => x.id === over.id);

        const newData = arrayMove(data, oldIndex, newIndex);

        onReorder({
          active: data[oldIndex],
          oldIndex,
          newIndex,
          newData,
        });
      }}
    >
      <SortableContext items={data} strategy={verticalListSortingStrategy}>
        <ItemsWrapper>
          {data.map((item) => (
            <SortableItem key={item.id} id={item.id}>
              {renderItem(item)}
            </SortableItem>
          ))}
        </ItemsWrapper>
      </SortableContext>
    </DndContext>
  );
}

function SortableItem({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const { setNodeRef, attributes, listeners, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
}
