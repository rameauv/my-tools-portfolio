import React from "react";
import { InternetExplorerShell } from "./InternetExplorerShell";
import { Page } from "./Page";

export const LinkedIn = React.memo(() => {
	return (
		<InternetExplorerShell>
			<Page />
		</InternetExplorerShell>
	);
});
