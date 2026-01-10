import { Dialog } from "@base-ui/react";
import * as React from "react";
import { useState, useEffect, useCallback, useRef } from "react";

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
}) {
  return (
    <div className="flex flex-col h-full">
      <WindowHeader
        title={props.title}
        onClose={props.onClose}
        x={props.x}
        y={props.y}
        setX={props.setX}
        setY={props.setY}
        width={props.width}
        height={props.height}
      />
      <div className="flex-1 overflow-auto p-2 bg-white m-1 border border-gray-400">
        {props.children}
      </div>
    </div>
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
}) {
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

      // Update last mouse position for next event
      lastMousePos.current = { x: e.clientX, y: e.clientY };

      // Get viewport dimensions
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const TASKBAR_HEIGHT = 30; // Height of the BottomBar

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

  const onMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

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
