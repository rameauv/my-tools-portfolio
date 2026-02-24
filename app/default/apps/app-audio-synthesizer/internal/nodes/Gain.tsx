import { Handle, type NodeProps, Position, type Node as XYFlowNode } from "@xyflow/react";
import type { ChangeEvent } from "react";
import { useCallback } from "react";

import { useStore } from "../store";

type GainNodeData = {
	gain?: number;
	label?: string;
};

export function Gain(props: NodeProps<XYFlowNode<GainNodeData, "gain">>) {
	const updateNodeData = useStore((state) => state.updateNodeData);
	const gain = props.data?.gain ?? 1;

	const setGain = useCallback(
		(e: ChangeEvent<HTMLInputElement>) => {
			updateNodeData(props.id, { gain: Number(e.target.value) });
		},
		[updateNodeData, props.id],
	);

	return (
		<div className="rounded-md bg-white shadow-xl">
			<Handle className="h-2 w-2" position={Position.Top} type="target" />
			<p className="rounded-t-md bg-emerald-500 px-2 py-1 text-sm text-white">Gain</p>

			<label className="flex flex-col px-2 pt-1 pb-4">
				<p className="mb-2 font-bold text-xs">Gain</p>
				<input className="nodrag" max={2} min={0} onChange={setGain} step={0.01} type="range" value={gain} />
				<p className="text-right text-xs">{gain.toFixed(2)}</p>
			</label>

			<Handle className="h-2 w-2" position={Position.Bottom} type="source" />
		</div>
	);
}
