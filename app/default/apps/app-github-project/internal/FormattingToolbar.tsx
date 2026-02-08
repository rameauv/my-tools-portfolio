import { AlignCenter, AlignLeft, AlignRight, Bold, Italic, List, Underline } from "lucide-react";
import React, { type ReactNode } from "react";

export const FormattingToolbar = React.memo(() => {
	return (
		<div className="flex items-center gap-2 border-[#d1d1d1] border-b bg-[#ece9d8] px-2 py-1 text-xs">
			<select className="border border-gray-400 bg-white px-1 py-0.5 text-xs" defaultValue="Times New Roman">
				<option>Times New Roman</option>
				<option>Arial</option>
				<option>Courier New</option>
			</select>
			<select className="border border-gray-400 bg-white px-1 py-0.5 text-xs" defaultValue="12">
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
			<div className="mx-1 h-6 w-px bg-[#d1d1d1]" />
			<ToolbarButton icon={<Bold size={14} />} />
			<ToolbarButton icon={<Italic size={14} />} />
			<ToolbarButton icon={<Underline size={14} />} />
			<div className="mx-1 h-6 w-px bg-[#d1d1d1]" />
			<ToolbarButton icon={<AlignLeft size={14} />} />
			<ToolbarButton icon={<AlignCenter size={14} />} />
			<ToolbarButton icon={<AlignRight size={14} />} />
			<ToolbarButton icon={<List size={14} />} />
		</div>
	);
});

function ToolbarButton(props: { icon: ReactNode }) {
	return (
		<button
			className="flex h-6 w-6 items-center justify-center border border-transparent hover:border-gray-400 hover:bg-white active:border-gray-500 active:bg-gray-100"
			type="button"
		>
			{props.icon}
		</button>
	);
}
