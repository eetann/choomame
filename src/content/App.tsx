import { Box, Text } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { Rnd } from "react-rnd";
import { useWindowSize } from "react-use";

function App() {
  const { width, height } = useWindowSize();
  const [boxWidth, setBoxWidth] = useState(500);
  const [boxHight, setBoxHight] = useState(400);
  const [boxX, setBoxX] = useState(width - boxWidth - 20);
  const [boxY, setBoxY] = useState(height - boxHight - 20);
  const windowRef = useRef<Rnd>();

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
        </Box>
      </Box>
    </Rnd>
  );
}
export default App;
