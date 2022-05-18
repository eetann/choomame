import LanguagesTab from "../features/languages/LanguagesTab";
import TimesTab from "../features/times/TimesTab";
import {
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Box,
  Icon,
} from "@chakra-ui/react";
import React from "react";
import {
  HiOutlineBan,
  HiOutlineClock,
  HiOutlineTranslate,
} from "react-icons/hi";

const App: React.VFC = () => {
  return (
    <Box className="App" m="4">
      <Text fontSize="lg" my="2">
        Choomame
      </Text>
      <Tabs size="lg">
        <TabList>
          <Tab>
            <Icon as={HiOutlineClock} mr="1" />
            Time
          </Tab>
          <Tab>
            <Icon as={HiOutlineTranslate} mr="1" />
            Language
          </Tab>

          <Tab isDisabled>
            <Icon as={HiOutlineBan} mr="1" />
            Recipe
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <TimesTab />
          </TabPanel>
          <TabPanel>
            <LanguagesTab />
          </TabPanel>
          <TabPanel>
            <p>recipe</p>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default App;
