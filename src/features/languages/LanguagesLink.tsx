import type { AppDispatch, RootState } from "../../app/store";
import { getLink } from "../../common/getLink";
import { fetchLanguages, languagesKeyValue } from "./languagesSlice";
import { Box, ButtonGroup, Button } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

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
        {languages.map((language) => {
          const selected =
            (language === "Any" && param.lr === "") || language === param.lr;
          return (
            <Button
              variant="outline"
              key={language}
              href={getLink(param, undefined, language)}
              as="a"
              fontWeight="medium"
              px="2"
              backgroundColor={selected ? "gray.100" : "white"}
              color={selected ? "purple" : "teal"}
              _visited={{
                color: "purple",
              }}
            >
              {languagesKeyValue[language]}
            </Button>
          );
        })}
      </ButtonGroup>
    </Box>
  );
};
export default LanguagesLink;
