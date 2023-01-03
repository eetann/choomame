import { appearanceBucket } from "../features/appearance/appearanceSlice";
import { MinimumContext } from "./ToolBar";
import { Flex, Stack } from "@chakra-ui/react";
import React, {
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import { Rnd } from "react-rnd";
import useWindowSize from "react-use/lib/useWindowSize";

const defaultBoxWidth = 500;
const defaultBoxHight = 400;
const marginXY = 20;
const minBoxWidth = 85;
const minBoxHeight = 115;
const toggleWindowWidth = 800;

type Props = {
  children: React.ReactNode;
  isBottomRight: boolean;
};

const RndView: React.FC<Props> = ({ children, isBottomRight }) => {
  const { width: windowWidth, height: windowHeight } = useWindowSize();
  const [boxState, setBoxState] = useState({
    x: windowWidth - defaultBoxWidth - marginXY,
    y: windowHeight - defaultBoxHight - marginXY,
    width: defaultBoxWidth,
    height: defaultBoxHight,
  });
  const [visible, dispatchVisible] = useReducer(() => true, false);
  const { minimum, setMinimum } = useContext(MinimumContext);
  const [bottomRight, dispatchBottomRight] = useReducer(() => true, false);

  const windowRef = useRef<Rnd>();

  useEffect(() => {
    // locationがtop-rightの時、boxのX座標を150に変更。bottom-rightのときはフラグをtrue
    // locatioin判定後に可視化
    (async () => {
      const bucket = await appearanceBucket.get();
      if (!isBottomRight && bucket.location === "top-right") {
        setBoxState({ ...boxState, y: 150 });
      } else {
        dispatchBottomRight();
      }
      dispatchVisible();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isBottomRight]);

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
    // Y座標はbottomRightなら下寄せ
    let boxY = boxState.y;
    if (minimum) {
      if (bottomRight) {
        boxY = windowHeight - minBoxHeight - marginXY;
      }
      setBoxState({
        x: windowWidth - minBoxWidth - marginXY,
        y: boxY,
        width: minBoxWidth,
        height: minBoxHeight,
      });
    } else {
      if (bottomRight) {
        boxY = windowHeight - defaultBoxHight - marginXY;
      }
      setBoxState({
        x: windowWidth - defaultBoxWidth - marginXY,
        y: boxY,
        width: defaultBoxWidth,
        height: defaultBoxHight,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minimum, bottomRight]);

  useEffect(() => {
    // ウィンドウ幅よりもbox+marginの幅が大きい時、box幅とX座標を変更する
    // 最小幅よりも小さいなら、box幅は最小幅に、Xを0にする
    if (windowWidth < boxState.width + marginXY) {
      if (windowWidth - marginXY <= minBoxWidth) {
        setBoxState({ ...boxState, x: 0, width: minBoxWidth });
      } else {
        setBoxState({
          ...boxState,
          x: windowWidth - minBoxWidth - marginXY,
          width: windowWidth - marginXY,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [windowWidth, boxState.width]);

  useEffect(() => {
    let boxX = boxState.x;
    let boxY = boxState.y;
    if (windowWidth < boxState.x + boxState.width + marginXY) {
      boxX = windowWidth - boxState.width - marginXY;
    }
    if (windowHeight < boxState.y + boxState.height + marginXY) {
      boxY = windowHeight - boxState.height - marginXY;
    }
    setBoxState({ ...boxState, x: boxX, y: boxY });
    windowRef.current?.updatePosition({
      x: boxX,
      y: boxY,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [windowWidth, windowHeight, boxState.x, boxState.y]);

  return (
    <Rnd
      ref={(c) => {
        if (c) windowRef.current = c;
      }}
      bounds="window"
      position={{
        x: boxState.x,
        y: boxState.y,
      }}
      size={{
        width: boxState.width,
        height: boxState.height,
      }}
      onResize={(_, __, ref, ___, position) => {
        setBoxState({
          ...position,
          width: parseInt(ref.style.width, 10),
          height: parseInt(ref.style.height, 10),
        });
      }}
      onDragStop={(_, data) => {
        setBoxState({ ...boxState, x: data.x, y: data.y });
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
        w={boxState.width}
        h={boxState.height}
        overflow="auto"
        visibility={visible ? "visible" : "hidden"}
        flexDirection="column"
        justify={minimum ? "center" : "space-between"}
      >
        {children}
      </Flex>
    </Rnd>
  );
};
export default RndView;
