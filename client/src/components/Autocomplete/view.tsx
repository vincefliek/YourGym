import React, { useState } from 'react';
import { Combobox, InputBase, useCombobox } from '@mantine/core';
import { v4 as uuidv4 } from 'uuid';

import { AutocompleteProps } from './types';
import style from './style.module.scss';

export const Autocomplete: React.FC<AutocompleteProps> = ({
  // value,
  // onChange,
  options,
  // className,
  // ...props
}) => {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const [data, setData] = useState(options);
  const [localValue, setValue] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const exactOptionMatch = data.some((item) => item.label === search);
  const filteredOptions = exactOptionMatch
    ? data
    : data.filter((item) =>
        item.label.toLowerCase().includes(search.toLowerCase().trim()),
      );

  const dropdownOptions = filteredOptions.map((item) => (
    <Combobox.Option value={item.value} key={item.value}>
      {item.label}
    </Combobox.Option>
  ));

  // const handleChange = useCallback(
  //   (event: React.ChangeEvent<HTMLSelectElement>) => {
  //     onChange(event.target.value);
  //   },
  //   [onChange],
  // );

  return (
    <Combobox
      store={combobox}
      withinPortal={false}
      onOptionSubmit={(val) => {
        if (val === '$create') {
          const value = uuidv4();
          setData((current) => [...current, { value, label: search }]);
          setValue(value);
        } else {
          const label = data.find((item) => item.value === val)?.label;
          if (label) {
            setValue(val);
            setSearch(label);
          }
        }

        combobox.closeDropdown();
      }}
    >
      <Combobox.Target>
        <InputBase
          className={style.input}
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
            const label = data.find((item) => item.value === localValue)?.label;
            setSearch(label || '');
          }}
          placeholder="Search value"
          rightSectionPointerEvents="none"
        />
      </Combobox.Target>

      <Combobox.Dropdown>
        <Combobox.Options>
          {dropdownOptions}
          {!exactOptionMatch && search.trim().length > 0 && (
            <Combobox.Option value="$create">+ Create {search}</Combobox.Option>
          )}
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
};
