import { Flex, HStack, Icon, Tooltip } from "@chakra-ui/react";
import React, { useContext } from "react";
import { CgArrowsExpandRight, CgCompressRight } from "react-icons/cg";
import { MinimumContext } from "./minimumContext";

const ToolBar: React.FC = () => {
  const { minimum } = useContext(MinimumContext);

  return (
    <Flex justify="end" mx="4" mb="2">
      <HStack spacing="3">
        {minimum ? (
          <Tooltip label="Show Choomame">
            <span>
              <Icon color="gray" as={CgArrowsExpandRight} w="5" h="5" />
            </span>
          </Tooltip>
        ) : (
          <Tooltip label="Hide Choomame">
            <span>
              <Icon color="gray" as={CgCompressRight} w="5" h="5" />
            </span>
          </Tooltip>
        )}
      </HStack>
    </Flex>
  );
};
export default ToolBar;
