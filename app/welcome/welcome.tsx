import * as React from "react";
import { Window } from "./window";
import { BottomBar, TaskbarButton } from "./BottomBar";
import { WindowSnapping } from "./windowSnapping";
import { WindowProvider } from "./WindowContext";

export function Welcome() {
  return (
    <WindowProvider>
      <DesktopLayout
        bottomBar={
          <BottomBar>
            <TaskbarButton title="Welcome" active icon="/my-documents.png" />
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
            <Window title="Welcome" defaultWidth={400} defaultHeight={300}>
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
