import React, { useState } from 'react';
import { Combobox, InputBase, useCombobox } from '@mantine/core';
import groupBy from 'lodash/groupBy';

import { AutocompleteProps } from './types';
import style from './style.module.scss';

export const Autocomplete: React.FC<AutocompleteProps> = ({
  initialValue,
  onSelectOption,
  onCreateOption,
  options,
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
    <Combobox.Group key={group} label={group}>
      {items.map((item) => (
        <Combobox.Option value={item.value} key={item.value}>
          {item.label}
        </Combobox.Option>
      ))}
    </Combobox.Group>
  ));

  return (
    <Combobox
      store={combobox}
      withinPortal={false}
      onOptionSubmit={(val) => {
        if (val === '$create') {
          onCreateOption(search);
        } else {
          const label = options.find((item) => item.value === val)?.label;
          if (label) {
            setSearch(label);
            onSelectOption(val);
          }
        }

        combobox.closeDropdown();
      }}
    >
      <Combobox.Target>
        <InputBase
          className={style.input}
          leftSection={<Combobox.ClearButton onClear={() => setSearch('')} />}
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

      <Combobox.Dropdown>
        <Combobox.Options>
          {dropdownOptions}
          {!exactOptionMatch && search.trim().length > 0 && (
            <Combobox.Option value="$create">
              + Create: "{search}"
            </Combobox.Option>
          )}
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
};
