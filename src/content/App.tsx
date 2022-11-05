import LanguagesLink from "../features/languages/LanguagesLink";
import { getParam, initialParam, Param } from "../features/param/param";
import TimesLink from "../features/times/TimesLink";
import RndView from "./RndView";
import ToolBar  from "./ToolBar";
import React, { useEffect, useState } from "react";
import { MinimumContext } from "./minimumContext";

const App: React.FC = () => {
  const [param, setParam] = useState<Param>(initialParam);
  const [minimum, setMinimum] = useState(false);

  useEffect(() => {
    setParam(getParam());
  }, []);

  return (
    <MinimumContext.Provider value={{ minimum, setMinimum }}>
      <RndView>
        <TimesLink param={param} />
        <LanguagesLink param={param} />
        <ToolBar />
      </RndView>
    </MinimumContext.Provider>
  );
};
export default App;
