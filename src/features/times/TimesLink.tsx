import type { AppDispatch, RootState } from "../../app/store";
import { getLink } from "../../common/getLink";
import { selectTimes, fetchAllTimes, TimesUnit } from "./timesSlice";
import { Box, ButtonGroup, Button } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

function get_name(unit: TimesUnit, number: number): string {
  if (unit === "Any") {
    return "Any";
  }
  return number + " " + unit;
}

const TimesLink: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const param = useSelector((state: RootState) => state.param);
  const times = useSelector(selectTimes.selectAll);

  useEffect(() => {
    dispatch(fetchAllTimes());
  }, [dispatch]);

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
          if ("qdr" in param.tbs) {
            if (time.timeId === param.tbs.qdr) {
              selected = true;
            } else if (
              time.number === 1 &&
              time.timeId.charAt(0) === param.tbs.qdr
            ) {
              selected = true;
            }
          } else {
            if (time.timeId === "Any") {
              selected = true;
            }
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
              {get_name(time.unit, time.number)}
            </Button>
          );
        })}
      </ButtonGroup>
    </Box>
  );
};
export default TimesLink;
