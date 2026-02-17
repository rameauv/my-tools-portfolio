export function assertAllOptionsHandled(value: never) {
	// not supposed to happen because it should be catched at build time
	console.error(`Unexpected value: ${value}`);
}
