import type { AppDispatch } from "../../app/store";
import {
  removeOneTime,
  selectAllTimes,
  setAllTimes,
  Time,
} from "./timesSlice";
import { DeleteIcon } from "@chakra-ui/icons";
import {
  Box,
  TableContainer,
  Table,
  Tbody,
  Tr,
  Td,
  IconButton,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const TimesTab: React.VFC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const times = useSelector(selectAllTimes);

  useEffect(() => {
    dispatch(setAllTimes());
  }, [dispatch]);

  return (
    <Box>
      <TableContainer rounded="lg" boxShadow="xs" maxW="min-content">
        <Table variant="simple">
          <Tbody>
            {times.reduce((prev_array: JSX.Element[], time: Time) => {
              if (time.timeId === "all") {
                return prev_array;
              }
              prev_array.push(
                <Tr key={time.timeId}>
                  <Td fontSize="md">
                    {time.number.toString() + " " + time.unit}
                  </Td>
                  <Td>
                    <IconButton
                      aria-label="Delete time"
                      icon={<DeleteIcon />}
                      onClick={() => dispatch(removeOneTime(time.timeId))}
                    />
                  </Td>
                </Tr>
              );
              return prev_array;
            }, [])}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};
export default TimesTab;
