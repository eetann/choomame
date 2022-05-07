import { RootState } from "../app/store";
import { setParam } from "../features/param/paramSlice";
import TimesLink from "../features/times/TimesLink";
import { Box, Stack, Text } from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Rnd } from "react-rnd";
import { useWindowSize } from "react-use";

const App: React.VFC = () => {
  const param = useSelector((state: RootState) => state.param);
  const dispatch = useDispatch();

  const { width, height } = useWindowSize();
  const [boxWidth, setBoxWidth] = useState(500);
  const [boxHight, setBoxHight] = useState(400);
  const [boxX, setBoxX] = useState(width - boxWidth - 20);
  const [boxY, setBoxY] = useState(height - boxHight - 20);
  const windowRef = useRef<Rnd>();

  useEffect(() => {
    const nowURL = new URL(location.href);
    const nowParam = {
      url: nowURL.toString(),
      q: nowURL.searchParams.get("q") || "",
      tbs: nowURL.searchParams.get("tbs") || "",
      lr: nowURL.searchParams.get("lr") || "",
      tbm: nowURL.searchParams.get("tbm") || "",
    };
    dispatch(setParam(nowParam));
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
      disableDragging={true}
    >
      <Box
        boxShadow="xs"
        border="1px"
        rounded="md"
        bg="white"
        w={boxWidth}
        h={boxHight}
      >
        <Stack p="4">
          <Text>{param.q}</Text>
          <Text>lr {param.lr}</Text>
          <Text>search target {param.tbm}</Text>
          <TimesLink />
        </Stack>
      </Box>
    </Rnd>
  );
};
export default App;
