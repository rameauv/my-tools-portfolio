import * as React from "react";
import { Window, type WindowConfig } from "./window";
import { BottomBar, TaskbarButton } from "./BottomBar";
import { WindowSnapping } from "./WindowSnapping";
import { WindowProvider } from "./WindowContext";
import { useState } from "react";

export function Welcome() {
  const [windows, setWindows] = useState<WindowConfig[]>([
    { id: 0, title: "Welcome", isMinimized: false, iconSrc: "/my-documents.png" },
  ]);

  function onMinimize(id: number) {
    setWindows(
      windows.map((window) =>
        window.id === id
          ? { ...window, isMinimized: !window.isMinimized }
          : window
      )
    );
  }

  function onToggleWindow(id: number) {
    setWindows(
      windows.map((window) =>
        window.id === id
          ? { ...window, isMinimized: !window.isMinimized }
          : window
      )
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
                active={!window.isMinimized}
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
              >
                <div className="flex flex-col gap-4">
                  <h1
                    className="text-2xl font-bold text-black"
                    style={{ fontFamily: "Tahoma, sans-serif" }}
                  >
                    Welcome to the Windows XP Portfolio
                  </h1>
                  <p
                    className="text-sm text-black"
                    style={{ fontFamily: "Tahoma, sans-serif" }}
                  >
                    This is a faithful recreation of the classic Windows XP
                    interface built with React and Tailwind CSS.
                  </p>
                </div>
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
