import type { AppDispatch } from "../../app/store";
import CustomLinkListTable from "./CustomLinkListTable";
import CustomLinkTable from "./CustomLinkTable";
import { fetchAllCustomLinkList } from "./customLinkListSlice";
import { fetchAllCustomLinks } from "./customLinkSlice";
import { Stack } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

const CustomLinkTab: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchAllCustomLinkList());
    dispatch(fetchAllCustomLinks());
  }, [dispatch]);

  return (
    <Stack spacing="10">
      <CustomLinkListTable />
      <CustomLinkTable />
    </Stack>
  );
};
export default CustomLinkTab;
