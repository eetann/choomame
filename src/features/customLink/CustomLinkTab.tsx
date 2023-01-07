import type { AppDispatch } from "../../app/store";
import ResetButton from "../../common/ResetButton";
import CustomLinkForm from "./CustomLinkForm";
import CustomLinkListForm from "./CustomLinkListForm";
import CustomLinkListTable from "./CustomLinkListTable";
import CustomLinkTable from "./CustomLinkTable";
import {
  fetchAllCustomLinkList,
  initCustomLinkAll,
} from "./customLinkListSlice";
import { fetchAllCustomLinks } from "./customLinkSlice";
import {
  Button,
  Heading,
  HStack,
  Icon,
  Stack,
  StackDivider,
  Tooltip,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { HiOutlineLink } from "react-icons/hi";
import {
  HiOutlineListBullet,
  HiOutlineQuestionMarkCircle,
} from "react-icons/hi2";
import { useDispatch } from "react-redux";

const CustomLinkTab: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchAllCustomLinkList());
    dispatch(fetchAllCustomLinks());
  }, [dispatch]);

  return (
    <Stack divider={<StackDivider />} spacing="10">
      <Stack>
        <HStack>
          <Icon as={HiOutlineListBullet} boxSize={5} />
          <Heading size="md">List</Heading>
          <Tooltip label="You can add a list of custom links. It is automatically and regularly updated.">
            <span>
              <Icon as={HiOutlineQuestionMarkCircle} boxSize={5} />
            </span>
          </Tooltip>
        </HStack>
        <HStack justifyContent="space-between">
          <Button>WIP</Button>
          <CustomLinkListForm />
        </HStack>
        <CustomLinkListTable />
      </Stack>
      <Stack>
        <HStack>
          <Icon as={HiOutlineLink} boxSize={5} />
          <Heading size="md">Links</Heading>
        </HStack>
        <HStack justifyContent="end">
          <CustomLinkForm />
        </HStack>
        <CustomLinkTable />
      </Stack>
      <ResetButton name="Custom Link" action={initCustomLinkAll} />
    </Stack>
  );
};
export default CustomLinkTab;
