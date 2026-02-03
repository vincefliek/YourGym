import {
  DndContext,
  PointerSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
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
  containerClassName,
  containerDataTestId,
  animationClassNames,
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

  const isAnimated = Boolean(animationClassNames);
  const containerCommonProps = {
    className: containerClassName,
    'data-testid': containerDataTestId,
  };

  const renderedItems = data.map((item) => {
    if (isAnimated) {
      return (
        <CSSTransition
          key={item.id}
          timeout={250}
          classNames={{
            enter: animationClassNames?.enter,
            enterActive: animationClassNames?.enterActive,
            exit: animationClassNames?.exit,
            exitActive: animationClassNames?.exitActive,
          }}
        >
          <SortableItem id={item.id}>
            {(props) => renderItem(item, props)}
          </SortableItem>
        </CSSTransition>
      );
    }
    return (
      <SortableItem key={item.id} id={item.id}>
        {(props) => renderItem(item, props)}
      </SortableItem>
    );
  });

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
        {isAnimated ? (
          <TransitionGroup component={'ul'} {...containerCommonProps}>
            {renderedItems}
          </TransitionGroup>
        ) : (
          <ul {...containerCommonProps}>{renderedItems}</ul>
        )}
      </SortableContext>
    </DndContext>
  );
}

function SortableItem({
  id,
  children,
}: {
  id: string;
  children: (props: any) => React.ReactNode;
}) {
  const { setNodeRef, attributes, listeners, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return children({ ref: setNodeRef, style, ...attributes, ...listeners });
}
