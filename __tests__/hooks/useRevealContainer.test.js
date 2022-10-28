/*
    Copyright (c) 2022 Skyflow, Inc.
*/
import { renderHook } from '@testing-library/react-native';
import useRevealContainer from '../../src/hooks/useRevealContainer';
import RevealContainer from '../../src/core/RevealContainer';

describe('test useRevealContainer hook', () => {
  it('should return reveal conatiner instance', () => {
    const { result } = renderHook(() => useRevealContainer());
    expect(result.current).toBeInstanceOf(RevealContainer);
  });
});
