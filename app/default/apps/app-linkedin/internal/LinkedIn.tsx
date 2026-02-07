import React from "react";
import { InternetExplorer } from "./InternetExplorer";
import { XpPage } from "./XpPage";

export const LinkedIn = React.memo(function LinkedIn() {
	return (
		<InternetExplorer>
			<XpPage />
		</InternetExplorer>
	);
});
