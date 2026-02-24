import type { NodeTypes } from "@xyflow/react";
import { Gain } from "./Gain";
import { Osc } from "./Osc";
import { Out } from "./Out";

export const nodeTypes: NodeTypes = {
	gain: Gain,
	osc: Osc,
	out: Out,
};
