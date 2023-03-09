import AppearanceArea from "../features/appearance/AppearanceArea";
import CustomLinkTab from "../features/customLink/CustomLinkTab";
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
  Link,
  Spacer,
} from "@chakra-ui/react";
import React from "react";
import {
  HiOutlineLink,
  HiOutlineClock,
  HiOutlineTranslate,
} from "react-icons/hi";
import { HiStar } from "react-icons/hi2";

const App: React.FC = () => {
  return (
    <VStack className="App" m="4" align="start" spacing="8">
      <HStack width="full">
        <Image boxSize="36px" src="/icons/icon-32x32.png" />
        <Text fontSize="lg" my="2">
          Choomame
        </Text>
        <Spacer />
        <Text fontSize="md" color="teal">
          <Link
            href="https://chrome.google.com/webstore/detail/lecnbgonlcmmpkpnngbofggjiccbnokn/reviews"
            isExternal
          >
            <Icon as={HiStar} mr="1" />
            You can leave a review here if you like!
            <Icon as={HiStar} mr="1" />
          </Link>
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
          <Tab>
            <Icon as={HiOutlineLink} mr="1" />
            Custom Link
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
            <CustomLinkTab />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </VStack>
  );
};

export default App;
