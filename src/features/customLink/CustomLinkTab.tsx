import type { AppDispatch } from "../../app/store";
import ResetButton from "../../common/ResetButton";
import CustomLinkForm from "./CustomLinkForm";
import CustomLinkListForm from "./CustomLinkListForm";
import CustomLinkListTable, {
  WhereUpdatingListContext,
  WhereUpdatingListContextType,
} from "./CustomLinkListTable";
import CustomLinkTable from "./CustomLinkTable";
import {
  isBackgroundUpdatingBucket,
  isBackgroundUpdatingCustomLink,
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
  const [whereUpdatingList, setWhereUpdatingList] =
    useState<WhereUpdatingListContextType["whereUpdatingList"]>("");

  useEffect(() => {
    (async () => {
      const isBackgroundUpdating = await isBackgroundUpdatingCustomLink();
      if (isBackgroundUpdating) {
        setWhereUpdatingList("Background");
      }
    })();
    isBackgroundUpdatingBucket.changeStream.subscribe(async (v) => {
      if (v.customLink?.newValue) {
        setWhereUpdatingList("Background");
      } else {
        await new Promise((s) => setTimeout(s, 3000));
        setWhereUpdatingList("");
      }
    });
  }, []);

  useEffect(() => {
    dispatch(fetchAllCustomLinkList());
    dispatch(fetchAllCustomLinks());
  }, [dispatch]);

  return (
    <Stack divider={<StackDivider />} spacing="10">
      <WhereUpdatingListContext.Provider
        value={{
          whereUpdatingList,
        }}
      >
        <Stack alignItems="start">
          <HStack>
            <Icon as={HiOutlineListBullet} boxSize={5} />
            <Heading size="md">List</Heading>
            <Tooltip label="You can add a list of custom links. It is automatically and regularly updated.">
              <Box as="span" lineHeight="1">
                <Icon as={HiOutlineQuestionMarkCircle} boxSize={5} />
              </Box>
            </Tooltip>
          </HStack>
          <HStack justifyContent="space-between" width="100%">
            <Button
              leftIcon={<HiOutlineRefresh />}
              colorScheme="teal"
              onClick={async () => {
                setWhereUpdatingList("Manual");
                await dispatch(updateManyCustomLinkList());
                await new Promise((s) => setTimeout(s, 3000));
                setWhereUpdatingList("");
              }}
              isLoading={whereUpdatingList !== ""}
              loadingText={`${whereUpdatingList} Updating`}
            >
              Manual Update
            </Button>
            <Box>
              <CustomLinkListForm />
            </Box>
          </HStack>
          <CustomLinkListTable />
        </Stack>
      </WhereUpdatingListContext.Provider>
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
