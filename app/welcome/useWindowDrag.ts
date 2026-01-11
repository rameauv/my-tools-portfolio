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

      // Calculate incremental mouse movement delta from last position
      // This ensures smooth movement even when damping is applied
      const deltaX = e.clientX - lastMousePos.current.x;
      const deltaY = e.clientY - lastMousePos.current.y;
      const mouseX = e.clientX;
      // Update last mouse position for next event
      lastMousePos.current = { x: e.clientX, y: e.clientY };

      // Get viewport dimensions
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // Calculate boundaries to keep window fully inside viewport
      const minX = 0;
      const minY = 0;
      const maxX = viewportWidth - width;
      const maxY = viewportHeight - height - TASKBAR_HEIGHT;

      // Use current window position as base
      const currentX = x;
      const currentY = y;

      // Calculate proposed new position from current position
      const proposedX = currentX + deltaX;
      const proposedY = currentY + deltaY;

      // Define resistance zone size (pixels from edge where speed reduction starts)
      const resistanceZone = 50;

      const snappingZone = viewportWidth * SNAPPING_ZONE_RATIO;

      if (mouseX < snappingZone) {
        setIsSnappingWindow(true);
      } else if (mouseX > viewportWidth - snappingZone) {
        setIsSnappingWindow(true);
      } else {
        setIsSnappingWindow(false);
      }

      // Calculate damping factors for X axis (0 = fully damped, 1 = no damping)
      // Use proposed position to check proximity to edges
      let dampingX = 1.0;
      if (deltaX < 0 && proposedX < resistanceZone) {
        // Moving left, approaching left edge
        dampingX = Math.max(0, proposedX / resistanceZone);
      } else if (deltaX > 0 && proposedX > maxX - resistanceZone) {
        // Moving right, approaching right edge
        dampingX = Math.max(0, (maxX - proposedX) / resistanceZone);
      }

      // Calculate damping factors for Y axis
      let dampingY = 1.0;
      if (deltaY < 0 && proposedY < resistanceZone) {
        // Moving up, approaching top edge
        dampingY = Math.max(0, proposedY / resistanceZone);
      } else if (deltaY > 0 && proposedY > maxY - resistanceZone) {
        // Moving down, approaching bottom edge
        dampingY = Math.max(0, (maxY - proposedY) / resistanceZone);
      }

      // Apply damping to deltas (damping only reduces magnitude, never reverses direction)
      const dampedDeltaX = deltaX * dampingX;
      const dampedDeltaY = deltaY * dampingY;

      // Calculate final position from current position with damped movement
      let newX = currentX + dampedDeltaX;
      let newY = currentY + dampedDeltaY;

      // Clamp position to boundaries to ensure window stays fully inside
      newX = Math.max(minX, Math.min(newX, maxX));
      newY = Math.max(minY, Math.min(newY, maxY));

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
      if (mouseX < snappingZone) {
        setWidth(viewportWidth / 2);
        setHeight(viewportHeight - TASKBAR_HEIGHT);
        setX(0);
        setY(0);
      } else if (mouseX > viewportWidth - snappingZone) {
        setWidth(viewportWidth / 2);
        setHeight(viewportHeight - TASKBAR_HEIGHT);
        setX(viewportWidth / 2);
        setY(0);
      }
    },
    [setX, setY, setWidth, setHeight, setIsSnappingWindow]
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
