import { store } from "../app/store";
import App from "./App";
import { ChakraProvider, theme } from "@chakra-ui/react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";

delete theme.styles.global;

const choomameRoot = document.createElement("div");
choomameRoot.id = "choomameRoot";
choomameRoot.style.zIndex = "999";
choomameRoot.style.position = "fixed";
choomameRoot.style.top = "0";
choomameRoot.style.left = "0";

document.body.appendChild(choomameRoot);

const root = createRoot(choomameRoot);
root.render(
  <Provider store={store}>
    <ChakraProvider resetCSS={false} theme={theme}>
      <App />
    </ChakraProvider>
  </Provider>
);
