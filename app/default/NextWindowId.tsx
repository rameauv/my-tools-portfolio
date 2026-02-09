let nextId = 0;

export const NextWindowId = {
	get(): number {
		const id = nextId;
		// thats 2^53 unique ids, should be enough
		nextId = nextId >= Number.MAX_SAFE_INTEGER ? 0 : nextId + 1;
		return id;
	},
};
