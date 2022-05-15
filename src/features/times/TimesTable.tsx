import type { AppDispatch } from "../../app/store";
import { removeOneTime, selectTimes, Time } from "./timesSlice";
import {
  TableContainer,
  Table,
  Tbody,
  Tr,
  Td,
  IconButton,
} from "@chakra-ui/react";
import React from "react";
import { HiOutlineTrash } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";

const TimesTable: React.VFC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const times = useSelector(selectTimes.selectAll);

  return (
    <TableContainer rounded="md" boxShadow="xs" maxW="min-content">
      <Table variant="simple">
        <Tbody>
          {times.reduce((prev_array: JSX.Element[], time: Time) => {
            if (time.timeId === "Any") {
              return prev_array;
            }
            prev_array.push(
              <Tr key={time.timeId}>
                <Td fontSize="md" py="1">
                  {time.number.toString() + " " + time.unit}
                </Td>
                <Td py="2">
                  <IconButton
                    fontSize="24"
                    aria-label="Delete time"
                    icon={<HiOutlineTrash />}
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
