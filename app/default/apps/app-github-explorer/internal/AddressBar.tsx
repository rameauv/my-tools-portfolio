import { ChevronDown } from "lucide-react";
import React from "react";

export const AddressBar = React.memo(() => {
	return (
		<div className="flex items-center gap-2 border-[#d1d1d1] border-b bg-[#ece9d8] px-2 py-1">
			<span className="text-gray-500">Address</span>
			<div className="flex flex-1 items-center border border-[#7f9db9] bg-white px-1 py-0.5 text-black">
				<img alt="folder" className="mr-2 h-4 w-4" src="/assets/icons/shell32/23-folder-48.ico" />
				<span className="flex-1">C:\GitHub</span>
				<ChevronDown className="text-gray-500" size={14} />
			</div>
			<button
				className="flex items-center gap-1 rounded-sm border border-gray-400 bg-[#ece9d8] px-2 py-0.5 hover:border-black"
				type="button"
			>
				<span className="font-bold text-green-600">Go</span>
			</button>
		</div>
	);
});
