import AppearanceArea from "../features/appearance/AppearanceArea";
import LanguagesTab from "../features/languages/LanguagesTab";
import TimesTab from "../features/times/TimesTab";
import {
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Icon,
  Image,
  HStack,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import {
  HiOutlineBan,
  HiOutlineClock,
  HiOutlineTranslate,
} from "react-icons/hi";

const App: React.FC = () => {
  return (
    <VStack className="App" m="4" align="start" spacing="8">
      <HStack>
        <Image boxSize="36px" src="/icons/icon-32x32.png" />
        <Text fontSize="lg" my="2">
          Choomame
        </Text>
      </HStack>
      <AppearanceArea />
      <Tabs colorScheme="teal">
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
    </VStack>
  );
};

export default App;
