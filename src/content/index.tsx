import "../index.css";
import App from "./App";
import React from "react";
import * as ReactDOM from 'react-dom';

const choomameRoot = document.createElement("div");
choomameRoot.id = "choomameRoot";
choomameRoot.style.zIndex = "999";
choomameRoot.style.position = "fixed";
choomameRoot.style.top = "0";
choomameRoot.style.left = "0";

document.body.appendChild(choomameRoot);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  choomameRoot
);

console.log("content script");
