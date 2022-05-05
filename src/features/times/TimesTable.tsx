import type { AppDispatch } from "../../app/store";
import {
  removeOneTime,
  selectAllTimes,
  Time,
} from "./timesSlice";
import { DeleteIcon } from "@chakra-ui/icons";
import {
  TableContainer,
  Table,
  Tbody,
  Tr,
  Td,
  IconButton,
} from "@chakra-ui/react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

const TimesTable: React.VFC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const times = useSelector(selectAllTimes);

  return (
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
  );
};
export default TimesTable;
