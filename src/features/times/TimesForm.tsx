import type { AppDispatch } from "../../app/store";
import {
  addOneTime,
  getTimeId,
  selectTimes,
  TimesUnit,
  timeUnitOrder,
} from "./timesSlice";
import { AddIcon } from "@chakra-ui/icons";
import {
  Box,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  ButtonGroup,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  IconButton,
  Select,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const TimesTable: React.VFC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [unit, setUnit] = useState<TimesUnit>("year");
  const [timesNumber, setTimesNumber] = useState<number>(0);
  const timesEntities = useSelector(selectTimes.selectEntities);

  const isError = timesEntities[getTimeId(unit, timesNumber)] !== undefined;

  return (
    <Box>
      <FormControl isInvalid={isError}>
        <FormLabel htmlFor="timeNumber">Time</FormLabel>
        <ButtonGroup>
          <NumberInput
            value={timesNumber}
            min={1}
            max={100}
            onChange={(_, valueAsNumber) => setTimesNumber(valueAsNumber)}
          >
            <NumberInputField id="timeNumber" />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          <Select
            value={unit}
            onChange={(e) => setUnit(e.target.value as TimesUnit)}
          >
            {Object.keys(timeUnitOrder).reduce(
              (prev_array: JSX.Element[], unit: string) => {
                if (unit === "all") {
                  return prev_array;
                }
                prev_array.push(
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                );
                return prev_array;
              },
              []
            )}
          </Select>
          <IconButton
            aria-label="Add time"
            icon={<AddIcon />}
            onClick={() => {
              dispatch(addOneTime({ unit, number: timesNumber }));
              setTimesNumber(0);
              setUnit("year");
            }}
            isDisabled={timesNumber <= 0 || isError}
          />
        </ButtonGroup>
        <FormHelperText>Write number and select unit.</FormHelperText>
        <FormErrorMessage>This Time is already resisterd.</FormErrorMessage>
      </FormControl>
    </Box>
  );
};
export default TimesTable;
