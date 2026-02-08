import React from "react";
import { InternetExplorer } from "./InternetExplorer";
import { XpPage } from "./XpPage";

export const LinkedIn = React.memo(() => {
	return (
		<InternetExplorer>
			<XpPage />
		</InternetExplorer>
	);
});
