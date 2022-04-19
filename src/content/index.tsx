import "../index.css";
import App from "./App";
import React from "react";
import ReactDOM from "react-dom/client";

const choomameRoot = document.createElement("div");
choomameRoot.id = "choomameRoot";

document.body.appendChild(choomameRoot);

ReactDOM.createRoot(choomameRoot).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

console.log("content script");
