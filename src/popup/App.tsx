import CustomLinkItemLink from "../features/customLink/CustomLinkItemLink";
import {
  VStack,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { HiOutlineCog6Tooth, HiOutlineMagnifyingGlass } from "react-icons/hi2";

const App: React.FC = () => {
  const [paramQuery, setParamQuery] = useState<string>("");

  return (
    <VStack m="2" width="96" alignItems="stretch">
      <IconButton
        alignSelf="end"
        onClick={() => {
          chrome.runtime.openOptionsPage();
        }}
        variant="ghost"
        colorScheme="teal"
        aria-label="Open Settings"
        fontSize="20px"
        icon={<HiOutlineCog6Tooth />}
      />
      <InputGroup>
        <InputLeftElement pointerEvents="none">
          <Icon as={HiOutlineMagnifyingGlass} />
        </InputLeftElement>
        <Input
          placeholder="Enter keyword..."
          autoFocus={true}
          value={paramQuery}
          onChange={(e) => setParamQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              // focusを移す
              console.log("enter");
            }
          }}
        />
      </InputGroup>
      <Text>Press the Tab key to focus on the link.</Text>
      <CustomLinkItemLink paramQuery={paramQuery} isInPopup={true} />
    </VStack>
  );
};
export default App;
