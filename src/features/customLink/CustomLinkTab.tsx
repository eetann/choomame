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
  Card,
  CardBody,
  Heading,
  HStack,
  Icon,
  Stack,
  StackDivider,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { HiOutlineLink } from "react-icons/hi";
import { HiOutlineListBullet } from "react-icons/hi2";
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
        <Card>
          <CardBody>
            <CustomLinkForm />
          </CardBody>
        </Card>
        <CustomLinkTable />
      </Stack>
      <ResetButton name="Custom Link" action={initCustomLinkAll} />
    </Stack>
  );
};
export default CustomLinkTab;
