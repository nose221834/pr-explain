import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "@/assets/tailwind.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <div className="flex justify-center p-4">
      <App />
    </div>
  </React.StrictMode>
);
