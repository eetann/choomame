import { getLink } from "../../common/getLink";
import { Param } from "../param/paramSlice";
import { fetchLanguages, Language, languagesKeyValue } from "./languagesSlice";
import { Box, ButtonGroup, Button } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

type Props = {
  param: Param;
};

const LanguagesLink: React.FC<Props> = ({ param }) => {
  const [languages, setLanguages] = useState<Language[]>([]);

  useEffect(() => {
    (async () => {
      const langs = await fetchLanguages();
      setLanguages(langs);
    })();
  }, []);

  return (
    <Box
      overflowX="auto"
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
              key={language}
              href={getLink(param, undefined, language)}
              as="a"
              fontWeight="medium"
              px="2"
              variant="ghost"
              backgroundColor={selected ? "blackAlpha.50" : "whiteAlpha.700"}
              color={selected ? "purple" : "teal"}
              _visited={{
                color: "purple",
              }}
              _hover={{
                backgroundColor: "blackAlpha.50",
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
