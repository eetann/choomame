import LanguagesLink from "../features/languages/LanguagesLink";
import { getParam, initialParam, Param } from "../features/param/param";
import TimesLink from "../features/times/TimesLink";
import RndView from "./RndView";
import ToolBar from "./ToolBar";
import { MinimumContext } from "./ToolBar";
import { Center } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

const App: React.FC = () => {
  const [param, setParam] = useState<Param>(initialParam);
  const [minimum, setMinimum] = useState(false);

  useEffect(() => {
    const param = getParam();
    setParam(param);
    // 画像検索時は最小化する
    if (param.tbm === "isch") {
      setMinimum(true);
    }
  }, []);

  return (
    <MinimumContext.Provider value={{ minimum, setMinimum }}>
      <RndView>
        {minimum ? (
          <Center>
            <ToolBar />
          </Center>
        ) : (
          <>
            <TimesLink param={param} />
            <LanguagesLink param={param} />
            <ToolBar />
          </>
        )}
      </RndView>
    </MinimumContext.Provider>
  );
};
export default App;
