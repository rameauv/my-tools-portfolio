import { XpPage } from "./XpPage";
import { InternetExplorer } from "./InternetExplorer";
import React from "react";

export const LinkedIn = React.memo(function LinkedIn() {
  return (
    <InternetExplorer>
      <XpPage />
    </InternetExplorer>
  );
});
