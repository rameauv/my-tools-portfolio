import React from "react";
import { Explorer } from "./Explorer";

export const AppTwo = React.memo(function AppTwo() {
  console.log("render AppTwo");
  return <Explorer />;
});
