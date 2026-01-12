import * as React from "react";
import { Window, type WindowConfig } from "./window";
import { BottomBar, TaskbarButton } from "./BottomBar";
import { WindowSnapping } from "./WindowSnapping";
import { WindowProvider } from "./WindowContext";
import { useState } from "react";
import { AppOne } from "./apps/app-one/AppOne";
import { AppTwo } from "./apps/app-two/AppTwo";

export function Welcome() {
  const [windows, setWindows] = useState<WindowConfig[]>([
    {
      id: 0,
      title: "Welcome",
      isMinimized: false,
      iconSrc: "/my-documents.png",
      isFocused: true,
      component: AppOne,
    },
    {
      id: 1,
      title: "GitHub Explorer",
      isMinimized: false,
      iconSrc: "/my-documents.png",
      isFocused: false,
      component: AppTwo,
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
    setWindows(
      windows.map((window) =>
        window.id === id
          ? {
              ...window,
              isMinimized: !window.isMinimized,
              isFocused: window.isMinimized,
            }
          : { ...window, isFocused: false }
      )
    );
  }

  function onFocus(id: number) {
    setWindows(
      windows.map((window) => ({ ...window, isFocused: window.id === id }))
    );
  }

  function onClose(id: number) {
    setWindows(windows.filter((window) => window.id !== id));
  }

  function openWindow(config: Partial<WindowConfig> & { component: React.ComponentType<any> }) {
    const newId = Math.max(...windows.map(w => w.id), -1) + 1;
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
    };
    setWindows(windows.map(w => ({ ...w, isFocused: false })).concat(newWindow));
  }

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
          >
            {windows.map((window) => {
              const Component = window.component;
              return (
                  <Window
                  key={window.id}
                  config={window}
                  title={window.title}
                  defaultWidth={window.defaultWidth ?? (window.id === 1 ? 800 : 400)}
                  defaultHeight={window.defaultHeight ?? (window.id === 1 ? 600 : 300)}
                  onMinimize={() => onMinimize(window.id)}
                  onFocus={() => onFocus(window.id)}
                  onClose={() => onClose(window.id)}
                >
                  <Component key={window.id} {...(window.componentProps || {})} />
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
  return (
    <main className="flex flex-col h-screen overflow-hidden">
      <div className="flex-1 relative overflow-hidden">{props.children}</div>
      {props.bottomBar}
    </main>
  );
}
