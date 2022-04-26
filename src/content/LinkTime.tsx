import { Box, ButtonGroup, Button } from "@chakra-ui/react";
import React from "react";

const mockTimes = [
  {
    timeId: "all",
    unit: "a",
    number: 0,
  },
  {
    timeId: "y3",
    unit: "y",
    number: 3,
  },
  {
    timeId: "w1",
    unit: "w",
    number: 1,
  },
];

function get_name(unit: string, number: Number): string {
  if (unit === "a") {
    return "all";
  }
  return number + " " + unit;
}

const LinkTime: React.VFC = () => {
  return (
    <Box>
      <ButtonGroup size="sm" isAttached variant="outline" colorScheme="cyan">
        {mockTimes.map((time) => (
          <Button
            key={time.timeId}
            href="https://www.google.com/search?q=kerry"
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
