import { MinimumContext } from "./ToolBar";
import { Flex, Icon, Tooltip } from "@chakra-ui/react";
import React, { useContext } from "react";
import { RiDragMove2Fill } from "react-icons/ri";

const DragMoveIcon: React.FC = () => {
  const { minimum } = useContext(MinimumContext);
  return (
    <Flex justify={minimum ? "center" : "end"} mx="4" mb="2">
      <Tooltip
        label={minimum ? "Move by dragging" : "Move and resize by dragging"}
      >
        <span>
          <Icon color="teal" as={RiDragMove2Fill} w="5" h="5" />
        </span>
      </Tooltip>
    </Flex>
  );
};
export default DragMoveIcon;
