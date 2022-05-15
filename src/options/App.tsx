import TimesTab from "../features/times/TimesTab";
import {
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Box,
} from "@chakra-ui/react";
import React from "react";

const App: React.VFC = () => {
  return (
    <Box className="App" m="4">
      <Text fontSize="lg" my="2">
        Choomame
      </Text>
      <Tabs size="lg">
        <TabList>
          <Tab>Time</Tab>
          <Tab>Language</Tab>
          <Tab>Recipe</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <TimesTab />
          </TabPanel>
          <TabPanel>
            <p>language</p>
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
