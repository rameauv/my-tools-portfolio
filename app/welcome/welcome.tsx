import * as React from "react";
import { StartButton } from "./StartButton";
import { StartMenu } from "./StartMenu";
import { Window } from "./window";

export function Welcome() {
  return (
    <DesktopLayout
      bottomBar={
        <BottomBar>
          <div>programs</div>
        </BottomBar>
      }
    >
      <div>
        <Window title="Welcome" defaultWidth={400} defaultHeight={300}>
          <h1 className="text-4xl font-bold text-black">Welcome to the app</h1>
        </Window>
      </div>
    </DesktopLayout>
  );
}

function DesktopLayout(props: {
  children: React.ReactNode;
  bottomBar: React.ReactNode;
}) {
  return (
    <main className="flex flex-col justify-center h-screen">
      <div className="flex-1">{props.children}</div>
      {props.bottomBar}
    </main>
  );
}

function BottomBar(props: { children: React.ReactNode }) {
  return (
    <footer className="flex items-center bg-blue-500 p-4">
      <div className="shrink-0">
        <StartButton>
          <StartMenu />
        </StartButton>
      </div>
      <div className="flex-1">{props.children}</div>
      <div className="shrink-0">
        <StatusIconsSection />
      </div>
    </footer>
  );
}

function StatusIconsSection(props: {}) {
  return (
    <div className="flex items-center gap-2">
      <StatusSectionClock />
    </div>
  );
}

function StatusSectionClock(props: {}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-white">10:00</span>
    </div>
  );
}
