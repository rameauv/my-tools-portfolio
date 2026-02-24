import { OUT_NODE_ID } from "./constants";

export class AudioManager {
	private context = new AudioContext();
	private nodes = new Map<string, AudioNode>();
	private out = this.context.destination;

	constructor() {
		this.nodes.set(OUT_NODE_ID, this.out);
		this.context.suspend();
	}

	updateAudioNode(id: string, data: Record<string, number>) {
		const node = this.nodes.get(id);
		if (!node) return;

		const nodeRecord = node as unknown as Record<string, unknown>;
		for (const [key, val] of Object.entries(data)) {
			const prop = nodeRecord[key];
			if (prop instanceof AudioParam) {
				prop.value = val;
			} else {
				nodeRecord[key] = val;
			}
		}
	}

	removeAudioNode(id: string) {
		const node = this.nodes.get(id);
		if (!node) return;

		node.disconnect();
		(node as AudioScheduledSourceNode).stop?.();

		this.nodes.delete(id);
	}

	connect(sourceId: string, targetId: string) {
		const source = this.nodes.get(sourceId);
		const target = this.nodes.get(targetId);
		if (!source || !target) return;

		source.connect(target);
	}

	disconnect(sourceId: string, targetId: string) {
		const source = this.nodes.get(sourceId);
		const target = this.nodes.get(targetId);
		if (!source || !target) return;

		source.disconnect(target);
	}

	isRunning() {
		return this.context.state === "running";
	}

	toggleAudio() {
		console.log("toggleAudio", this.isRunning());
		return this.isRunning() ? this.context.suspend() : this.context.resume();
	}

	createAudioNode(id: string, type: "osc" | "gain" | "out", data: Record<string, unknown>) {
		switch (type) {
			case "osc": {
				const node = this.context.createOscillator();
				node.frequency.value = (data.frequency as number) ?? 440;
				node.type = (data.type as OscillatorType) ?? "sine";
				node.start();

				this.nodes.set(id, node);
				break;
			}

			case "gain": {
				const node = this.context.createGain();
				node.gain.value = (data.gain as number) ?? 0.5;

				this.nodes.set(id, node);
				break;
			}
		}
	}

	destroy() {
		for (const [id, node] of this.nodes) {
			if (id !== OUT_NODE_ID) {
				node.disconnect();
				(node as AudioScheduledSourceNode).stop?.();
			}
		}
		this.nodes.clear();
		this.context.close();
	}
}
