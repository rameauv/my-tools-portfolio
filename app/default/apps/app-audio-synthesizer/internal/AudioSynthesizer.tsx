import { Background, Panel, ReactFlow, ReactFlowProvider } from "@xyflow/react";
import React, { useCallback, useEffect } from "react";

import { shallow } from "zustand/shallow";
import { Button } from "../../shared/ds/Button";
import { nodeTypes } from "./nodes";
import { useStore } from "./store";

export const AudioSynthesizer = React.memo(function AudioSynthesizer() {
	const nodesState = useStore(
		(state) => ({
			nodes: state.nodes,
			edges: state.edges,
			onNodesChange: state.onNodesChange,
			onEdgesChange: state.onEdgesChange,
			addEdge: state.addEdge,
			removeNodes: state.removeNodes,
			removeEdges: state.removeEdges,
			createNode: state.createNode,
			destroy: state.destroy,
		}),
		shallow,
	);

	const onConnect = useCallback((params: { source: string; target: string }) => {
		useStore.getState().addEdge(params);
	}, []);

	useEffect(() => {
		return () => {
			nodesState.destroy();
		};
	}, [nodesState.destroy]);

	return (
		<ReactFlowProvider>
			<div className="h-full w-full">
				<ReactFlow
					edges={nodesState.edges}
					nodes={nodesState.nodes}
					nodeTypes={nodeTypes}
					onConnect={onConnect}
					onEdgesChange={nodesState.onEdgesChange}
					onEdgesDelete={nodesState.removeEdges}
					onNodesChange={nodesState.onNodesChange}
					onNodesDelete={nodesState.removeNodes}
				>
					<Panel position="top-right">
						<Button onClick={() => nodesState.createNode("osc")} type="button">
							osc
						</Button>
						<Button onClick={() => nodesState.createNode("gain")} type="button">
							amp
						</Button>
					</Panel>
					<Background />
				</ReactFlow>
			</div>
		</ReactFlowProvider>
	);
});
