import LanguagesLink from "../features/languages/LanguagesLink";
import { getParam, initialParam, Param } from "../features/param/paramSlice";
import TimesLink from "../features/times/TimesLink";
import RndView from "./RndView";
import React, { useEffect, useState } from "react";

const App: React.FC = () => {
  const [param, setParam] = useState<Param>(initialParam);

  useEffect(() => {
    setParam(getParam());
  }, []);

  return (
    <RndView>
      <TimesLink param={param} />
      <LanguagesLink param={param} />
    </RndView>
  );
};
export default App;
