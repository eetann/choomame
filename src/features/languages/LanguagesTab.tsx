import type { AppDispatch } from "../../app/store";
import LanguagesTable from "./LanguagesTable";
import { fetchLanguages } from "./languagesSlice";
import { Stack } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

const TimesTab: React.VFC = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchLanguages());
  }, [dispatch]);

  return (
    <Stack spacing="10">
      <LanguagesTable />
    </Stack>
  );
};
export default TimesTab;
