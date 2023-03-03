import CustomLinkItemLink from "../features/customLink/CustomLinkItemLink";
import {
  VStack,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
  HStack,
  Tooltip,
} from "@chakra-ui/react";
import React, { useState } from "react";
import {
  HiOutlineArrowTopRightOnSquare,
  HiOutlineCog6Tooth,
  HiOutlineMagnifyingGlass,
} from "react-icons/hi2";

const App: React.FC = () => {
  const [paramQuery, setParamQuery] = useState<string>("");

  return (
    <VStack m="2" width="96" alignItems="stretch">
      <HStack justifyContent="flex-end">
        <Tooltip label="Open this as a tab instead of popup">
          <span>
            <IconButton
              onClick={() => {
                chrome.tabs.create({
                  url: "popup.html",
                });
              }}
              variant="ghost"
              colorScheme="teal"
              aria-label="Open tab instead of popup"
              fontSize="20px"
              icon={<HiOutlineArrowTopRightOnSquare />}
            />
          </span>
        </Tooltip>
        <Tooltip label="Open settings">
          <span>
            <IconButton
              onClick={() => {
                chrome.runtime.openOptionsPage();
              }}
              variant="ghost"
              colorScheme="teal"
              aria-label="Open Settings"
              fontSize="20px"
              icon={<HiOutlineCog6Tooth />}
            />
          </span>
        </Tooltip>
      </HStack>
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
