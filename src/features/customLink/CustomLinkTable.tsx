import type { AppDispatch } from "../../app/store";
import {
  removeManyCustomLinks,
  selectCustomLinks,
  toggleOneCustomLink,
} from "./customLinkSlice";
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
  Switch,
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
      <Table variant="simple" width="80%">
        <Thead>
          <Tr>
            <Th>group name</Th>
            <Th>match</Th>
            <Th>link name</Th>
            <Th>URL</Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          {customLinks.map((customLink) => {
            return (
              <Tr key={customLink.id} minHeight="96">
                <Td fontSize="md" py="1" minWidth="48" maxWidth="64">
                  {customLink.group}
                </Td>
                <Td fontSize="md" py="1" minWidth="48" maxWidth="64">
                  {customLink.match}
                </Td>
                <Td fontSize="md" py="1" minWidth="48" maxWidth="64">
                  {customLink.name}
                </Td>
                <Td fontSize="md" py="1" minWidth="48" maxWidth="80">
                  <Link color="teal" href={customLink.url}>
                    {customLink.url}
                  </Link>
                </Td>
                <Td py="1" pr="1" height="14">
                  {customLink.id.startsWith("user/") ? (
                    <IconButton
                      onClick={() =>
                        dispatch(removeManyCustomLinks([customLink.id]))
                      }
                      fontSize="20"
                      aria-label="Delete customLink"
                      icon={<HiOutlineTrash />}
                    />
                  ) : (
                    <Switch
                      isChecked={customLink.enable}
                      onChange={() => dispatch(toggleOneCustomLink(customLink))}
                      colorScheme="teal"
                    />
                  )}
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
