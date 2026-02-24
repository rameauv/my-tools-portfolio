import {
	applyEdgeChanges,
	applyNodeChanges,
	type Edge,
	type EdgeChange,
	type NodeChange,
	type Node as XYFlowNode,
} from "@xyflow/react";
import { nanoid } from "nanoid";
import { createWithEqualityFn } from "zustand/traditional";
import { AudioManager } from "./audio";
import { OUT_NODE_ID } from "./constants";

export type Store = {
	nodes: XYFlowNode[];
	edges: Edge[];
	onNodesChange: (changes: NodeChange<XYFlowNode>[]) => void;
	onEdgesChange: (changes: EdgeChange<Edge>[]) => void;
	addEdge: (data: { source: string; target: string } & Record<string, unknown>) => void;
	updateNodeData: (nodeId: string, data: Record<string, unknown>) => void;
	isRunning: boolean;
	toggleAudio: () => void;
	removeNodes: (nodes: XYFlowNode[]) => void;
	removeEdges: (edges: Edge[]) => void;
	createNode: (type: "osc" | "gain") => void;
	destroy: () => void;
};

const initialNodes = [{ type: "out", id: OUT_NODE_ID, data: {}, position: { x: 300, y: 0 } }] as XYFlowNode[];

export const useStore = createWithEqualityFn<Store>((set, get) => {
	let audioManager = new AudioManager();

	return {
		nodes: [...initialNodes],
		edges: [] as Edge[],

		onNodesChange(changes: NodeChange<XYFlowNode>[]) {
			set({
				nodes: applyNodeChanges(changes, get().nodes),
			});
		},

		onEdgesChange(changes: EdgeChange<Edge>[]) {
			set({
				edges: applyEdgeChanges(changes, get().edges),
			});
		},

		addEdge(data: { source: string; target: string } & Record<string, unknown>) {
			const id = nanoid(6);
			const edge: Edge = { id, ...data };

			set({ edges: [edge, ...get().edges] });
			audioManager.connect(data.source, data.target);
		},

		updateNodeData(nodeId: string, data: Record<string, unknown>) {
			audioManager.updateAudioNode(nodeId, data as Record<string, number>);
			set({
				nodes: get().nodes.map((n) => (n.id === nodeId ? { ...n, data: { ...n.data, ...data } } : n)),
			});
		},

		isRunning: false,

		toggleAudio() {
			audioManager.toggleAudio().then(() => {
				set({ isRunning: audioManager.isRunning() });
			});
		},

		removeNodes(nodes: XYFlowNode[]) {
			nodes.forEach((node) => void audioManager.removeAudioNode(node.id));
		},

		removeEdges(edges: Edge[]) {
			edges.forEach((edge) => void audioManager.disconnect(edge.source, edge.target));
		},

		createNode(type: "osc" | "gain") {
			const id = nanoid();

			switch (type) {
				case "osc": {
					const data = { frequency: 440, type: "sine" };
					const position = { x: 0, y: 0 };

					audioManager.createAudioNode(id, type, data);
					set({ nodes: [...get().nodes, { id, type, data, position }] });

					break;
				}

				case "gain": {
					const data = { gain: 0.5 };
					const position = { x: 0, y: 0 };

					audioManager.createAudioNode(id, type, data);
					set({ nodes: [...get().nodes, { id, type, data, position }] });

					break;
				}
			}
		},

		destroy() {
			audioManager.destroy();
			audioManager = new AudioManager();
			set({
				nodes: [{ type: "out", id: OUT_NODE_ID, data: {}, position: { x: 300, y: 0 } }] as XYFlowNode[],
				edges: [],
				isRunning: false,
			});
		},
	};
});
