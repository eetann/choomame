import type { AppDispatch } from "../../app/store";
import { selectCustomLinkItems } from "./customLinkItemSlice";
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

const CustomLinkItemTable: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const customLinkItems = useSelector(selectCustomLinkItems.selectAll);

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
            <Th>Target</Th>
            <Th>hit</Th>
            <Th>kind</Th>
            <Th>URL</Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          {customLinkItems.map((item) =>
            item.links.map((customLink) => {
              return (
                <Tr key={item.id + customLink.kind}>
                  <Td fontSize="md" py="1" minWidth="48">
                    {item.target}
                  </Td>
                  <Td fontSize="md" py="1" minWidth="48">
                    {item.hit}
                  </Td>
                  <Td fontSize="md" py="1" minWidth="36">
                    {customLink.kind}
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
            })
          )}
        </Tbody>
      </Table>
    </TableContainer>
  );
};
export default CustomLinkItemTable;
