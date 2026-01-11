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
      title: "Welcome2",
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

  return (
    <WindowProvider>
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
            {windows.map((window) => (
              <Window
                key={window.id}
                config={window}
                title={window.title}
                defaultWidth={400}
                defaultHeight={300}
                onMinimize={() => onMinimize(window.id)}
                onFocus={() => onFocus(window.id)}
              >
                <window.component key={window.id} />
              </Window>
            ))}
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
