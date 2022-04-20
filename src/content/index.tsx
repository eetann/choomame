import "../index.css";
import App from "./App";
import React from "react";
import ReactDOM from "react-dom/client";

const choomameRoot = document.createElement("div");
choomameRoot.id = "choomameRoot";
choomameRoot.style.zIndex = "999";
choomameRoot.style.position = "fixed";
choomameRoot.style.top = "0";
choomameRoot.style.left = "0";

document.body.appendChild(choomameRoot);

ReactDOM.createRoot(choomameRoot).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

console.log("content script");
