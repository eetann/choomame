import type { AppDispatch } from "../../app/store";
import TimesForm from "./TimesForm";
import TimesTable from "./TimesTable";
import { setAllTimes } from "./timesSlice";
import { Box } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

const TimesTab: React.VFC = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(setAllTimes());
  }, [dispatch]);

  return (
    <Box>
      <TimesForm />
      <TimesTable />
    </Box>
  );
};
export default TimesTab;
