import type { AppDispatch } from "../../app/store";
import LanguagesForm from "./LanguagesForm";
import LanguagesReset from "./LanguagesReset";
import LanguagesTable from "./LanguagesTable";
import { fetchLanguages } from "./languagesSlice";
import { Stack } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

const LanguagesTab: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchLanguages());
  }, [dispatch]);

  return (
    <Stack spacing="10">
      <LanguagesForm />
      <LanguagesTable />
      <LanguagesReset />
    </Stack>
  );
};
export default LanguagesTab;
