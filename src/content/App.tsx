import { Rnd } from "react-rnd";

function App() {
  return (
    <Rnd
      className="bg-blue-200"
      default={{
        x: 0,
        y: 0,
        width: 320,
        height: 200,
      }}
    >
      <div className="shadow-lg bg-red-100">hogehhhhhhhhhh</div>
    </Rnd>
  );
}
export default App;
