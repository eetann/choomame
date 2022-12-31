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
import { Card, CardBody, Heading, Stack, StackDivider } from "@chakra-ui/react";
import React, { useEffect } from "react";
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
        <Heading size="md">List</Heading>
        <Card>
          <CardBody>
            <CustomLinkListForm />
          </CardBody>
        </Card>
        <CustomLinkListTable />
      </Stack>
      <Stack>
        <Heading size="md">Custom Links</Heading>
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
