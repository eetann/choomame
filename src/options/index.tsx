import { store } from "../app/store";
import App from "./App";
import { ChakraProvider } from "@chakra-ui/react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

ReactDOM.render(
  <Provider store={store}>
    <ChakraProvider>
      <App />
    </ChakraProvider>
  </Provider>,
  document.getElementById("root")
);
