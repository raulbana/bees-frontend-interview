import { renderHook, act } from "@testing-library/react";
import { useAlert } from "../hooks/useAlert";

describe("useAlert Hook", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  test("initializes with default visibility from show prop", () => {
    const { result } = renderHook(() =>
      useAlert({
        type: "ERROR",
        position: "top-center",
        duration: 5000,
        show: true,
        onClose: undefined,
      })
    );

    expect(result.current.isVisible).toBe(true);
  });

  test("updates isVisible when show prop changes", () => {
    const { result, rerender } = renderHook(
      (props) =>
        useAlert({
          type: "ERROR",
          position: "top-center",
          duration: 5000,
          ...props,
        }),
      {
        initialProps: { show: true },
      }
    );

    expect(result.current.isVisible).toBe(true);

    rerender({ show: false });

    expect(result.current.isVisible).toBe(false);
  });

  test("auto-closes after duration", () => {
    const onClose = jest.fn();
    renderHook(() =>
      useAlert({
        type: "ERROR",
        position: "top-center",
        duration: 1000,
        show: true,
        onClose,
      })
    );

    expect(onClose).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test("does not auto-close if duration is 0", () => {
    const onClose = jest.fn();
    renderHook(() =>
      useAlert({
        type: "ERROR",
        position: "top-center",
        duration: 0,
        show: true,
        onClose,
      })
    );

    act(() => {
      jest.advanceTimersByTime(5000);
    });

    expect(onClose).not.toHaveBeenCalled();
  });

  test("calls onClose when handleClose is called", () => {
    const onClose = jest.fn();
    const { result } = renderHook(() =>
      useAlert({
        type: "ERROR",
        position: "top-center",
        duration: 5000,
        show: true,
        onClose,
      })
    );

    act(() => {
      result.current.handleClose();
    });

    expect(result.current.isVisible).toBe(false);

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test("returns correct type styles for different alert types", () => {
    const { result: errorResult } = renderHook(() =>
      useAlert({
        type: "ERROR",
        position: "top-center",
        duration: 5000,
        show: true,
      })
    );
    expect(errorResult.current.typeStyles).toBe(
      "bg-red-100 border-red-400 text-red-700"
    );

    const { result: successResult } = renderHook(() =>
      useAlert({
        type: "SUCCESS",
        position: "top-center",
        duration: 5000,
        show: true,
      })
    );
    expect(successResult.current.typeStyles).toBe(
      "bg-green-100 border-green-400 text-green-700"
    );

    const { result: warningResult } = renderHook(() =>
      useAlert({
        type: "WARNING",
        position: "top-center",
        duration: 5000,
        show: true,
      })
    );
    expect(warningResult.current.typeStyles).toBe(
      "bg-yellow-100 border-yellow-400 text-yellow-700"
    );

    const { result: infoResult } = renderHook(() =>
      useAlert({
        type: "INFO",
        position: "top-center",
        duration: 5000,
        show: true,
      })
    );
    expect(infoResult.current.typeStyles).toBe(
      "bg-blue-100 border-blue-400 text-blue-700"
    );
  });

  test("returns correct position styles for different positions", () => {
    const { result: topRightResult } = renderHook(() =>
      useAlert({
        type: "ERROR",
        position: "top-right",
        duration: 5000,
        show: true,
      })
    );
    expect(topRightResult.current.positionStyles).toBe("top-4 right-4");

    const { result: topLeftResult } = renderHook(() =>
      useAlert({
        type: "ERROR",
        position: "top-left",
        duration: 5000,
        show: true,
      })
    );
    expect(topLeftResult.current.positionStyles).toBe("top-4 left-4");

    const { result: bottomRightResult } = renderHook(() =>
      useAlert({
        type: "ERROR",
        position: "bottom-right",
        duration: 5000,
        show: true,
      })
    );
    expect(bottomRightResult.current.positionStyles).toBe("bottom-4 right-4");

    const { result: bottomLeftResult } = renderHook(() =>
      useAlert({
        type: "ERROR",
        position: "bottom-left",
        duration: 5000,
        show: true,
      })
    );
    expect(bottomLeftResult.current.positionStyles).toBe("bottom-4 left-4");

    const { result: topCenterResult } = renderHook(() =>
      useAlert({
        type: "ERROR",
        position: "top-center",
        duration: 5000,
        show: true,
      })
    );
    expect(topCenterResult.current.positionStyles).toBe(
      "top-4 left-1/2 -translate-x-1/2"
    );

    const { result: bottomCenterResult } = renderHook(() =>
      useAlert({
        type: "ERROR",
        position: "bottom-center",
        duration: 5000,
        show: true,
      })
    );
    expect(bottomCenterResult.current.positionStyles).toBe(
      "bottom-4 left-1/2 -translate-x-1/2"
    );
  });

  test("uses default styles when invalid values are provided", () => {
    const { result } = renderHook(() =>
      useAlert({
        type: "INVALID_TYPE" as any,
        position: "INVALID_POSITION",
        duration: 5000,
        show: true,
      })
    );

    expect(result.current.typeStyles).toBe(
      "bg-red-100 border-red-400 text-red-700"
    );
    expect(result.current.positionStyles).toBe("top-4 right-4");
  });

  test("cleans up timeouts on unmount", () => {
    const clearTimeoutSpy = jest.spyOn(global, "clearTimeout");
    const { unmount } = renderHook(() =>
      useAlert({
        type: "ERROR",
        position: "top-center",
        duration: 5000,
        show: true,
        onClose: jest.fn(),
      })
    );

    act(() => {
      unmount();
    });

    expect(clearTimeoutSpy).toHaveBeenCalled();
  });
});
