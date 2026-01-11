import { Dialog } from "@base-ui/react";
import * as React from "react";
import { useState, useEffect, useCallback, useRef } from "react";
import { useWindowContext } from "./WindowContext";

const MIN_WIDTH = 200;
const MIN_HEIGHT = 150;
const TASKBAR_HEIGHT = 30;
const SNAPPING_ZONE_RATIO = 0.1;

export function Window(props: {
  children: React.ReactNode;
  title?: string;
  onClose?: () => void;
  defaultWidth?: number;
  defaultHeight?: number;
}) {
  const open = true;
  const [x, setX] = useState(100);
  const [y, setY] = useState(100);
  const [width, setWidth] = useState(props.defaultWidth ?? 200);
  const [height, setHeight] = useState(props.defaultHeight ?? 200);
  function onOpenChange(open: boolean) {
    if (!open) {
      props.onClose?.();
    }
  }
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange} modal={false}>
      <Dialog.Portal>
        <Dialog.Popup
          className="fixed bg-[#ece9d8] border-2 border-[#0054e3] shadow-xl z-50 overflow-hidden rounded-t-lg"
          style={{
            top: 0,
            left: 0,
            transform: `translate(${x}px, ${y}px)`,
            width: width,
            height: height,
          }}
        >
          <WindowContent
            title={props.title}
            onClose={props.onClose}
            x={x}
            y={y}
            setX={setX}
            setY={setY}
            width={width}
            height={height}
            setWidth={setWidth}
            setHeight={setHeight}
          >
            {props.children}
          </WindowContent>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function WindowContent(props: {
  children: React.ReactNode;
  title?: string;
  onClose?: () => void;
  x: number;
  y: number;
  setX: (x: number) => void;
  setY: (y: number) => void;
  width: number;
  height: number;
  setWidth: (width: number) => void;
  setHeight: (height: number) => void;
}) {
  const { setWidth, setHeight, setX, setY } = props;
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState<string | null>(null);
  const resizeStart = useRef({
    x: 0,
    y: 0,
    winX: 0,
    winY: 0,
    winWidth: 0,
    winHeight: 0,
  });
  const currentDimensions = useRef({
    width: props.width,
    height: props.height,
    x: props.x,
    y: props.y,
  });
  const lastMousePos = useRef({ x: 0, y: 0 });

  // Keep currentDimensions ref in sync with props
  useEffect(() => {
    currentDimensions.current = {
      width: props.width,
      height: props.height,
      x: props.x,
      y: props.y,
    };
  }, [props.width, props.height, props.x, props.y]);

  const onResizeMouseDown = useCallback(
    (e: React.MouseEvent, direction: string) => {
      if (e.button !== 0) return;
      e.stopPropagation(); // Prevent triggering drag

      setIsResizing(true);
      setResizeDirection(direction);
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      resizeStart.current = {
        x: mouseX,
        y: mouseY,
        winX: currentDimensions.current.x,
        winY: currentDimensions.current.y,
        winWidth: currentDimensions.current.width,
        winHeight: currentDimensions.current.height,
      };
      lastMousePos.current = { x: mouseX, y: mouseY };
    },
    []
  );

  const onResizeMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isResizing || !resizeDirection) return;

      const deltaX = e.clientX - lastMousePos.current.x;
      const deltaY = e.clientY - lastMousePos.current.y;
      lastMousePos.current = { x: e.clientX, y: e.clientY };

      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // Use current dimensions as base (from ref, which is always up-to-date)
      let newWidth = currentDimensions.current.width;
      let newHeight = currentDimensions.current.height;
      let newX = currentDimensions.current.x;
      let newY = currentDimensions.current.y;

      // Calculate new dimensions based on resize direction
      if (resizeDirection.includes("e")) {
        // Right edge or corners
        const proposedWidth = newWidth + deltaX;
        const maxWidth = viewportWidth - newX;
        newWidth = Math.max(MIN_WIDTH, Math.min(proposedWidth, maxWidth));
      }
      if (resizeDirection.includes("w")) {
        // Left edge or corners
        const deltaWidth = -deltaX;
        const proposedWidth = newWidth + deltaWidth;
        const minX = 0;
        const maxWidth = newX + newWidth - minX;
        const constrainedWidth = Math.max(
          MIN_WIDTH,
          Math.min(proposedWidth, maxWidth)
        );
        const actualDeltaWidth = constrainedWidth - newWidth;
        newWidth = constrainedWidth;
        newX = newX - actualDeltaWidth;
      }
      if (resizeDirection.includes("s")) {
        // Bottom edge or corners
        const proposedHeight = newHeight + deltaY;
        const maxHeight = viewportHeight - newY - TASKBAR_HEIGHT;
        newHeight = Math.max(MIN_HEIGHT, Math.min(proposedHeight, maxHeight));
      }
      if (resizeDirection.includes("n")) {
        // Top edge or corners
        const deltaHeight = -deltaY;
        const proposedHeight = newHeight + deltaHeight;
        const minY = 0;
        const maxHeight = newY + newHeight - minY;
        const constrainedHeight = Math.max(
          MIN_HEIGHT,
          Math.min(proposedHeight, maxHeight)
        );
        const actualDeltaHeight = constrainedHeight - newHeight;
        newHeight = constrainedHeight;
        newY = newY - actualDeltaHeight;
      }

      // Ensure window stays within viewport bounds
      const minX = 0;
      const minY = 0;
      const maxX = viewportWidth - newWidth;
      const maxY = viewportHeight - newHeight - TASKBAR_HEIGHT;

      // Clamp position based on resize direction
      if (resizeDirection.includes("w")) {
        newX = Math.max(minX, Math.min(newX, maxX));
      } else {
        // For right-side resizing, ensure window doesn't go out of bounds
        newX = Math.max(minX, Math.min(currentDimensions.current.x, maxX));
      }

      if (resizeDirection.includes("n")) {
        newY = Math.max(minY, Math.min(newY, maxY));
      } else {
        // For bottom-side resizing, ensure window doesn't go out of bounds
        newY = Math.max(minY, Math.min(currentDimensions.current.y, maxY));
      }

      // Final safety check: ensure minimum dimensions
      newWidth = Math.max(MIN_WIDTH, newWidth);
      newHeight = Math.max(MIN_HEIGHT, newHeight);

      // Update dimensions and position
      setWidth(newWidth);
      setHeight(newHeight);
      setX(newX);
      setY(newY);

      // Update ref immediately so next move event uses latest values
      currentDimensions.current = {
        width: newWidth,
        height: newHeight,
        x: newX,
        y: newY,
      };
    },
    [isResizing, resizeDirection, setWidth, setHeight, setX, setY]
  );

  const getCursorForDirection = useCallback(
    (direction: string | null): string => {
      if (!direction) return "default";
      const cursorMap: Record<string, string> = {
        nw: "nw-resize",
        n: "n-resize",
        ne: "ne-resize",
        e: "e-resize",
        se: "se-resize",
        s: "s-resize",
        sw: "sw-resize",
        w: "w-resize",
      };
      return cursorMap[direction] || "default";
    },
    []
  );

  const onResizeMouseUp = useCallback(() => {
    setIsResizing(false);
    setResizeDirection(null);
  }, []);

  useEffect(() => {
    if (isResizing && resizeDirection) {
      const cursor = getCursorForDirection(resizeDirection);
      document.body.style.cursor = cursor;
      document.body.style.userSelect = "none";
      window.addEventListener("mousemove", onResizeMouseMove);
      window.addEventListener("mouseup", onResizeMouseUp);
    } else {
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      window.removeEventListener("mousemove", onResizeMouseMove);
      window.removeEventListener("mouseup", onResizeMouseUp);
    }
    return () => {
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      window.removeEventListener("mousemove", onResizeMouseMove);
      window.removeEventListener("mouseup", onResizeMouseUp);
    };
  }, [
    isResizing,
    resizeDirection,
    onResizeMouseMove,
    onResizeMouseUp,
    getCursorForDirection,
  ]);

  return (
    <div className="flex flex-col h-full relative">
      <WindowHeader
        title={props.title}
        onClose={props.onClose}
        x={props.x}
        y={props.y}
        setX={props.setX}
        setY={props.setY}
        width={props.width}
        height={props.height}
        setWidth={props.setWidth}
        setHeight={props.setHeight}
      />
      <div className="flex-1 overflow-auto p-2 bg-white m-1 border border-gray-400">
        {props.children}
      </div>
      <ResizeHandles onResizeMouseDown={onResizeMouseDown} />
    </div>
  );
}

function ResizeHandles(props: {
  onResizeMouseDown: (e: React.MouseEvent, direction: string) => void;
}) {
  const handleSize = 8;
  const handleHitArea = 12;

  const getCursor = (direction: string): string => {
    const cursorMap: Record<string, string> = {
      nw: "nw-resize",
      n: "n-resize",
      ne: "ne-resize",
      e: "e-resize",
      se: "se-resize",
      s: "s-resize",
      sw: "sw-resize",
      w: "w-resize",
    };
    return cursorMap[direction] || "default";
  };

  return (
    <>
      {/* Corners */}
      <div
        className="absolute z-50 bg-transparent"
        style={{
          top: -handleSize / 2,
          left: -handleSize / 2,
          width: handleHitArea,
          height: handleHitArea,
          cursor: getCursor("nw"),
        }}
        onMouseDown={(e) => props.onResizeMouseDown(e, "nw")}
      />
      <div
        className="absolute z-50 bg-transparent"
        style={{
          top: -handleSize / 2,
          right: -handleSize / 2,
          width: handleHitArea,
          height: handleHitArea,
          cursor: getCursor("ne"),
        }}
        onMouseDown={(e) => props.onResizeMouseDown(e, "ne")}
      />
      <div
        className="absolute z-50 bg-transparent"
        style={{
          bottom: -handleSize / 2,
          left: -handleSize / 2,
          width: handleHitArea,
          height: handleHitArea,
          cursor: getCursor("sw"),
        }}
        onMouseDown={(e) => props.onResizeMouseDown(e, "sw")}
      />
      <div
        className="absolute z-50 bg-transparent"
        style={{
          bottom: -handleSize / 2,
          right: -handleSize / 2,
          width: handleHitArea,
          height: handleHitArea,
          cursor: getCursor("se"),
        }}
        onMouseDown={(e) => props.onResizeMouseDown(e, "se")}
      />
      {/* Edges */}
      <div
        className="absolute z-50 bg-transparent"
        style={{
          top: -handleSize / 2,
          left: handleHitArea / 2,
          right: handleHitArea / 2,
          height: handleHitArea,
          cursor: getCursor("n"),
        }}
        onMouseDown={(e) => props.onResizeMouseDown(e, "n")}
      />
      <div
        className="absolute z-50 bg-transparent"
        style={{
          bottom: -handleSize / 2,
          left: handleHitArea / 2,
          right: handleHitArea / 2,
          height: handleHitArea,
          cursor: getCursor("s"),
        }}
        onMouseDown={(e) => props.onResizeMouseDown(e, "s")}
      />
      <div
        className="absolute z-50 bg-transparent"
        style={{
          left: -handleSize / 2,
          top: handleHitArea / 2,
          bottom: handleHitArea / 2,
          width: handleHitArea,
          cursor: getCursor("w"),
        }}
        onMouseDown={(e) => props.onResizeMouseDown(e, "w")}
      />
      <div
        className="absolute z-50 bg-transparent"
        style={{
          right: -handleSize / 2,
          top: handleHitArea / 2,
          bottom: handleHitArea / 2,
          width: handleHitArea,
          cursor: getCursor("e"),
        }}
        onMouseDown={(e) => props.onResizeMouseDown(e, "e")}
      />
    </>
  );
}

function WindowHeader(props: {
  title?: string;
  onClose?: () => void;
  x: number;
  y: number;
  setX: (x: number) => void;
  setY: (y: number) => void;
  width: number;
  height: number;
  setWidth: (width: number) => void;
  setHeight: (height: number) => void;
}) {
  const { setIsSnappingWindow } = useWindowContext();
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, winX: 0, winY: 0 });
  const lastMousePos = useRef({ x: 0, y: 0 });

  const onMouseDown = (e: React.MouseEvent) => {
    // Only drag if left clicking the header (not buttons)
    if (e.button !== 0) return;

    // Check if target is a button or inside a button
    if ((e.target as HTMLElement).closest("button")) return;

    setIsDragging(true);
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    setDragStart({
      x: mouseX,
      y: mouseY,
      winX: props.x,
      winY: props.y,
    });
    lastMousePos.current = { x: mouseX, y: mouseY };
  };

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
      const maxX = viewportWidth - props.width;
      const maxY = viewportHeight - props.height - TASKBAR_HEIGHT;

      // Use current window position as base
      const currentX = props.x;
      const currentY = props.y;

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

      props.setX(newX);
      props.setY(newY);
    },
    [isDragging, dragStart, props]
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
        props.setWidth(viewportWidth / 2);
        props.setHeight(viewportHeight - TASKBAR_HEIGHT);
        props.setX(0);
        props.setY(0);
      } else if (mouseX > viewportWidth - snappingZone) {
        props.setWidth(viewportWidth / 2);
        props.setHeight(viewportHeight - TASKBAR_HEIGHT);
        props.setX(viewportWidth / 2);
        props.setY(0);
      }
    },
    [props]
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

  return (
    <div
      onMouseDown={onMouseDown}
      className={`
        flex items-center justify-between bg-linear-to-b from-[#0058e6] via-[#2576ff] to-[#0058e6] px-2 py-1 select-none
        ${isDragging ? "cursor-grabbing" : "cursor-grab"}
      `}
    >
      <div className="flex items-center gap-2 overflow-hidden pointer-events-none">
        <span className="text-white font-bold text-sm truncate shadow-sm">
          {props.title ?? "Window"}
        </span>
      </div>
      <div className="flex items-center gap-1">
        <WindowHeaderRightButton>
          <ImgIcon src="/minimize.png" />
        </WindowHeaderRightButton>
        <WindowHeaderRightButton>
          <ImgIcon src="/maximize.png" />
        </WindowHeaderRightButton>
        <WindowHeaderRightButton onClick={props.onClose} variant="close">
          <ImgIcon src="/close.png" />
        </WindowHeaderRightButton>
      </div>
    </div>
  );
}

function WindowHeaderRightButton(props: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "default" | "close";
}) {
  return (
    <button
      className={`
        w-[21px] h-[21px] flex items-center justify-center rounded-sm
        cursor-pointer active:brightness-90 transition-all
        ${
          props.variant === "close"
            ? "bg-[#e2422c] hover:bg-[#ff5d47]"
            : "bg-[#0054e3] hover:bg-[#2576ff]"
        }
        border border-white/40 shadow-[inset_1px_1px_1px_rgba(255,255,255,0.4)]
      `}
      onClick={props.onClick}
    >
      <div className="w-4 h-4">{props.children}</div>
    </button>
  );
}

function ImgIcon(props: { src: string }) {
  return (
    <img src={props.src} alt="icon" className="object-cover h-full w-full" />
  );
}
