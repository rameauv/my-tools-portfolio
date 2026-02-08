import React from "react";

export const StatusBar = React.memo(() => {
	return (
		<div className="flex items-center justify-between border-[#d1d1d1] border-t bg-[#ece9d8] px-2 py-1 text-black text-xs">
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
	);
});
