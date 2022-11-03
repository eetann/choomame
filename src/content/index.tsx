import App from "./App";
import { ChakraProvider, theme } from "@chakra-ui/react";
import { createRoot } from "react-dom/client";

delete theme.styles.global;

const choomameRoot = document.createElement("div");
choomameRoot.id = "choomameRoot";
// <body>
//   - search bar 128
//     - candidates 989 (do not matter)
//   - main
//     - toolbar 126
//   - choomame 127
choomameRoot.style.zIndex = "127";
choomameRoot.style.position = "fixed";
choomameRoot.style.top = "0";
choomameRoot.style.left = "0";

document.body.appendChild(choomameRoot);

const root = createRoot(choomameRoot);
root.render(
  <ChakraProvider resetCSS={false} theme={theme}>
    <App />
  </ChakraProvider>
);
