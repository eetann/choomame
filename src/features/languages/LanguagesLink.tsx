import type { AppDispatch, RootState } from "../../app/store";
import { Param } from "../param/paramSlice";
import { Language, fetchLanguages, languagesTable } from "./languagesSlice";
import { Box, ButtonGroup, Button } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

function get_link(param: Param, language: Language) {
  let link = param.qLink;
  if (language !== "Any") {
    link += "&lr=" + language;
  }
  if (param.tbs) {
    link += "&tbs=" + param.tbs;
  }
  if (param.tbm) {
    link += "&tbm=" + param.tbm;
  }
  return link;
}

const LanguagesLink: React.VFC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const param = useSelector((state: RootState) => state.param);
  const languages = useSelector(
    (state: RootState) => state.languages.languages
  );

  useEffect(() => {
    dispatch(fetchLanguages());
  }, [dispatch]);

  return (
    <Box
      overflowX="auto"
      pb="2"
      sx={{
        "--scrollbarBG": "#CFD8DC",
        "--thumbBG": "#90A4AE",
        "&::-webkit-scrollbar": {
          height: "8px",
        },
        "&::-webkit-scrollbar-track": {
          height: "10px",
          background: "var(--scrollbarBG)",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "var(--thumbBG)",
          borderRadius: "12px",
          border: "2px solid var(--scrollbarBG)",
        },
      }}
    >
      <ButtonGroup size="sm" isAttached>
        {languages.map((language) => (
          <Button
            colorScheme="teal"
            variant="outline"
            bgColor={
              (language === "Any" && param.lr === "") || language === param.lr
                ? "purple.50"
                : ""
            }
            key={language}
            href={get_link(param, language)}
            as="a"
            fontWeight="medium"
            px="2"
          >
            {languagesTable[language]}
          </Button>
        ))}
      </ButtonGroup>
    </Box>
  );
};
export default LanguagesLink;