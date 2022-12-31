import type { AppDispatch } from "../../app/store";
import ResetButton from "../../common/ResetButton";
import TimesForm from "./TimesForm";
import TimesTable from "./TimesTable";
import { fetchAllTimes, initTimes } from "./timesSlice";
import { Stack } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

const TimesTab: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchAllTimes());
  }, [dispatch]);

  return (
    <Stack spacing="10">
      <TimesForm />
      <TimesTable />
      <ResetButton name="Time" action={initTimes} />
    </Stack>
  );
};
export default TimesTab;
