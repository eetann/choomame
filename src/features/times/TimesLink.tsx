import type { AppDispatch, RootState } from "../../app/store";
import { Param } from "../param/paramSlice";
import { Time, selectTimes, fetchAllTimes, TimesUnit } from "./timesSlice";
import { Box, ButtonGroup, Button } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

function get_name(unit: TimesUnit, number: number): string {
  if (unit === "Any") {
    return "Any";
  }
  return number + " " + unit;
}

function get_link(param: Param, time: Time) {
  let link = param.qLink;
  if (time.timeId !== "Any") {
    link += "&tbs=" + "qdr:" + time.timeId;
  }
  if (param.tbm) {
    link += "&tbm=" + param.tbm;
  }
  if (param.lr) {
    link += "&lr=" + param.lr;
  }
  return link;
}

const TimesLink: React.VFC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const param = useSelector((state: RootState) => state.param);
  const times = useSelector(selectTimes.selectAll);

  useEffect(() => {
    dispatch(fetchAllTimes());
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
        {times.map((time) => {
          const selected =
            (time.timeId === "Any" && param.tbs === "") ||
            time.timeId === param.tbs.slice(4);
          return (
            <Button
              colorScheme="teal"
              variant="outline"
              key={time.timeId}
              href={get_link(param, time)}
              as="a"
              fontWeight="medium"
              px="2"
            >
              {selected ? (
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    width: 10,
                    height: 10,
                    backgroundColor: "purple",
                    clipPath: "polygon(65% 0, 100% 35%, 100% 0)",
                  }}
                />
              ) : (
                <></>
              )}
              {get_name(time.unit, time.number)}
            </Button>
          );
        })}
      </ButtonGroup>
    </Box>
  );
};
export default TimesLink;
