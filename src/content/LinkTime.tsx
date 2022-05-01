import { RootState } from "../app/store";
import { Param } from "../features/param/paramSlice";
import { Time, selectAllTimes, getAllTimes } from "../features/time/timeSlice";
import { Box, ButtonGroup, Button } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

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
  const dispatch = useDispatch();
  const param = useSelector((state: RootState) => state.param);
  const times = useSelector(selectAllTimes);

  useEffect( () => {
    dispatch(getAllTimes());
  }, []);

  return (
    <Box>
      <ButtonGroup size="sm" isAttached>
        {times.map((time) => (
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
