import { IconButton, Spacer } from "@chakra-ui/react";
import { Flex, Icon, Tooltip } from "@chakra-ui/react";
import { createContext } from "react";
import React, { useContext } from "react";
import { CgArrowsExpandRight, CgCompressRight } from "react-icons/cg";
import { RiDragMove2Fill } from "react-icons/ri";

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
    <Flex alignItems="center" justifyContent="space-between">
      <Tooltip
        label={minimum ? "Move by dragging" : "Move and resize by dragging"}
      >
        <span>
          <Icon color="teal" as={RiDragMove2Fill} w="4" h="4" />
        </span>
      </Tooltip>
      <Spacer />
      {minimum ? (
        <Tooltip label="Show Choomame">
          <span className="no-drag-area">
            <IconButton
              aria-label="Show Choomame"
              icon={<CgArrowsExpandRight />}
              size="xs"
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
              size="xs"
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
    </Flex>
  );
};
export default ToolBar;
