import { AppDispatch, RootState } from "../app/store";
import { fetchAllAppearance } from "../features/appearance/appearanceSlice";
import { Box, Stack } from "@chakra-ui/react";
import { createSelector } from "@reduxjs/toolkit";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Rnd } from "react-rnd";
import useWindowSize from "react-use/lib/useWindowSize";

const marginXY = 20;
const minWidth = 300;
const minHeight = 230;

const appearanceState = (state: RootState) => state.appearance;
const bucketSelector = createSelector(
  [appearanceState],
  (appearance) => appearance.bucket
);
const getY = createSelector([bucketSelector], (bucket) => {
  if (bucket.location === "top-right") {
    return 150;
  }
  return 400;
});

type Props = {
  children: React.ReactNode;
};

const RndView: React.FC<Props> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const appearance = useSelector((state: RootState) => getY(state));

  const { width, height } = useWindowSize();
  const [boxWidth, setBoxWidth] = useState(500);
  const [boxHight, setBoxHight] = useState(230);
  const [boxX, setBoxX] = useState(width - boxWidth - marginXY);
  // const [boxY, setBoxY] = useState(height - boxHight - marginXY);
  const [boxY, setBoxY] = useState(appearance);
  const windowRef = useRef<Rnd>();

  useEffect(() => {
    dispatch(fetchAllAppearance());
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
      minWidth={`${minWidth}px`}
      minHeight={`${minHeight}px`}
    >
      <Box
        boxShadow="base"
        border="1px"
        borderColor="gray.300"
        bgColor="rgba(195, 236, 82, 0.95)"
        rounded="md"
        w={boxWidth}
        h={boxHight}
        overflow="auto"
      >
        {JSON.stringify(appearance)}
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
      </Box>
    </Rnd>
  );
};
export default RndView;
