import { Flex, Icon, Tooltip } from "@chakra-ui/react";
import React from "react";
import { RiDragMove2Fill } from "react-icons/ri";

const DragMoveIcon: React.FC = () => {
  return (
    <Flex justify="end" mx="4" mb="2">
      <Tooltip label="Move and resize by dragging">
        <span>
          <Icon color="teal" as={RiDragMove2Fill} w="5" h="5" />
        </span>
      </Tooltip>
    </Flex>
  );
};
export default DragMoveIcon;
