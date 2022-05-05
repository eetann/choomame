import type { AppDispatch } from "../../app/store";
import {
  setAllTimes,
} from "./timesSlice";
import {
  Box,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import TimesTable from "./TimesTable";

const TimesTab: React.VFC = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(setAllTimes());
  }, [dispatch]);

  return (
    <Box>
      <TimesTable />
    </Box>
  );
};
export default TimesTab;
