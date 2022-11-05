import { appearanceBucket } from "../features/appearance/appearanceSlice";
import DragMoveIcon from "./DragMoveIcon";
import { MinimumContext } from "./ToolBar";
import { Flex, Stack } from "@chakra-ui/react";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Rnd } from "react-rnd";
import useWindowSize from "react-use/lib/useWindowSize";

const defaultBoxWidth = 500;
const defaultBoxHight = 200;
const marginXY = 20;
const minBoxWidth = 100;
const minBoxHeight = 150;
const toggleWindowWidth = 800;

type Props = {
  children: React.ReactNode;
};

const RndView: React.FC<Props> = ({ children }) => {
  const { width: windowWidth, height: windowHeight } = useWindowSize();
  const [boxWidth, setBoxWidth] = useState(defaultBoxWidth);
  const [boxHight, setBoxHight] = useState(defaultBoxHight);
  const [boxX, setBoxX] = useState(windowWidth - boxWidth - marginXY);
  const [boxY, setBoxY] = useState(windowHeight - boxHight - marginXY);
  const [visible, setVisible] = useState(false);
  const { setMinimum } = useContext(MinimumContext);

  const windowRef = useRef<Rnd>();

  useEffect(() => {
    (async () => {
      const bucket = await appearanceBucket.get();
      if (bucket.location === "top-right") {
        setBoxY(150);
      }
      setVisible(true);
    })();
  }, []);

  useEffect(() => {
    if (windowWidth < toggleWindowWidth) {
      setMinimum(true);
      setBoxWidth(minBoxWidth);
      setBoxHight(minBoxHeight);
      setBoxX(windowWidth - boxWidth - marginXY);
    } else {
      setMinimum(false);
      setBoxWidth(defaultBoxWidth);
      setBoxHight(defaultBoxHight);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [windowWidth]);

  useEffect(() => {
    if (windowWidth < boxX + boxWidth + marginXY) {
      setBoxX(windowWidth - boxWidth - marginXY);
    }
    windowRef.current?.updatePosition({
      x: boxX,
      y: boxY,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [windowWidth, boxX]);

  useEffect(() => {
    if (windowHeight < boxY + boxHight + marginXY) {
      setBoxY(windowHeight - boxHight - marginXY);
    }
    windowRef.current?.updatePosition({
      x: boxX,
      y: boxY,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [windowHeight, boxY]);

  return (
    <Rnd
      ref={(c) => {
        if (c) windowRef.current = c;
      }}
      bounds="window"
      position={{
        x: boxX,
        y: boxY,
      }}
      size={{
        width: boxWidth,
        height: boxHight,
      }}
      onResize={(_, __, ref) => {
        setBoxWidth(parseInt(ref.style.width, 10));
        setBoxHight(parseInt(ref.style.height, 10));
      }}
      onDragStop={(_, data) => {
        setBoxX(data.x);
        setBoxY(data.y);
      }}
      cancel=".no-drag-area"
      minWidth={`${minBoxWidth}px`}
      minHeight={`${minBoxHeight}px`}
      // disableDragging={!visible}
    >
      <Flex
        boxShadow="base"
        border="1px"
        borderColor="gray.300"
        bgColor="rgba(195, 236, 82, 0.95)"
        rounded="md"
        w={boxWidth}
        h={boxHight}
        overflow="auto"
        visibility={visible ? "visible" : "hidden"}
        flexDirection="column"
        justify="space-between"
      >
        <Stack
          className="no-drag-area"
          m="4"
          p="2"
          rounded="md"
          cursor="auto"
          boxShadow="base"
          backgroundColor="whiteAlpha.700"
          backdropBlur="2xl"
        >
          {children}
        </Stack>
        <DragMoveIcon />
      </Flex>
    </Rnd>
  );
};
export default RndView;
