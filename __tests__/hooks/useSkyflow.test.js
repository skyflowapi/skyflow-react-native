import { renderHook } from '@testing-library/react-native';
import useSkyflow from '../../src/hooks/useSkyflow';
import SkyflowContainer from '../../src/core/SkyflowContainer';

describe('test useSkyflow hook', () => {
  it('should return SkyflowContainer instance with pure methods', () => {
    const { result } = renderHook(() => useSkyflow());
    expect(result.current).toBeInstanceOf(SkyflowContainer);
  });
});
