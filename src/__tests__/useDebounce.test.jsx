import { renderHook, act } from "@testing-library/react";
import { useDebounce } from "../hooks/useDebounce";

describe("useDebounce", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  test("returns the initial value immediately", () => {
    const { result } = renderHook(() => useDebounce("hello", 300));

    expect(result.current).toBe("hello");
  });

  test("updates the value after the delay", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      {
        initialProps: { value: "hello" },
      },
    );

    expect(result.current).toBe("hello");

    rerender({ value: "world" });

    expect(result.current).toBe("hello");

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(result.current).toBe("world");
  });

  test("clears the previous timeout when value changes again quickly", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      {
        initialProps: { value: "a" },
      },
    );

    rerender({ value: "b" });
    rerender({ value: "c" });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(result.current).toBe("c");
  });
});