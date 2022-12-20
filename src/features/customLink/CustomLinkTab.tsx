import type { AppDispatch } from "../../app/store";
import { fetchAllCustomLinkList } from "./customLinkListSlice";
import { fetchAllCustomLinkItems } from "./customLinkItemSlice";
import { Stack } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

const CustomLinkTab: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchAllCustomLinkList());
    dispatch(fetchAllCustomLinkItems());
  }, [dispatch]);

  return (
    <Stack spacing="10">
    </Stack>
  );
};
export default CustomLinkTab;
