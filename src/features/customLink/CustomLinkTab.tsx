import type { AppDispatch } from "../../app/store";
import ResetButton from "../../common/ResetButton";
import CustomLinkCollectionForm from "./CustomLinkCollectionForm";
import CustomLinkCollectionTable, {
  WhereUpdatingCollectionContext,
  WhereUpdatingCollectionContextType,
} from "./CustomLinkCollectionTable";
import CustomLinkItemForm from "./CustomLinkItemForm";
import CustomLinkItemTable from "./CustomLinkItemTable";
import {
  importUserCustomLink,
  isBackgroundUpdatingBucket,
  isBackgroundUpdatingCustomLink,
  useExportUserCustomLinks,
} from "./customLink";
import {
  fetchAllCustomLinkCollection,
  initCustomLinkAll,
  restoreCustomLink,
  updateManyCustomLinkCollection,
} from "./customLinkCollectionSlice";
import {
  addManyCustomLinkItem,
  fetchAllCustomLinkItem,
} from "./customLinkItemSlice";
import { CustomLinkRestoreJson } from "./customLinkSchema";
import {
  Box,
  Button,
  Heading,
  HStack,
  Icon,
  Spacer,
  Stack,
  StackDivider,
  Tooltip,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import {
  HiOutlineDownload,
  HiOutlineLink,
  HiOutlineRefresh,
  HiOutlineUpload,
} from "react-icons/hi";
import {
  HiOutlineListBullet,
  HiOutlineQuestionMarkCircle,
} from "react-icons/hi2";
import { useDispatch } from "react-redux";

const CustomLinkTab: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [whereUpdatingCollection, setWhereUpdatingCollection] =
    useState<WhereUpdatingCollectionContextType["whereUpdatingCollection"]>("");
  const exportUserCustomLinks = useExportUserCustomLinks();
  const addCustomLinks = async (
    customLinkBackupJson: CustomLinkRestoreJson
  ) => {
    await dispatch(
      addManyCustomLinkItem({
        items: customLinkBackupJson.items,
        collectionId: customLinkBackupJson.id,
      })
    );
    await dispatch(restoreCustomLink(customLinkBackupJson));
  };

  useEffect(() => {
    isBackgroundUpdatingBucket.changeStream.subscribe(async (v) => {
      if (v.customLink?.newValue) {
        setWhereUpdatingCollection("Background");
      } else {
        await new Promise((s) => setTimeout(s, 3000));
        setWhereUpdatingCollection("");
      }
    });
    (async () => {
      const isBackgroundUpdating = await isBackgroundUpdatingCustomLink();
      if (isBackgroundUpdating) {
        setWhereUpdatingCollection("Background");
      }
    })();
  }, []);

  useEffect(() => {
    dispatch(fetchAllCustomLinkCollection());
    dispatch(fetchAllCustomLinkItem());
  }, [dispatch]);

  return (
    <Stack divider={<StackDivider />} spacing="10">
      <WhereUpdatingCollectionContext.Provider
        value={{
          whereUpdatingCollection: whereUpdatingCollection,
        }}
      >
        <Stack alignItems="start">
          <HStack>
            <Icon as={HiOutlineListBullet} boxSize={5} />
            <Heading size="md">Collection</Heading>
            <Tooltip label="You can add a collection of custom links. It is automatically and regularly updated.">
              <Box as="span" lineHeight="1">
                <Icon as={HiOutlineQuestionMarkCircle} boxSize={5} />
              </Box>
            </Tooltip>
          </HStack>
          <HStack justifyContent="space-between" width="100%">
            <Button
              leftIcon={<HiOutlineRefresh fontSize="24" />}
              colorScheme="teal"
              onClick={async () => {
                setWhereUpdatingCollection("Manual");
                await dispatch(updateManyCustomLinkCollection());
                await new Promise((s) => setTimeout(s, 3000));
                setWhereUpdatingCollection("");
              }}
              isLoading={whereUpdatingCollection !== ""}
              loadingText={`${whereUpdatingCollection} Updating`}
            >
              Manual Update
            </Button>
            <Box>
              <CustomLinkCollectionForm />
            </Box>
          </HStack>
          <CustomLinkCollectionTable />
        </Stack>
      </WhereUpdatingCollectionContext.Provider>
      <Stack>
        <HStack>
          <Icon as={HiOutlineLink} boxSize={5} />
          <Heading size="md">Items</Heading>
        </HStack>
        <HStack justifyContent="space-between">
          <Spacer />
          <Box>
            <CustomLinkItemForm />
          </Box>
        </HStack>
        <CustomLinkItemTable />
      </Stack>
      <HStack justifyContent="space-between">
        <Button
          leftIcon={<HiOutlineDownload fontSize="24" />}
          colorScheme="teal"
          onClick={() => exportUserCustomLinks()}
        >
          Export
        </Button>
        <Button
          leftIcon={<HiOutlineUpload fontSize="24" />}
          colorScheme="teal"
          onClick={async () => {
            await importUserCustomLink(addCustomLinks);
          }}
        >
          Import
        </Button>
        <Spacer />
        <ResetButton name="Custom Link" action={initCustomLinkAll} />
      </HStack>
    </Stack>
  );
};
export default CustomLinkTab;
