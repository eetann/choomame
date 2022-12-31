import type { AppDispatch, RootState } from "../../app/store";
import { removeOneCustomLinkList } from "./customLinkListSlice";
import {
  TableContainer,
  Table,
  Tbody,
  Tr,
  Td,
  IconButton,
  Thead,
  Th,
  Link,
} from "@chakra-ui/react";
import React from "react";
import { HiOutlineTrash } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";

const CustomLinkListTable: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const customLinkList = useSelector(
    (state: RootState) => state.customLinkList.list
  );

  return (
    <TableContainer
      rounded="md"
      boxShadow="xs"
      maxW="min-content"
      whiteSpace="normal"
    >
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>URL</Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          {Object.keys(customLinkList).map((list_id) => {
            const list = customLinkList[list_id];
            return (
              <Tr key={list_id}>
                <Td fontSize="md" py="1" minWidth="36">
                  {list.name}
                </Td>
                <Td fontSize="md" py="1">
                  <Link color="teal" href={list.url}>
                    {list.url}
                  </Link>
                </Td>
                <Td py="1" pr="1" height="14">
                  <IconButton
                    fontSize="20"
                    aria-label="Delete custom link list"
                    icon={<HiOutlineTrash />}
                    onClick={() => dispatch(removeOneCustomLinkList(list_id))}
                  />
                </Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </TableContainer>
  );
};
export default CustomLinkListTable;
