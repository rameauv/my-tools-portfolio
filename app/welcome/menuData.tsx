import * as React from "react";
import type { MenuItem } from "./types";

export const menuItems: MenuItem[] = [
  { 
    label: "Accessories",
    icon: <img src="/folder.jpg" alt="Accessories" className="w-4 h-4" />,
    children: [
      { 
        label: "Calculator",
        icon: <img src="/calculator.png" alt="Calculator" className="w-4 h-4" />
      },
      { 
        label: "Notepad",
        icon: <img src="/my-documents.png" alt="Notepad" className="w-4 h-4" />
      },
      { 
        label: "Paint",
        icon: <img src="/folder.jpg" alt="Paint" className="w-4 h-4" />,
        children: [
          { 
            label: "New",
            icon: <img src="/my-documents.png" alt="New" className="w-4 h-4" />
          },
          { 
            label: "Open",
            icon: <img src="/folder.jpg" alt="Open" className="w-4 h-4" />
          },
          { 
            label: "Recent Files",
            icon: <img src="/folder.jpg" alt="Recent Files" className="w-4 h-4" />,
            children: [
              { 
                label: "File1.png",
                icon: <img src="/my-documents.png" alt="File1.png" className="w-4 h-4" />
              },
              { 
                label: "File2.png",
                icon: <img src="/my-documents.png" alt="File2.png" className="w-4 h-4" />
              }
            ]
          }
        ]
      }
    ]
  },
  { 
    label: "Games",
    icon: <img src="/folder.jpg" alt="Games" className="w-4 h-4" />,
    children: [
      { 
        label: "Solitaire",
        icon: <img src="/folder.jpg" alt="Solitaire" className="w-4 h-4" />
      },
      { 
        label: "Minesweeper",
        icon: <img src="/folder.jpg" alt="Minesweeper" className="w-4 h-4" />
      },
      { 
        label: "Spider Solitaire",
        icon: <img src="/folder.jpg" alt="Spider Solitaire" className="w-4 h-4" />
      }
    ]
  },
  { 
    label: "Startup",
    icon: <img src="/folder.jpg" alt="Startup" className="w-4 h-4" />,
    children: [] 
  },
  { 
    label: "System Tools",
    icon: <img src="/folder.jpg" alt="System Tools" className="w-4 h-4" />,
    children: [
      { 
        label: "Disk Cleanup",
        icon: <img src="/folder.jpg" alt="Disk Cleanup" className="w-4 h-4" />
      },
      { 
        label: "Defragmenter",
        icon: <img src="/folder.jpg" alt="Defragmenter" className="w-4 h-4" />
      },
      { 
        label: "System Information",
        icon: <img src="/folder.jpg" alt="System Information" className="w-4 h-4" />
      }
    ]
  },
  { 
    label: "Internet Explorer",
    icon: <img src="/folder.jpg" alt="Internet Explorer" className="w-4 h-4" />
  },
  { 
    label: "Outlook Express",
    icon: <img src="/folder.jpg" alt="Outlook Express" className="w-4 h-4" />
  },
  { 
    label: "Remote Desktop Connection",
    icon: <img src="/folder.jpg" alt="Remote Desktop Connection" className="w-4 h-4" />
  },
  { 
    label: "Windows Media Player",
    icon: <img src="/folder.jpg" alt="Windows Media Player" className="w-4 h-4" />
  },
  { 
    label: "Windows Movie Maker",
    icon: <img src="/folder.jpg" alt="Windows Movie Maker" className="w-4 h-4" />
  }
];
