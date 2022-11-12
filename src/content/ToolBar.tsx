import { Flex, HStack, IconButton, Tooltip } from "@chakra-ui/react";
import React, { useContext } from "react";
import { createContext } from "react";
import { CgArrowsExpandRight, CgCompressRight } from "react-icons/cg";

export type MinimumContextType = {
  minimum: boolean;
  setMinimum: React.Dispatch<React.SetStateAction<boolean>>;
};

const defaultMinimumContext: MinimumContextType = {
  minimum: false,
  setMinimum: () => false,
};

export const MinimumContext = createContext<MinimumContextType>(
  defaultMinimumContext
);

const ToolBar: React.FC = () => {
  const { minimum, setMinimum } = useContext(MinimumContext);

  return (
    <Flex justify="end">
      <HStack spacing="3">
        {minimum ? (
          <Tooltip label="Show Choomame">
            <span>
              <IconButton
                aria-label="Show Choomame"
                icon={<CgArrowsExpandRight />}
                size="sm"
                variant="outline"
                backgroundColor="whiteAlpha.700"
                cursor="pointer"
                color="teal"
                _hover={{
                  backgroundColor: "blackAlpha.50",
                }}
                onClick={() => setMinimum(false)}
              />
            </span>
          </Tooltip>
        ) : (
          <Tooltip label="Hide Choomame">
            <span>
              <IconButton
                aria-label="Hide Choomame"
                icon={<CgCompressRight />}
                size="sm"
                variant="outline"
                backgroundColor="whiteAlpha.700"
                cursor="pointer"
                color="teal"
                _hover={{
                  backgroundColor: "blackAlpha.50",
                }}
                onClick={() => setMinimum(true)}
              />
            </span>
          </Tooltip>
        )}
      </HStack>
    </Flex>
  );
};
export default ToolBar;
