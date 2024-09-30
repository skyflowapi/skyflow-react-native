import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Dropdown from '../../src/core/Dropdown';

describe('Verify dropdown component', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  it('should test the dropdown by selecting list item', () => {
    const dropdown = render(
      <Dropdown
        setSelectedValue={() => {}}
        listData={[{ label: 'test', value: 'test' }]}
      />
    );
    const cardIcon = dropdown.getByTestId('dropdown-icon')
    fireEvent.press(cardIcon)
    const listItem = dropdown.getByTestId('list-item');
    fireEvent.press(listItem);
  });

  it('should test the dropdown by opening and closing', () => {
    const dropdown = render(
      <Dropdown
        setSelectedValue={() => {}}
        listData={[{ label: 'test', value: 'test' }]}
      />
    );
    const cardIcon = dropdown.getByTestId('dropdown-icon')
    fireEvent.press(cardIcon)
    const modalClose = dropdown.getByTestId('modal-close');
    fireEvent.press(modalClose);
    const modal = dropdown.getByTestId('modal');
    fireEvent.press(modal);
  });
});
