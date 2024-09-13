/*
    Copyright (c) 2022 Skyflow, Inc.
*/
import { renderHook } from '@testing-library/react-native';
import useUpdateElement from '../../src/hooks/useUpdateElement';

describe('test useUpdateElement hook', () => {
  it('should return reveal conatiner instance', () => {
    const { result } = renderHook(() => useUpdateElement());
  });
});
