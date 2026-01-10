import * as React from "react";
import AllProgramsButton from "./AllProgramsButton.1";

let id = 0;

const MainLeftSectionShortcutsItems = [
  {
    id: id++,
    icon: <MainSectionItemImgIcon src="/calculator.png" />,
    title: "Calculator",
    subtitle: "Calculator",
  },
  {
    id: id++,
    icon: <MainSectionItemImgIcon src="/calculator.png" />,
    title: "Calculator",
    subtitle: "Calculator",
  },
] as const;

const MainLeftSectionItems = [
  {
    id: id++,
    icon: <MainSectionItemImgIcon src="/calculator.png" />,
    title: "Calculator",
  },
  {
    id: id++,
    icon: <MainSectionItemImgIcon src="/calculator.png" />,
    title: "Calculator",
  },
  {
    id: id++,
    icon: <MainSectionItemImgIcon src="/calculator.png" />,
    title: "Calculator",
  },
  {
    id: id++,
    icon: <MainSectionItemImgIcon src="/calculator.png" />,
    title: "Calculator",
  },
  {
    id: id++,
    icon: <MainSectionItemImgIcon src="/calculator.png" />,
    title: "Calculator",
  },
  {
    id: id++,
    icon: <MainSectionItemImgIcon src="/calculator.png" />,
    title: "Calculator",
  },
  {
    id: id++,
    icon: <MainSectionItemImgIcon src="/calculator.png" />,
    title: "Calculator",
  },
] as const;

const MainRightSectionTopItems = [
  {
    id: id++,
    icon: <MainSectionItemImgIcon src="/my-documents.png" />,
    title: "My Documents",
  },
  {
    id: id++,
    icon: <MainSectionItemImgIcon src="/my-documents.png" />,
    title: "My Documents",
  },
  {
    id: id++,
    icon: <MainSectionItemImgIcon src="/my-documents.png" />,
    title: "My Documents",
  },
  {
    id: id++,
    icon: <MainSectionItemImgIcon src="/my-documents.png" />,
    title: "My Documents",
  },
  {
    id: id++,
    icon: <MainSectionItemImgIcon src="/my-documents.png" />,
    title: "My Documents",
  },
] as const;

const MainRightSectionMiddleItems = [
  {
    id: id++,
    icon: <MainSectionItemImgIcon src="/my-documents.png" />,
    title: "My Documents",
  },
  {
    id: id++,
    icon: <MainSectionItemImgIcon src="/my-documents.png" />,
    title: "My Documents",
  },
  {
    id: id++,
    icon: <MainSectionItemImgIcon src="/my-documents.png" />,
    title: "My Documents",
  },
  {
    id: id++,
    icon: <MainSectionItemImgIcon src="/my-documents.png" />,
    title: "My Documents",
  },
  {
    id: id++,
    icon: <MainSectionItemImgIcon src="/my-documents.png" />,
    title: "My Documents",
  },
] as const;

const MainRightSectionBottomItems = [
  {
    id: id++,
    icon: <MainSectionItemImgIcon src="/my-documents.png" />,
    title: "Help and Support",
  },
  {
    id: id++,
    icon: <MainSectionItemImgIcon src="/my-documents.png" />,
    title: "Search",
  },
  {
    id: id++,
    icon: <MainSectionItemImgIcon src="/my-documents.png" />,
    title: "Run...",
  },
] as const;

export function StartMenu() {
  return (
    <div className="flex flex-col">
      <StartMenuHeader />
      <StartMenuMain />
      <StartMenuFooter />
    </div>
  );
}

function StartMenuHeader() {
  return (
    <div className="flex items-center gap-2 bg-blue-500 py-2 px-4">
      <div className="w-20 ">
        <StartMenuAccountAvatar />
      </div>
      <p className="flex-1 text-white">John Doe</p>
    </div>
  );
}

function StartMenuMain() {
  return (
    <div className="flex border-2 border-blue-500">
      <div className="flex-1">
        <MainLeftSection />
      </div>
      <div className="w-px bg-blue-500 h-full grow-0 shrink-0" />
      <div className="flex-1">
        <MainRightSection />
      </div>
    </div>
  );
}

function MainLeftSectionSeparator() {
  return <MainSectionSeparator color="var(--color-gray-200)" />;
}

function MainRightSectionSeparator() {
  return <MainSectionSeparator color="var(--color-blue-500)" />;
}

function MainSectionSeparator(props: { color: string }) {
  return (
    <div className="px-4 py-2">
      <div
        className="h-[2px] w-full rounded-[50%]"
        style={
          {
            backgroundColor: props.color,
          } as React.CSSProperties
        }
      />
    </div>
  );
}

function MainLeftSectionItem(props: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="flex items-center gap-2 px-2 py-1">
      <div className="aspect-square rounded-lg h-12 overflow-hidden">
        {props.icon}
      </div>
      <div className="flex flex-col justify-center gap-1">
        <span className="text-black font-bold">{props.title}</span>
        {props.subtitle && (
          <span className="text-gray-500">{props.subtitle}</span>
        )}
      </div>
    </div>
  );
}

function MainRightSectionItem(props: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2 px-2 py-1">
      <div className="aspect-square rounded-lg h-10 overflow-hidden">
        {props.icon}
      </div>
      <div className="flex flex-col justify-center gap-1">
        <span className="text-black font-bold">{props.title}</span>
      </div>
    </div>
  );
}

function MainSectionItemImgIcon(props: { src: string }) {
  return (
    <img src={props.src} alt="Icon" className="object-cover h-full w-full" />
  );
}

function MainLeftSection() {
  return (
    <div className="flex flex-col bg-white py-2">
      {MainLeftSectionShortcutsItems.map((item) => (
        <MainLeftSectionItem key={item.id} {...item} />
      ))}
      <MainLeftSectionSeparator />
      {MainLeftSectionItems.map((item) => (
        <MainLeftSectionItem key={item.id} {...item} />
      ))}
      <MainLeftSectionSeparator />
      <AllProgramsButton />
    </div>
  );
}

function MainRightSection() {
  return (
    <div className="flex flex-col bg-[#d3e5fa] py-2">
      {MainRightSectionTopItems.map((item) => (
        <MainRightSectionItem key={item.id} {...item} />
      ))}
      <MainRightSectionSeparator />
      {MainRightSectionMiddleItems.map((item) => (
        <MainRightSectionItem key={item.id} {...item} />
      ))}
      <MainRightSectionSeparator />
      {MainRightSectionBottomItems.map((item) => (
        <MainRightSectionItem key={item.id} {...item} />
      ))}
    </div>
  );
}

function StartMenuFooter() {
  return (
    <div className="flex bg-blue-500 py-6 px-4 justify-end gap-6">
      <StartMenuFooterLogOffButton />
      <StartMenuFooterShutdownButton />
    </div>
  );
}

function StartMenuFooterButton(props: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <div className="aspect-square border-2 border-white rounded-lg h-12 overflow-hidden">
        {props.icon}
      </div>
      <span className="text-white">{props.label}</span>
    </div>
  );
}

function StartMenuFooterLogOffButton() {
  return (
    <StartMenuFooterButton
      icon={
        <img
          src="/logoff.png"
          alt="Log off"
          className="object-cover h-full w-full"
        />
      }
      label="Log off"
    />
  );
}

function StartMenuFooterShutdownButton() {
  return (
    <StartMenuFooterButton
      icon={
        <img
          src="/shutdown.png"
          alt="Shutdown"
          className="object-cover h-full w-full"
        />
      }
      label="Shutdown"
    />
  );
}

function StartMenuAccountAvatar() {
  return (
    <div className="aspect-square rounded-lg border-white border-4">
      <img
        src="https://github.com/shadcn.png"
        alt="Account Avatar"
        className="object-cover"
      />
    </div>
  );
}
