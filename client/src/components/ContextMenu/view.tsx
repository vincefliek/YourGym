import { Menu } from '@mantine/core';
import type { OverlayProps } from '@mantine/core';
import { IconDots } from '@tabler/icons-react';

import { Button } from '..';
import styles from './style.module.scss';

export interface MenuItem {
  label: string;
  onClick: () => void;
}

export interface ContextMenuProps {
  items: MenuItem[];
  overlayProps?: Omit<OverlayProps, 'children'>;
  triggerButtonClassName?: string;
}

export const ContextMenu = ({
  items,
  overlayProps,
  triggerButtonClassName,
}: ContextMenuProps) => {
  const defaultOverlayProps: OverlayProps = {
    color: '#929191',
    blur: 3,
  };
  return (
    <Menu
      trigger="click"
      position="bottom-end"
      classNames={{
        dropdown: styles.dropdown,
      }}
      withArrow
      withOverlay
      overlayProps={{
        ...defaultOverlayProps,
        ...overlayProps,
      }}
    >
      <Menu.Target>
        <Button skin="icon" size="medium" className={triggerButtonClassName}>
          <IconDots size={16} />
        </Button>
      </Menu.Target>
      <Menu.Dropdown>
        {items.map((item) => (
          <Menu.Item key={item.label} onClick={item.onClick}>
            {item.label}
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
};
