import { Handle, type NodeProps, Position, type Node as XYFlowNode } from "@xyflow/react";

import { shallow } from "zustand/shallow";

import { type Store, useStore } from "../store";

type OutNodeData = Record<string, unknown>;

const selector = (store: Store) => ({
	isRunning: store.isRunning,
	toggleAudio: store.toggleAudio,
});

export function Out(_props: NodeProps<XYFlowNode<OutNodeData, "out">>) {
	const storeSlice = useStore(selector, shallow);

	return (
		<div className="rounded-md bg-white px-4 py-2 shadow-xl">
			<Handle className="h-2 w-2" position={Position.Top} type="target" />
			<button className="nodrag" onClick={storeSlice.toggleAudio} type="button">
				{storeSlice.isRunning ? (
					<span aria-label="mute" role="img">
						🔈
					</span>
				) : (
					<span aria-label="unmute" role="img">
						🔇
					</span>
				)}
			</button>
		</div>
	);
}
