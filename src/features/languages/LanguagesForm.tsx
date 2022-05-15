import type { AppDispatch, RootState } from "../../app/store";
import { addOneLanguage, Language, languagesKeyValue } from "./languagesSlice";
import { AddIcon } from "@chakra-ui/icons";
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  ButtonGroup,
  IconButton,
  Select,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const LanguagesForm: React.VFC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [languageKey, setLanguageKey] = useState<Language | "">("");
  const languages = useSelector(
    (state: RootState) => state.languages.languages
  );

  const isError = languageKey === "" ? false : languages.includes(languageKey);

  return (
    <FormControl isInvalid={isError}>
      <FormLabel htmlFor="language">Add Language</FormLabel>
      <ButtonGroup>
        <Select
          placeholder="Select language"
          onChange={(e) => setLanguageKey(e.target.value as Language)}
        >
          {Object.keys(languagesKeyValue).reduce(
            (prev_array: JSX.Element[], key: string) => {
              if (key === "Any") {
                return prev_array;
              }
              if (languages.includes(key as Language)) {
                return prev_array;
              }
              prev_array.push(
                <option key={key} value={key}>
                  {languagesKeyValue[key as Language]}
                </option>
              );
              return prev_array;
            },
            []
          )}
        </Select>
        <IconButton
          aria-label="Add language"
          icon={<AddIcon />}
          onClick={() => {
            if (languageKey !== "Any" && languageKey !== "") {
              dispatch(addOneLanguage(languageKey));
              setLanguageKey("");
            }
          }}
          isDisabled={languageKey === "" || languages.includes(languageKey)}
        />
      </ButtonGroup>
      <FormHelperText>Select language.</FormHelperText>
      <FormErrorMessage>This language is already resisterd.</FormErrorMessage>
    </FormControl>
  );
};
export default LanguagesForm;
