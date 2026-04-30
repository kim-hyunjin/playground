import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useTradingData } from './useTradingData';

describe('useTradingData', () => {
  it('initializes with default data and settings', () => {
    const { result } = renderHook(() => useTradingData());
    
    expect(result.current.fullData).toHaveLength(100);
    expect(result.current.visibleCount).toBe(40);
    expect(result.current.viewOffset).toBe(60); // 100 - 40
    expect(result.current.isLoading.current).toBe(false);
  });

  it('updates visibleCount correctly', () => {
    const { result } = renderHook(() => useTradingData());
    
    act(() => {
      result.current.setVisibleCount(50);
    });
    
    expect(result.current.visibleCount).toBe(50);
  });

  it('loads more data and updates offset', async () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useTradingData());
    const initialLength = result.current.fullData.length;
    const initialOffset = result.current.viewOffset;

    act(() => {
      result.current.loadMoreData();
    });

    // isLoading should be true
    expect(result.current.isLoading.current).toBe(true);
    
    // fullData should have more items
    expect(result.current.fullData.length).toBeGreaterThan(initialLength);
    // viewOffset should have increased by the number of new unique items (30)
    expect(result.current.viewOffset).toBe(initialOffset + 30);

    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(result.current.isLoading.current).toBe(false);
    vi.useRealTimers();
  });
});
