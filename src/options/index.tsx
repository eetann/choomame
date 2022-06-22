import { store } from "../app/store";
import App from "./App";
import { ChakraProvider } from "@chakra-ui/react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";

const choomameRoot = document.getElementById("root");

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = createRoot(choomameRoot!);
root.render(
  <Provider store={store}>
    <ChakraProvider>
      <App />
    </ChakraProvider>
  </Provider>
);
