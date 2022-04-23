import App from "./App";
import { ChakraProvider } from "@chakra-ui/react";
import React from "react";
import ReactDOM from "react-dom";

const choomameRoot = document.createElement("div");
choomameRoot.id = "choomameRoot";
// choomameRoot.style.all = "unset";
choomameRoot.style.zIndex = "999";
choomameRoot.style.position = "fixed";
choomameRoot.style.top = "0";
choomameRoot.style.left = "0";

document.body.appendChild(choomameRoot);

ReactDOM.render(
  <React.StrictMode>
    <ChakraProvider resetCSS={false}>
      <App />
    </ChakraProvider>
  </React.StrictMode>,
  choomameRoot
);

console.log("content script");
