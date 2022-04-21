import { useEffect, useRef, useState } from "react";
import { Rnd } from "react-rnd";
import { useWindowSize } from "react-use";

function App() {
  const { width, height } = useWindowSize();
  const [boxWidth, setBoxWidth] = useState(200);
  const [boxHight, setBoxHight] = useState(40);
  const [boxX, setBoxX] = useState(width - boxWidth - 20);
  const [boxY, setBoxY] = useState(height - boxHight - 20);
  const windowRef = useRef<Rnd>();

  useEffect( () => {
    setBoxX(width - boxWidth - 20);
    setBoxY(height - boxHight - 20);
    windowRef.current?.updatePosition({
      x: boxX,
      y: boxY,
    });
  }, [width, height] )
  return (
    <Rnd
      ref={(c) => {if (c) windowRef.current = c}}
      className="bg-blue-200"
      default={{
        x: boxX,
        y: boxY,
        width: boxWidth,
        height: boxHight,
      }}
    >
      <div className="shadow-lg bg-red-100">hogehhhhhhhhhh</div>
    </Rnd>
  );
}
export default App;
