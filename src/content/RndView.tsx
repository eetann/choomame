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
  const { minimum, setMinimum } = useContext(MinimumContext);

  const windowRef = useRef<Rnd>();

  useEffect(() => {
    // locationがtop-rightの時のみboxのX座標を150に変更
    // locatioin判定後に可視化
    (async () => {
      const bucket = await appearanceBucket.get();
      if (bucket.location === "top-right") {
        setBoxY(150);
      }
      setVisible(true);
    })();
  }, []);

  useEffect(() => {
    // ウィンドウ幅が変わった時、toggleWindowWidthよりも小さいなら最小化、大きいなら最大化
    if (windowWidth < toggleWindowWidth) {
      setMinimum(true);
    } else {
      setMinimum(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [windowWidth]);

  useEffect(() => {
    // 最小化されたりもとに戻る時、boxのサイズを変更し、X座標は右寄せに変更する
    if (minimum) {
      setBoxWidth(minBoxWidth);
      setBoxHight(minBoxHeight);
      setBoxX(windowWidth - minBoxWidth - marginXY);
    } else {
      setBoxWidth(defaultBoxWidth);
      setBoxHight(defaultBoxHight);
      setBoxX(windowWidth - defaultBoxWidth - marginXY);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minimum]);

  useEffect(() => {
    // ウィンドウ幅よりもbox+marginの幅が大きい時、box幅とX座標を変更する
    // 最小幅よりも小さいなら、box幅は最小幅に、Xを0にする
    if (windowWidth < boxWidth + marginXY) {
      if (windowWidth - marginXY <= minBoxWidth) {
        setBoxWidth(minBoxWidth);
        setBoxX(0);
      } else {
        setBoxWidth(windowWidth - marginXY);
        setBoxX(windowWidth - minBoxWidth - marginXY);
      }
    }
  }, [windowWidth, boxWidth]);

  useEffect(() => {
    let newBoxX = boxX;
    if (windowWidth < boxX + boxWidth + marginXY) {
      newBoxX = windowWidth - boxWidth - marginXY;
      setBoxX(newBoxX);
    }
    windowRef.current?.updatePosition({
      x: newBoxX,
      y: boxY,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [windowWidth, boxX]);

  useEffect(() => {
    let newBoxY = boxY;
    if (windowHeight < boxY + boxHight + marginXY) {
      newBoxY = windowHeight - boxHight - marginXY;
      setBoxY(newBoxY);
    }
    windowRef.current?.updatePosition({
      x: boxX,
      y: newBoxY,
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
      enableResizing={!minimum}
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
