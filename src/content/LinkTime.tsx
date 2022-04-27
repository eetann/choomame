import { RootState } from "../app/store";
import { Param } from "../features/param/paramSlice";
import { Time } from "../features/time/timeSlice";
import { Box, ButtonGroup, Button } from "@chakra-ui/react";
import React from "react";
import { useSelector } from "react-redux";

const mockTimes = [
  {
    timeId: "all",
    unit: "all",
    number: 0,
  },
  {
    timeId: "y3",
    unit: "year",
    number: 3,
  },
  {
    timeId: "y1",
    unit: "year",
    number: 1,
  },
  {
    timeId: "m6",
    unit: "month",
    number: 6,
  },
  {
    timeId: "m1",
    unit: "month",
    number: 1,
  },
  {
    timeId: "w1",
    unit: "week",
    number: 1,
  },
];

function get_name(unit: string, number: Number): string {
  if (unit === "all") {
    return "all";
  }
  return number + " " + unit;
}

function get_link(param: Param, time: Time) {
  let link = param.qLink;
  if (time.timeId != "all") {
    link += "&tbs=qdr:" + time.timeId;
  }
  if (param.tbm) {
    link += "&tbm=" + param.tbm;
  }
  if (param.lr) {
    link += "&lr=" + param.lr;
  }
  return link;
}

const LinkTime: React.VFC = () => {
  const param = useSelector((state: RootState) => state.param);
  return (
    <Box>
      <ButtonGroup size="sm" isAttached>
        {mockTimes.map((time) => (
          <Button
            variant={time.timeId === param.tbs.slice(4) ? "solid" : "outline"}
            key={time.timeId}
            href={get_link(param, time)}
            as="a"
            fontWeight="normal"
            px="2"
          >
            {get_name(time.unit, time.number)}
          </Button>
        ))}
      </ButtonGroup>
    </Box>
  );
};
export default LinkTime;
