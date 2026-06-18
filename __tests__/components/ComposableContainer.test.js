/*
    Copyright (c) 2022 Skyflow, Inc.
*/
import React from 'react';
import { render } from '@testing-library/react-native';
import { Text } from 'react-native';
import ComposableContainer from '../../src/components/ComposableContainer';
import CoreComposableContainer from '../../src/core/ComposableContainer';
import Skyflow from '../../src/core/Skyflow';

const testSkyflowClient = new Skyflow({
  vaultID: '1234',
  vaultURL: 'https://url.com',
  getBearerToken: () => Promise.resolve('valid_token'),
});

const makeContainer = (layout) =>
  new CoreComposableContainer(testSkyflowClient, {
    layout,
    styles: {},
    errorTextStyles: {},
  });

describe('ComposableContainer - children prop (React 19 compat)', () => {
  it('renders children matching layout', () => {
    const { getByText } = render(
      <ComposableContainer container={makeContainer([2])}>
        <Text>Child One</Text>
        <Text>Child Two</Text>
      </ComposableContainer>
    );
    expect(getByText('Child One')).toBeTruthy();
    expect(getByText('Child Two')).toBeTruthy();
  });

  it('renders children across multiple rows', () => {
    const { getByText } = render(
      <ComposableContainer container={makeContainer([1, 2])}>
        <Text>Row 1 Child</Text>
        <Text>Row 2 Child A</Text>
        <Text>Row 2 Child B</Text>
      </ComposableContainer>
    );
    expect(getByText('Row 1 Child')).toBeTruthy();
    expect(getByText('Row 2 Child A')).toBeTruthy();
    expect(getByText('Row 2 Child B')).toBeTruthy();
  });

  it('throws when child count does not match layout sum', () => {
    expect(() =>
      render(
        <ComposableContainer container={makeContainer([2])}>
          <Text>Only Child</Text>
        </ComposableContainer>
      )
    ).toThrow();
  });
});
