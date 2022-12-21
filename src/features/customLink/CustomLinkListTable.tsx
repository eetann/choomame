import type { AppDispatch, RootState } from "../../app/store";
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

const CustomLinkListTable: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const customLinkList = useSelector(
    (state: RootState) => state.customLinkList.list
  );

  return (
    <TableContainer rounded="md" boxShadow="xs" maxW="min-content">
      <Table variant="simple">
        <Tbody>
          {/* TODO: ヘッダーを表示する */}
          {Object.keys(customLinkList).map((list_id) => {
            const list = customLinkList[list_id];
            return (
              <Tr key={list_id}>
                <Td fontSize="md" py="1">
                  {list.name}
                </Td>
                <Td fontSize="md" py="1">
                  {/* TODO: リンク化し、文字列全体はツールチップで表示する */}
                  {list.url}
                </Td>
                <Td py="1" pr="1">
                  <IconButton
                    fontSize="20"
                    aria-label="Delete time"
                    icon={<HiOutlineTrash />}
                    // onClick={() => dispatch(removeOneTime(time.timeId))}
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
