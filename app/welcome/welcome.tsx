import * as React from "react";
import { Window, type WindowConfig } from "./window";
import { BottomBar, TaskbarButton } from "./BottomBar";
import { WindowSnapping } from "./WindowSnapping";
import { WindowProvider } from "./WindowContext";
import { useRef, useState } from "react";
import { AppOne } from "./apps/app-one/AppOne";
import { AppTwo } from "./apps/app-two/AppTwo";
import { LinkedIn } from "./apps/linkedin/LinkedIn";

let windowId = 0;

export function Welcome() {
  const [windows, setWindows] = useState<WindowConfig[]>([
    {
      id: windowId++,
      title: "Welcome",
      isMinimized: false,
      iconSrc: "/my-documents.png",
      isFocused: true,
      component: AppOne,
      depth: 0,
    },
    {
      id: windowId++,
      title: "GitHub Explorer",
      isMinimized: false,
      iconSrc: "/my-documents.png",
      isFocused: false,
      component: AppTwo,
      depth: 1,
    },
    {
      id: windowId++,
      title: "LinkedIn Profile",
      isMinimized: false,
      iconSrc: "/my-documents.png",
      isFocused: false,
      component: LinkedIn,
      defaultWidth: 900,
      defaultHeight: 700,
      depth: 2,
    },
  ]);

  function onMinimize(id: number) {
    setWindows(
      windows.map((window) =>
        window.id === id
          ? { ...window, isMinimized: !window.isMinimized, isFocused: false }
          : window
      )
    );
  }

  function onToggleWindow(id: number) {
    setWindows((windows) => {
      const focusedWindow = windows.find((window) => window.isFocused);
      if (focusedWindow != null && focusedWindow.id !== id) {
        return windows.map((window) => {
          if (window.id === id) {
            return {
              ...window,
              isFocused: true,
              isMinimized: false,
              depth: windows.length - 1,
            };
          } else {
            return { ...window, isFocused: false, depth: window.depth - 1 };
          }
        });
      }
      return windows.map((window) =>
        window.id === id
          ? {
              ...window,
              isMinimized: !window.isMinimized,
              isFocused: window.isMinimized,
              depth: windows.length - 1,
            }
          : { ...window, isFocused: false, depth: window.depth - 1 }
      );
    });
  }

  function onFocus(id: number) {
    setWindows(
      windows.map((window) =>
        window.id === id
          ? {
              ...window,
              isFocused: true,
              depth: windows.length - 1,
            }
          : { ...window, isFocused: false, depth: window.depth - 1 }
      )
    );
  }

  function onClose(id: number) {
    console.log("onClose", id);
    setWindows(windows.filter((window) => window.id !== id));
  }

  function openWindow(
    config: Partial<WindowConfig> & { component: React.ComponentType<any> }
  ) {
    const newId = windowId++;
    const newWindow: WindowConfig = {
      id: newId,
      title: config.title || "Untitled",
      isMinimized: false,
      iconSrc: config.iconSrc || "/my-documents.png",
      isFocused: true,
      component: config.component,
      componentProps: config.componentProps,
      defaultWidth: config.defaultWidth,
      defaultHeight: config.defaultHeight,
      depth: windows.length,
    };
    setWindows(
      windows
        .map((w) => ({ ...w, isFocused: false, depth: w.depth - 1 }))
        .concat(newWindow)
    );
  }

  console.log("windows", windows);
  const windowsContainerRef = useRef<HTMLDivElement>(null);

  return (
    <WindowProvider openWindow={openWindow}>
      <DesktopLayout
        bottomBar={
          <BottomBar>
            {windows.map((window) => (
              <TaskbarButton
                key={window.id}
                title={window.title}
                active={window.isFocused}
                icon={window.iconSrc}
                onClick={() => onToggleWindow(window.id)}
              />
            ))}
          </BottomBar>
        }
      >
        <WindowSnapping>
          <div
            className="w-full h-full p-4 flex flex-col items-start gap-4"
            style={{
              background: 'url("/wallpaper.jpg") center/cover no-repeat',
            }}
            ref={windowsContainerRef}
          >
            {windows.map((window) => {
              const Component = window.component;
              return (
                <Window
                  key={"window-" + window.id}
                  config={window}
                  title={window.title}
                  defaultWidth={
                    window.defaultWidth ?? (window.id === 1 ? 800 : 400)
                  }
                  defaultHeight={
                    window.defaultHeight ?? (window.id === 1 ? 600 : 300)
                  }
                  onMinimize={() => onMinimize(window.id)}
                  onFocus={() => onFocus(window.id)}
                  onClose={() => onClose(window.id)}
                  windowsContainerRef={windowsContainerRef}
                >
                  <Component
                    key={"window-content-" + window.id}
                    {...(window.componentProps || {})}
                  />
                </Window>
              );
            })}
          </div>
        </WindowSnapping>
      </DesktopLayout>
    </WindowProvider>
  );
}

function DesktopLayout(props: {
  children: React.ReactNode;
  bottomBar: React.ReactNode;
}) {
  // const desktopContentRef = useRef<HTMLDivElement>(null);
  return (
    <main className="flex flex-col h-screen overflow-hidden">
      <div className="flex-1 relative overflow-hidden">{props.children}</div>
      {props.bottomBar}
    </main>
  );
}
