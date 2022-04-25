import { store } from "../app/store";
import App from "./App";
import { ChakraProvider } from "@chakra-ui/react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

const choomameRoot = document.createElement("div");
choomameRoot.id = "choomameRoot";
// choomameRoot.style.all = "unset";
choomameRoot.style.zIndex = "999";
choomameRoot.style.position = "fixed";
choomameRoot.style.top = "0";
choomameRoot.style.left = "0";

document.body.appendChild(choomameRoot);

ReactDOM.render(
  <Provider store={store}>
    <ChakraProvider resetCSS={false}>
      <App />
    </ChakraProvider>
  </Provider>,
  choomameRoot
);

console.log("content script");
