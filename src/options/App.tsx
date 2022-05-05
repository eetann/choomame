import TimesTab from "../features/times/TimesTab";
import {
  Heading,
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
      <Heading my="4">Choomame options page</Heading>
      <Tabs variant="enclosed" size="lg">
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
