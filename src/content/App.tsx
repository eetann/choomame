import { useEffect, useRef, useState } from "react";
import { Rnd } from "react-rnd";
import { useWindowSize } from "react-use";

function App() {
  const { width, height } = useWindowSize();
  const [boxWidth, setBoxWidth] = useState(400);
  const [boxHight, setBoxHight] = useState(100);
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
      className="shadow-lg"
      default={{
        x: boxX,
        y: boxY,
        width: boxWidth,
        height: boxHight,
      }}
      onResizeStop={(_, __, ref) => {
        setBoxWidth(parseInt(ref.style.width, 10));
        setBoxHight(parseInt(ref.style.height, 10));
      }}
      onDragStop={(_, data) => {
        setBoxX(data.x);
        setBoxY(data.y);
      }}
    >
      <p className="text-3xl">hogehhhhhhhhhh</p>
      <progress className="progress w-56" value="40" max="100"></progress>
      <div>
        When controlling the flow of text, using the CSS property
        <span className="inline">display: inline</span>
        will cause the text inside the element to wrap normally. While using the
        property <span className="inline-block">display: inline-block</span>
        will wrap the element to prevent the text inside from extending beyond
        its parent. Lastly, using the property{" "}
        <span className="block">display: block</span>
        will put the element on its own line and fill its parent.
      </div>
    </Rnd>
  );
}
export default App;
