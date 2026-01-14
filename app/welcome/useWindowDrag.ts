import { useState, useEffect, useCallback, useRef } from "react";

const TASKBAR_HEIGHT = 30;
const SNAPPING_ZONE_RATIO = 0.1;

interface UseWindowDragParams {
  x: number;
  y: number;
  width: number;
  height: number;
  setX: (x: number) => void;
  setY: (y: number) => void;
  setWidth: (width: number) => void;
  setHeight: (height: number) => void;
  setIsSnappingWindow: (snapping: boolean) => void;
}

export function useWindowDrag(params: UseWindowDragParams) {
  const {
    x,
    y,
    width,
    height,
    setX,
    setY,
    setWidth,
    setHeight,
    setIsSnappingWindow,
  } = params;

  const [isDragging, setIsDragging] = useState(false);
  const lastMousePos = useRef({ x: 0, y: 0 });

  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      // Only drag if left clicking the header (not buttons)
      if (e.button !== 0) return;

      // Check if target is a button or inside a button
      if ((e.target as HTMLElement).closest("button")) return;

      setIsDragging(true);
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      lastMousePos.current = { x: mouseX, y: mouseY };
    },
    []
  );

  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;

      const deltaX = e.clientX - lastMousePos.current.x;
      const deltaY = e.clientY - lastMousePos.current.y;
      const mouseX = e.clientX;
      lastMousePos.current = { x: e.clientX, y: e.clientY };

      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // Calculate safe boundaries
      const minX = 0;
      const minY = 0;
      const maxX = viewportWidth - width;
      const maxY = viewportHeight - height - TASKBAR_HEIGHT;

      // Define how far the window can go past the edge before hard stopping or heavy damping
      const OVERSHOOT_THRESHOLD = 300;

      // Use current window position as base
      const currentX = x;
      const currentY = y;

      const proposedX = currentX + deltaX;
      const proposedY = currentY + deltaY;

      const snappingZone = viewportWidth * SNAPPING_ZONE_RATIO;

      if (mouseX < snappingZone) {
        setIsSnappingWindow(true);
      } else if (mouseX > viewportWidth - snappingZone) {
        setIsSnappingWindow(true);
      } else {
        setIsSnappingWindow(false);
      }

      // X Damping Calculation
      let dampingX = 1.0;
      /*
        If we are past the Left Edge (proposedX < 0):
          We want to allow movement up to -OVERSHOOT_THRESHOLD.
          As we get closer to -OVERSHOOT_THRESHOLD, resistance increases.
      */
      if (proposedX < 0) {
        // If trying to move further left (deltaX < 0)
        if (deltaX < 0) {
           // Calculate distance from the "hard stop" (-OVERSHOOT_THRESHOLD)
           // distance goes from OVERSHOOT_THRESHOLD -> 0
           const dist = proposedX - (-OVERSHOOT_THRESHOLD);
           dampingX = Math.max(0, dist / OVERSHOOT_THRESHOLD);
        }
      } 
      /*
        If we are past the Right Edge (proposedX > maxX):
          We want to allow movement up to maxX + OVERSHOOT_THRESHOLD.
      */
      else if (proposedX > maxX) {
        // If trying to move further right (deltaX > 0)
        if (deltaX > 0) {
           const dist = (maxX + OVERSHOOT_THRESHOLD) - proposedX;
           dampingX = Math.max(0, dist / OVERSHOOT_THRESHOLD);
        }
      }

      // Y Damping Calculation
      let dampingY = 1.0;
      if (proposedY < 0) {
         if (deltaY < 0) {
           const dist = proposedY - (-OVERSHOOT_THRESHOLD);
           dampingY = Math.max(0, dist / OVERSHOOT_THRESHOLD);
         }
      } else if (proposedY > maxY) {
         if (deltaY > 0) {
           const dist = (maxY + OVERSHOOT_THRESHOLD) - proposedY;
           dampingY = Math.max(0, dist / OVERSHOOT_THRESHOLD);
         }
      }

      const dampedDeltaX = deltaX * dampingX;
      const dampedDeltaY = deltaY * dampingY;

      let newX = currentX + dampedDeltaX;
      let newY = currentY + dampedDeltaY;

      // Final hard clamp just to prevent completely losing the window
      // (It allows it to go OVERSHOOT_THRESHOLD pixels past the edge)
      newX = Math.max(minX - OVERSHOOT_THRESHOLD, Math.min(newX, maxX + OVERSHOOT_THRESHOLD));
      newY = Math.max(minY - OVERSHOOT_THRESHOLD, Math.min(newY, maxY + OVERSHOOT_THRESHOLD));

      setX(newX);
      setY(newY);
    },
    [isDragging, x, y, width, height, setX, setY, setIsSnappingWindow]
  );

  const onMouseUp = useCallback(
    (e: MouseEvent) => {
      setIsDragging(false);
      setIsSnappingWindow(false);

      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const snappingZone = viewportWidth * SNAPPING_ZONE_RATIO;
      const mouseX = e.clientX;

      // Handle full-screen snapping
      if (mouseX < snappingZone) {
        setWidth(viewportWidth / 2);
        setHeight(viewportHeight - TASKBAR_HEIGHT);
        setX(0);
        setY(0);
        return;
      } else if (mouseX > viewportWidth - snappingZone) {
        setWidth(viewportWidth / 2);
        setHeight(viewportHeight - TASKBAR_HEIGHT);
        setX(viewportWidth / 2);
        setY(0);
        return;
      }

      // Handle "Snap Back" if window is out of bounds
      const minX = 0;
      const minY = 0;
      const maxX = viewportWidth - width;
      const maxY = viewportHeight - height - TASKBAR_HEIGHT;

      // Current position (captured in closure could be stale, but we use 'x' from dependency or just clamping logic)
      // Since 'x' and 'y' in dependency might be stale if strict mode,
      // it is safer to rely on the logic that runs in render or a functional update. 
      // However here we are calling setX/setY directly.
      // Let's check boundaries based on current 'x' and 'y'.
      
      let targetX = x;
      let targetY = y;
      
      let needsSnapBack = false;

      if (x < minX) {
        targetX = minX;
        needsSnapBack = true;
      } else if (x > maxX) {
        targetX = maxX;
        needsSnapBack = true;
      }

      if (y < minY) {
        targetY = minY;
        needsSnapBack = true;
      } else if (y > maxY) {
        targetY = maxY;
        needsSnapBack = true;
      }

      if (needsSnapBack) {
        setX(targetX);
        setY(targetY);
      }
    },
    [x, y, width, height, setX, setY, setWidth, setHeight, setIsSnappingWindow]
  );

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    } else {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [isDragging, onMouseMove, onMouseUp]);

  return {
    onMouseDown,
    isDragging,
  };
}
