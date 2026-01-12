import * as React from "react";
import Markdown from "react-markdown";
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, List } from "lucide-react";
import clsx from "clsx";
import type { GithubRepo } from "../app-two/mockData";

interface WordViewerProps {
  repo?: GithubRepo | null;
}

export function WordViewer({ repo }: WordViewerProps) {
  if (!repo) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500" style={{ fontFamily: "Tahoma, sans-serif" }}>
        No document selected
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#ece9d8]" style={{ fontFamily: "Tahoma, sans-serif" }}>
      {/* Menu Bar */}
      <div className="bg-[#ece9d8] border-b border-[#d1d1d1] px-2 py-1 flex items-center gap-4 text-xs text-black">
        <span className="hover:bg-white hover:px-1 cursor-pointer">File</span>
        <span className="hover:bg-white hover:px-1 cursor-pointer">Edit</span>
        <span className="hover:bg-white hover:px-1 cursor-pointer">View</span>
        <span className="hover:bg-white hover:px-1 cursor-pointer">Insert</span>
        <span className="hover:bg-white hover:px-1 cursor-pointer">Format</span>
        <span className="hover:bg-white hover:px-1 cursor-pointer">Tools</span>
        <span className="hover:bg-white hover:px-1 cursor-pointer">Table</span>
        <span className="hover:bg-white hover:px-1 cursor-pointer">Window</span>
        <span className="hover:bg-white hover:px-1 cursor-pointer">Help</span>
      </div>

      {/* Formatting Toolbar */}
      <div className="bg-[#ece9d8] border-b border-[#d1d1d1] px-2 py-1 flex items-center gap-2 text-xs">
        <select className="border border-gray-400 bg-white text-xs px-1 py-0.5" defaultValue="Times New Roman">
          <option>Times New Roman</option>
          <option>Arial</option>
          <option>Courier New</option>
        </select>
        <select className="border border-gray-400 bg-white text-xs px-1 py-0.5" defaultValue="12">
          <option>8</option>
          <option>9</option>
          <option>10</option>
          <option>11</option>
          <option>12</option>
          <option>14</option>
          <option>16</option>
          <option>18</option>
          <option>20</option>
          <option>24</option>
        </select>
        <div className="w-[1px] h-6 bg-[#d1d1d1] mx-1" />
        <ToolbarButton icon={<Bold size={14} />} />
        <ToolbarButton icon={<Italic size={14} />} />
        <ToolbarButton icon={<Underline size={14} />} />
        <div className="w-[1px] h-6 bg-[#d1d1d1] mx-1" />
        <ToolbarButton icon={<AlignLeft size={14} />} />
        <ToolbarButton icon={<AlignCenter size={14} />} />
        <ToolbarButton icon={<AlignRight size={14} />} />
        <ToolbarButton icon={<List size={14} />} />
      </div>

      {/* Ruler */}
      <div className="bg-[#ece9d8] border-b border-[#d1d1d1] px-2 py-1 h-6 flex items-end text-[10px] text-gray-600 relative">
        <div className="absolute left-0 right-0 bottom-0 h-1 bg-gradient-to-b from-gray-200 to-gray-300 border-t border-gray-400">
          {/* Ruler marks */}
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute border-l border-gray-500"
              style={{ left: `${i * 48}px`, height: i % 4 === 0 ? "100%" : "50%" }}
            />
          ))}
        </div>
      </div>

      {/* Document Area */}
      <div className="flex-1 overflow-auto bg-gray-200 p-8">
        <div className="bg-white shadow-lg mx-auto max-w-4xl min-h-full p-12">
          <div className="prose prose-sm max-w-none" style={{ fontFamily: "Times New Roman, serif" }}>
            <Markdown>{repo.readmeContent}</Markdown>
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="bg-[#ece9d8] border-t border-[#d1d1d1] px-2 py-1 flex items-center justify-between text-xs text-black">
        <div className="flex items-center gap-4">
          <span>Page 1</span>
          <span>Sec 1</span>
          <span>1/1</span>
          <span>At 1"</span>
          <span>Ln 1</span>
          <span>Col 1</span>
        </div>
        <div className="flex items-center gap-2">
          <span>REC</span>
          <span>TRK</span>
          <span>EXT</span>
          <span>OVR</span>
        </div>
      </div>
    </div>
  );
}

function ToolbarButton({ icon }: { icon: React.ReactNode }) {
  return (
    <button className="w-6 h-6 flex items-center justify-center border border-transparent hover:border-gray-400 hover:bg-white active:border-gray-500 active:bg-gray-100">
      {icon}
    </button>
  );
}
