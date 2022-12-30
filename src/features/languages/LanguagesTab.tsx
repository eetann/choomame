import type { AppDispatch } from "../../app/store";
import ResetButton from "../../common/ResetButton";
import LanguagesForm from "./LanguagesForm";
import LanguagesTable from "./LanguagesTable";
import { fetchLanguages, initLanguages } from "./languagesSlice";
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
      <ResetButton name="Language" action={initLanguages} />
    </Stack>
  );
};
export default LanguagesTab;
