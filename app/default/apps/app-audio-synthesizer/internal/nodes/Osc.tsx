import { Handle, type NodeProps, Position, type Node as XYFlowNode } from "@xyflow/react";
import type { ChangeEvent } from "react";
import { useCallback } from "react";

import { useStore } from "../store";

type OscNodeData = {
	frequency?: number;
	type?: string;
	label?: string;
};

export function Osc(props: NodeProps<XYFlowNode<OscNodeData, "osc">>) {
	const updateNodeData = useStore((state) => state.updateNodeData);
	const frequency = props.data?.frequency ?? 440;
	const waveformType = props.data?.type ?? "sine";

	const setFrequency = useCallback(
		(e: ChangeEvent<HTMLInputElement>) => {
			updateNodeData(props.id, { frequency: Number(e.target.value) });
		},
		[updateNodeData, props.id],
	);

	const setType = useCallback(
		(e: ChangeEvent<HTMLSelectElement>) => {
			updateNodeData(props.id, { type: e.target.value });
		},
		[updateNodeData, props.id],
	);

	return (
		<div className="rounded-md bg-white shadow-xl">
			<p className="rounded-t-md bg-pink-500 px-2 py-1 text-sm text-white">Osc</p>

			<label className="flex flex-col px-2 py-1">
				<p className="mb-2 font-bold text-xs">Frequency</p>
				<input className="nodrag" max={1000} min={10} onChange={setFrequency} type="range" value={frequency} />
				<p className="text-right text-xs">{frequency} Hz</p>
			</label>

			<hr className="mx-2 border-gray-200" />

			<label className="flex flex-col px-2 pt-1 pb-4">
				<p className="mb-2 font-bold text-xs">Waveform</p>
				<select className="nodrag" onChange={setType} value={waveformType}>
					<option value="sine">sine</option>
					<option value="triangle">triangle</option>
					<option value="sawtooth">sawtooth</option>
					<option value="square">square</option>
				</select>
			</label>

			<Handle className="h-2 w-2" position={Position.Bottom} type="source" />
		</div>
	);
}
