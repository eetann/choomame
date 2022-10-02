import type { AppDispatch } from "../../app/store";
import { fetchAllAppearance } from "./appearanceSlice";
import { Stack } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

const AppearanceArea: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchAllAppearance());
  }, [dispatch]);

  return (
    <Stack spacing="10">
    </Stack>
  );
};
export default AppearanceArea;
