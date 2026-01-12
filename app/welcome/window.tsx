import { Dialog } from "@base-ui/react";
import * as React from "react";
import { useState, useCallback, useEffect } from "react";
import { useWindowResize } from "./useWindowResize";
import { useWindowDrag } from "./useWindowDrag";
import { useWindowContext } from "./WindowContext";

const TASKBAR_HEIGHT = 30;

export interface WindowConfig {
  id: number;
  title: string;
  isMinimized: boolean;
  iconSrc: string;
  isFocused: boolean;
  component: React.ComponentType<any>;
  componentProps?: Record<string, unknown>;
  defaultWidth?: number;
  defaultHeight?: number;
}

export function Window(props: {
  children: React.ReactNode;
  title?: string;
  onClose?: () => void;
  defaultWidth?: number;
  defaultHeight?: number;
  config: WindowConfig;
  onMinimize?: () => void;
  onFocus: () => void;
}) {
  const open = true;
  const [x, setX] = useState(100);
  const [y, setY] = useState(100);
  const [width, setWidth] = useState(props.defaultWidth ?? 200);
  const [height, setHeight] = useState(props.defaultHeight ?? 200);

  return (
    <Dialog.Root open={open} modal={false}>
      <Dialog.Portal>
        <Dialog.Popup
          className={`
            fixed bg-[#ece9d8] border-2 shadow-xl z-50 overflow-hidden rounded-t-lg
            ${props.config.isFocused ? "border-[#0054e3]" : "border-[#7a96df]"}
          `}
          style={{
            top: 0,
            left: 0,
            transform: `translate(${x}px, ${y}px)`,
            width: width,
            height: height,
            opacity: props.config.isMinimized ? 0 : 1,
            pointerEvents: props.config.isMinimized ? "none" : "auto",
            zIndex: props.config.isFocused ? 100 : 50,
          }}
          onFocus={() => props.onFocus()}
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
            onMinimize={props.onMinimize}
            isFocused={props.config.isFocused}
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
  onMinimize?: () => void;
  isFocused: boolean;
}) {
  const {
    onResizeMouseDown,
    onResizeMouseMove,
    onResizeMouseUp,
    isResizing,
    resizeDirection,
  } = useWindowResize({
    width: props.width,
    height: props.height,
    x: props.x,
    y: props.y,
    setWidth: props.setWidth,
    setHeight: props.setHeight,
    setX: props.setX,
    setY: props.setY,
  });

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
        onMinimize={props.onMinimize}
        x={props.x}
        y={props.y}
        setX={props.setX}
        setY={props.setY}
        width={props.width}
        height={props.height}
        setWidth={props.setWidth}
        setHeight={props.setHeight}
        isFocused={props.isFocused}
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
  onMinimize?: () => void;
  isFocused: boolean;
}) {
  const { setIsSnappingWindow } = useWindowContext();
  const { onMouseDown, isDragging } = useWindowDrag({
    x: props.x,
    y: props.y,
    width: props.width,
    height: props.height,
    setX: props.setX,
    setY: props.setY,
    setWidth: props.setWidth,
    setHeight: props.setHeight,
    setIsSnappingWindow,
  });

  const onMaximize = React.useEffectEvent(() => {
    const viewportWidth = window.innerWidth;
    const maxHeight = window.innerHeight - TASKBAR_HEIGHT;
    props.setWidth(viewportWidth);
    props.setHeight(maxHeight);
    props.setX(0);
    props.setY(0);
  });

  return (
    <div
      onMouseDown={onMouseDown}
      className={`
        flex items-center justify-between px-2 py-1 select-none
        ${
          props.isFocused
            ? "bg-linear-to-b from-[#0058e6] via-[#2576ff] to-[#0058e6]"
            : "bg-linear-to-b from-[#7a96df] via-[#9db9eb] to-[#7a96df]"
        }
        ${isDragging ? "cursor-grabbing" : "cursor-grab"}
      `}
    >
      <div className="flex items-center gap-2 overflow-hidden pointer-events-none">
        <span
          className={`
          font-bold text-sm truncate shadow-sm
          ${props.isFocused ? "text-white" : "text-[#dbe1f1]"}
        `}
        >
          {props.title ?? "Window"}
        </span>
      </div>
      <div className="flex items-center gap-1">
        <WindowHeaderRightButton
          onClick={props.onMinimize}
          isFocused={props.isFocused}
        >
          <ImgIcon src="/minimize.png" isFocused={props.isFocused} />
        </WindowHeaderRightButton>
        <WindowHeaderRightButton
          onClick={onMaximize}
          isFocused={props.isFocused}
        >
          <ImgIcon src="/maximize.png" isFocused={props.isFocused} />
        </WindowHeaderRightButton>
        <WindowHeaderRightButton
          onClick={props.onClose}
          isFocused={props.isFocused}
          isClose
        >
          <ImgIcon src="/close.png" isFocused={props.isFocused} />
        </WindowHeaderRightButton>
      </div>
    </div>
  );
}

function WindowHeaderRightButton(props: {
  children: React.ReactNode;
  onClick?: () => void;
  isFocused: boolean;
  isClose?: boolean;
}) {
  return (
    <button
      className="w-[21px] h-[21px] flex items-center justify-center cursor-pointer active:brightness-90 transition-all outline-none border-none bg-transparent"
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
}

function ImgIcon(props: { src: string; isFocused: boolean }) {
  return (
    <img
      src={props.src}
      alt="icon"
      className={`
        h-full w-full object-contain
        ${props.isFocused ? "" : "opacity-70 saturate-[0.25] brightness-110"}
      `}
    />
  );
}
