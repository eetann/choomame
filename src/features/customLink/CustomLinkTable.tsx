import type { AppDispatch } from "../../app/store";
import { selectCustomLinks } from "./customLinkSlice";
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

const CustomLinkTable: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const customLinks = useSelector(selectCustomLinks.selectAll);

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
            <Th>group name</Th>
            <Th>link name</Th>
            <Th>match</Th>
            <Th>URL</Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          {customLinks.map((customLink) => {
            return (
              <Tr key={customLink.id}>
                <Td fontSize="md" py="1" minWidth="48">
                  {customLink.group}
                </Td>
                <Td fontSize="md" py="1" minWidth="48">
                  {customLink.name}
                </Td>
                <Td fontSize="md" py="1" minWidth="48">
                  {customLink.match}
                </Td>
                <Td fontSize="md" py="1">
                  <Link color="teal">{customLink.url}</Link>
                </Td>
                <Td py="1" pr="1">
                  <IconButton
                    fontSize="20"
                    aria-label="toggle enable customLink"
                    icon={<HiOutlineTrash />}
                    // onClick={() => dispatch()}
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
export default CustomLinkTable;
