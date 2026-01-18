import React, { useState } from 'react';
import { Combobox, InputBase, useCombobox } from '@mantine/core';
import { v4 as uuidv4 } from 'uuid';
// import classnames from 'classnames';

import { AutocompleteProps } from './types';
// import style from './style.module.scss';

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
        item.value.toLowerCase().includes(search.toLowerCase().trim()),
      );

  const dropdownOptions = filteredOptions.map((item) => (
    <Combobox.Option value={item.value} key={item.value}>
      {item.label}
    </Combobox.Option>
  ));

  return (
    <Combobox
      store={combobox}
      withinPortal={false}
      onOptionSubmit={(val) => {
        if (val === '$create') {
          setData((current) => [
            ...current,
            { value: uuidv4(), label: search },
          ]);
          setValue(search);
        } else {
          const label = data.find((item) => item.value === val)?.label;
          if (label) {
            setValue(label);
            setSearch(label);
          }
        }

        combobox.closeDropdown();
      }}
    >
      <Combobox.Target>
        <InputBase
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
            setSearch(localValue || '');
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

// export const Autocomplete: React.FC<AutocompleteProps> = ({
//   value,
//   onChange,
//   options,
//   className,
//   ...props
// }) => {
//   const handleChange = useCallback(
//     (event: React.ChangeEvent<HTMLSelectElement>) => {
//       onChange(event.target.value);
//     },
//     [onChange],
//   );

//   return (
//     <select
//       className={classnames(style.select, className)}
//       value={value}
//       onChange={handleChange}
//       {...props}
//     >
//       {options.map((option) => (
//         <option key={option.value} value={option.value}>
//           {option.label}
//         </option>
//       ))}
//     </select>
//   );
// };
