import type { AppDispatch } from "../../app/store";
import ResetButton from "../../common/ResetButton";
import CustomLinkForm from "./CustomLinkForm";
import CustomLinkListForm from "./CustomLinkListForm";
import CustomLinkListTable, {
  IsUpdatingListContext,
} from "./CustomLinkListTable";
import CustomLinkTable from "./CustomLinkTable";
import {
  customLinkIsUpdatingBucket,
  isUpdatingCustomLink,
  setStartUpdatingCustomLink,
  setStopUpdatingCustomLink,
} from "./customLink";
import {
  fetchAllCustomLinkList,
  initCustomLinkAll,
  updateManyCustomLinkList,
} from "./customLinkListSlice";
import { fetchAllCustomLinks } from "./customLinkSlice";
import {
  Box,
  Button,
  Heading,
  HStack,
  Icon,
  Stack,
  StackDivider,
  Tooltip,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { HiOutlineLink, HiOutlineRefresh } from "react-icons/hi";
import {
  HiOutlineListBullet,
  HiOutlineQuestionMarkCircle,
} from "react-icons/hi2";
import { useDispatch } from "react-redux";

const CustomLinkTab: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [isUpdatingList, setIsUpdatingList] = useState(false);

  const setStartUpdatingList = () => {
    setIsUpdatingList(true);
  };
  const setStopUpdatingList = () => {
    setIsUpdatingList(false);
  };

  useEffect(() => {
    (async () => {
      const isUpdating = await isUpdatingCustomLink();
      if (isUpdating) {
        setStartUpdatingList();
      }
    })();
    customLinkIsUpdatingBucket.changeStream.subscribe((v) => {
      if (v.isUpdating?.newValue) {
        setStartUpdatingList();
      } else {
        setStopUpdatingList();
      }
    });
  }, []);

  useEffect(() => {
    dispatch(fetchAllCustomLinkList());
    dispatch(fetchAllCustomLinks());
  }, [dispatch]);

  return (
    <Stack divider={<StackDivider />} spacing="10">
      <IsUpdatingListContext.Provider
        value={{ isUpdatingList, setStartUpdatingList, setStopUpdatingList }}
      >
        <Stack alignItems="start">
          <HStack>
            <Icon as={HiOutlineListBullet} boxSize={5} />
            <Heading size="md">List</Heading>
            <Tooltip label="You can add a list of custom links. It is automatically and regularly updated.">
              <span>
                <Icon as={HiOutlineQuestionMarkCircle} boxSize={5} />
              </span>
            </Tooltip>
          </HStack>
          <HStack justifyContent="space-between" width="100%">
            <Button
              leftIcon={<HiOutlineRefresh />}
              colorScheme="teal"
              onClick={async () => {
                setStartUpdatingList();
                await setStartUpdatingCustomLink();
                await dispatch(updateManyCustomLinkList());
                await new Promise((s) => setTimeout(s, 3000));
                await setStopUpdatingCustomLink();
                setStopUpdatingList();
              }}
              isLoading={isUpdatingList}
              loadingText="Updating"
            >
              Manual Update
            </Button>
            <Box>
              <CustomLinkListForm />
            </Box>
          </HStack>
          <CustomLinkListTable />
        </Stack>
      </IsUpdatingListContext.Provider>
      <Stack>
        <HStack>
          <Icon as={HiOutlineLink} boxSize={5} />
          <Heading size="md">Links</Heading>
        </HStack>
        <HStack justifyContent="end">
          <Box>
            <CustomLinkForm />
          </Box>
        </HStack>
        <CustomLinkTable />
      </Stack>
      <ResetButton name="Custom Link" action={initCustomLinkAll} />
    </Stack>
  );
};
export default CustomLinkTab;
