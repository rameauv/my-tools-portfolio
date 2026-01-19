import React from "react";
import { Explorer } from "./Explorer";

export const GitHubExplorer = React.memo(function AppTwo() {
	console.log("render AppTwo");
	return <Explorer />;
});
