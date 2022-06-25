import { RootState } from "../app/store";
import LanguagesLink from "../features/languages/LanguagesLink";
import { setParam } from "../features/param/paramSlice";
import TimesLink from "../features/times/TimesLink";
import { Box, Stack, Text } from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Rnd } from "react-rnd";
import useWindowSize from "react-use/lib/useWindowSize";

const marginXY = 20;

const App: React.FC = () => {
  const param = useSelector((state: RootState) => state.param);
  const dispatch = useDispatch();

  const { width, height } = useWindowSize();
  const [boxWidth, setBoxWidth] = useState(500);
  const [boxHight, setBoxHight] = useState(400);
  const [boxX, setBoxX] = useState(width - boxWidth - marginXY);
  const [boxY, setBoxY] = useState(height - boxHight - marginXY);
  const windowRef = useRef<Rnd>();

  useEffect(() => {
    dispatch(setParam());
  }, [dispatch]);

  useEffect(() => {
    if (width < boxX + boxWidth + marginXY) {
      setBoxX(width - boxWidth - marginXY);
    }
    if (height < boxY + boxHight + marginXY) {
      setBoxY(height - boxHight - marginXY);
    }
    windowRef.current?.updatePosition({
      x: boxX,
      y: boxY,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width, height, boxX, boxY]);

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
      cancel=".no-drag-area"
      minWidth="300px"
      minHeight="230px"
    >
      <Box
        boxShadow="base"
        border="1px"
        borderColor="gray.300"
        bgGradient="linear-gradient(135deg, rgba(195, 236, 82, 0.95) 0%, rgba(11, 162, 157, 0.95) 100%);"
        rounded="md"
        w={boxWidth}
        h={boxHight}
        overflow="auto"
      >
        <Stack
          className="no-drag-area"
          m="4"
          p="2"
          rounded="md"
          cursor="auto"
          boxShadow="base"
          backgroundColor="whiteAlpha.500"
          backdropBlur="2xl"
        >
          <Text>{param.q}</Text>
          <Text>search target {param.tbm}</Text>
          <TimesLink />
          <LanguagesLink />
        </Stack>
      </Box>
    </Rnd>
  );
};
export default App;
