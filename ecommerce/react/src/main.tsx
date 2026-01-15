import React from "react";
import ReactDOM from "react-dom/client";
import { ModuleRegistry } from "ag-grid-community";
import { AllCommunityModule, ClientSideRowModelModule } from "ag-grid-community";
import EcommerceExample from "./EcommerceExample";

// Register modules
ModuleRegistry.registerModules([AllCommunityModule, ClientSideRowModelModule]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <EcommerceExample />
  </React.StrictMode>
);
