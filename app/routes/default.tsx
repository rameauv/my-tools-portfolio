import { Default } from "../default/Default";

export function meta() {
	return [
		{ title: "My Portfolio" },
		{ name: "description", content: "Welcome to my portfolio!" },
	];
}

export default function DefaultRoute() {
	return <Default />;
}
