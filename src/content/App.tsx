import { RootState } from "../app/store";
import { nowTime } from "../features/time/timeSlice";
import { Box, Text } from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Rnd } from "react-rnd";
import { useWindowSize } from "react-use";

function App() {
  const time = useSelector((state: RootState) => state.time.value);
  const dispatch = useDispatch();

  const { width, height } = useWindowSize();
  const [boxWidth, setBoxWidth] = useState(500);
  const [boxHight, setBoxHight] = useState(400);
  const [boxX, setBoxX] = useState(width - boxWidth - 20);
  const [boxY, setBoxY] = useState(height - boxHight - 20);
  const windowRef = useRef<Rnd>();
  const nowURL = new URL(location.href);
  const paramTbm = nowURL.searchParams.get("tbm") || "";
  const paramQ = nowURL.searchParams.get("q") || "";
  const paramLr = nowURL.searchParams.get("lr") || "";
  const qLink =
    nowURL.toString().replace(/\?.*$/, "") + "?q=" + encodeURIComponent(paramQ);

  useEffect(() => {
    const paramTbs = nowURL.searchParams.get("tbs") || "";
    dispatch(nowTime(paramTbs));
  }, []);

  useEffect(() => {
    if (width < boxX + boxWidth) {
      setBoxX(width - boxWidth);
    }
    if (height < boxY + boxHight) {
      setBoxY(height - boxHight);
    }
    windowRef.current?.updatePosition({
      x: boxX,
      y: boxY,
    });
  }, [width, height]);

  return (
    <Rnd
      ref={(c) => {
        if (c) windowRef.current = c;
      }}
      bounds="window"
      default={{
        x: boxX,
        y: boxY,
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
    >
      <Box
        boxShadow="base"
        rounded="md"
        bg="green.50"
        w={boxWidth}
        h={boxHight}
      >
        <Box p="4">
          <Text fontSize="xl">dslaf;jasldfjasdl;fasdjlk</Text>
          <Text>{time}</Text>
        </Box>
      </Box>
    </Rnd>
  );
}
export default App;
