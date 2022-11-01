/*
    Copyright (c) 2022 Skyflow, Inc.
*/
import { renderHook } from '@testing-library/react-native';
import useCollectContainer from '../../src/hooks/useCollectContainer';
import CollectContainer from '../../src/core/CollectContainer';

describe('test useRevealContainer hook', () => {
  it('should return reveal conatiner instance', () => {
    const { result } = renderHook(() => useCollectContainer());
    expect(result.current).toBeInstanceOf(CollectContainer);
  });
});
