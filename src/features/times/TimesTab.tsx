import type { AppDispatch } from "../../app/store";
import TimesForm from "./TimesForm";
import TimesReset from "./TimesReset";
import TimesTable from "./TimesTable";
import { fetchAllTimes } from "./timesSlice";
import { Stack } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

const TimesTab: React.VFC = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchAllTimes());
  }, [dispatch]);

  return (
    <Stack spacing="10">
      <TimesForm />
      <TimesTable />
      <TimesReset />
    </Stack>
  );
};
export default TimesTab;
