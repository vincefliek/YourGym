import React, { useState } from 'react';
import { Combobox, InputBase, useCombobox } from '@mantine/core';
import groupBy from 'lodash/groupBy';

import { AutocompleteProps } from './types';
import style from './style.module.scss';

export const Autocomplete: React.FC<AutocompleteProps> = ({
  initialValue,
  options,
  onSelectOption,
  onCreateOption,
  onClearSelection,
}) => {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const [search, setSearch] = useState(initialValue || '');

  const exactOptionMatch = options.some((item) => item.label === search);
  const filteredOptions = exactOptionMatch
    ? options
    : options.filter((item) =>
        item.label.toLowerCase().includes(search.toLowerCase().trim()),
      );

  const grouped = groupBy(filteredOptions, (it) => it.group);
  const dropdownOptions = Object.entries(grouped).map(([group, items]) => (
    <Combobox.Group
      data-testid="autocomplete-option-group"
      key={group}
      label={group}
    >
      {items.map((item) => (
        <Combobox.Option
          data-testid="autocomplete-option"
          value={item.value}
          key={item.value}
        >
          {item.label}
        </Combobox.Option>
      ))}
    </Combobox.Group>
  ));

  const onClearBtn = () => {
    setSearch('');
    onClearSelection?.();
  };

  return (
    <Combobox
      store={combobox}
      withinPortal={false}
      onOptionSubmit={(val) => {
        if (val === '$create') {
          onCreateOption?.(search);
        } else {
          const label = options.find((item) => item.value === val)?.label;
          if (label) {
            setSearch(label);
            onSelectOption(val);
          }
        }

        combobox.closeDropdown();
      }}
      classNames={{
        dropdown: style.dropdown,
      }}
    >
      <Combobox.Target>
        <InputBase
          data-testid="autocomplete-input"
          className={style.input}
          leftSection={<Combobox.ClearButton onClear={onClearBtn} />}
          rightSection={<Combobox.Chevron />}
          value={search}
          onChange={(event) => {
            combobox.openDropdown();
            combobox.updateSelectedOptionIndex();
            setSearch(event.currentTarget.value);
          }}
          onClick={() => combobox.openDropdown()}
          onFocus={() => combobox.openDropdown()}
          onBlur={() => {
            combobox.closeDropdown();
          }}
          placeholder="Search value"
          rightSectionPointerEvents="none"
        />
      </Combobox.Target>

      <Combobox.Dropdown data-testid="autocomplete-dropdown">
        <Combobox.Options>
          {dropdownOptions}
          {!exactOptionMatch && search.trim().length > 0 && (
            <Combobox.Option
              data-testid="autocomplete-option-create"
              key="create-option"
              value="$create"
            >
              + Create: "{search}"
            </Combobox.Option>
          )}
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
};
