import { getLink } from "../../common/getLink";
import { Param } from "../param/param";
import { getTimes, sortTimes } from "./times";
import { getTimeText, Time } from "./timesSchema";
import { Box, ButtonGroup, Button } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

type Props = {
  param: Param;
};

const TimesLink: React.FC<Props> = ({ param }) => {
  const [times, setTimes] = useState<Time[]>([]);
  const [selectedId, setSelectedId] = useState("");

  useEffect(() => {
    (async () => {
      const ts = await getTimes();
      setTimes(Object.values(ts).sort((a, b) => sortTimes(a, b)));
    })();
  }, []);

  useEffect(() => {
    if (typeof param.tbs !== "undefined") {
      if ("qdr" in param.tbs) {
        setSelectedId(param.tbs.qdr);
      } else if (!("cdr" in param.tbs)) {
        setSelectedId("Any");
      }
    }
  }, [param.tbs]);

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
        {times.map((time) => {
          let selected = false;
          if (time.timeId === selectedId) {
            selected = true;
          } else if (
            time.number === 1 &&
            time.timeId.charAt(0) === selectedId
          ) {
            selected = true;
          }
          return (
            <Button
              key={time.timeId}
              href={getLink(param, time)}
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
              {getTimeText(time.unit, time.number)}
            </Button>
          );
        })}
      </ButtonGroup>
    </Box>
  );
};
export default TimesLink;
