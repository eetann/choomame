import LanguagesLink from "../features/languages/LanguagesLink";
import { getParam, initialParam, Param } from "../features/param/param";
import TimesLink from "../features/times/TimesLink";
import RndView from "./RndView";
import ToolBar from "./ToolBar";
import { MinimumContext } from "./ToolBar";
import { Box, Center, Flex, Stack } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

const App: React.FC = () => {
  const [param, setParam] = useState<Param>(initialParam);
  const [minimum, setMinimum] = useState(false);
  const _param = getParam();
  const isBottomRight: boolean = _param.tbm === "isch" || _param.sidesearch;

  useEffect(() => {
    setParam(_param);
    // 画像検索かサイド検索時は最小化する
    if (isBottomRight) {
      setMinimum(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <MinimumContext.Provider value={{ minimum, setMinimum }}>
      <RndView isBottomRight={isBottomRight}>
        {minimum ? (
          <Box m="2">
            <ToolBar />
          </Box>
        ) : (
          <Stack m="2">
            <ToolBar />
            <Flex
              className="no-drag-area"
              cursor="auto"
              direction="column"
              height="fit-content"
              p="2"
              boxShadow="base"
              rounded="md"
              backgroundColor="whiteAlpha.700"
              backdropBlur="2xl"
            >
              <TimesLink param={param} />
              <LanguagesLink param={param} />
            </Flex>
          </Stack>
        )}
      </RndView>
    </MinimumContext.Provider>
  );
};
export default App;
