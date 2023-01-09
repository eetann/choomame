import type { AppDispatch, RootState } from "../../app/store";
import { CustomLink } from "./customLinkSchema";
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
  VStack,
  HStack,
  Button,
} from "@chakra-ui/react";
import { AnyAction } from "@reduxjs/toolkit";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  RowData,
  useReactTable,
} from "@tanstack/react-table";
import React from "react";
import { HiOutlineTrash } from "react-icons/hi";
import {
  HiOutlineChevronDoubleLeft,
  HiOutlineChevronDoubleRight,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
} from "react-icons/hi2";
import { useDispatch, useSelector } from "react-redux";

declare module "@tanstack/table-core" {
  // eslint-disable-next-line unused-imports/no-unused-vars
  interface TableMeta<TData extends RowData> {
    removeCustomLink: (id: string) => Promise<AnyAction>;
    toggleCustomLink: (customLink: CustomLink) => Promise<AnyAction>;
    getListName: (list_id: string) => string;
  }
}

const columnHelper = createColumnHelper<CustomLink>();

const columns = [
  columnHelper.accessor("group", {
    cell: (info) => info.getValue(),
    header: "Group name",
    meta: {
      tdProps: {
        width: 48,
        wordBreak: "break-word",
      },
    },
  }),
  columnHelper.accessor("match", {
    cell: (info) => info.getValue(),
    header: "Match",
    meta: {
      tdProps: {
        width: 56,
        wordBreak: "break-word",
      },
    },
  }),
  columnHelper.accessor("name", {
    cell: (info) => info.getValue(),
    header: "Link name",
    meta: {
      tdProps: {
        width: 40,
        wordBreak: "break-word",
      },
    },
  }),
  columnHelper.accessor("url", {
    cell: (info) => {
      const url = info.getValue();
      return (
        <Link color="teal" href={url}>
          {url}
        </Link>
      );
    },
    header: "URL",
    meta: {
      tdProps: {
        width: 72,
        wordBreak: "break-word",
      },
    },
  }),
  columnHelper.accessor((row) => `${row.id}`, {
    id: "listName",
    cell: ({ getValue, table }) => {
      const id = getValue();
      const list_id = id.substring(0, id.indexOf("/"));
      return table.options.meta?.getListName(list_id);
    },
    meta: {
      thProps: {
        width: 36,
      },
    },
  }),
  columnHelper.accessor("enable", {
    cell: ({ row, table }) => {
      const customLink = row.original;
      if (customLink.id.startsWith("user/")) {
        return (
          <IconButton
            onClick={() => table.options.meta?.removeCustomLink(customLink.id)}
            fontSize="20"
            aria-label="Delete customLink"
            icon={<HiOutlineTrash />}
          />
        );
      }
      return (
        <Switch
          isChecked={customLink.enable}
          onChange={() => table.options.meta?.toggleCustomLink(customLink)}
          colorScheme="teal"
        />
      );
    },
    header: "",
    meta: {
      tdProps: {
        height: 14,
        pr: 1,
      },
    },
  }),
];

const CustomLinkTable: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const customLinks = useSelector(selectCustomLinks.selectAll);
  const customLinkList = useSelector(
    (state: RootState) => state.customLinkList.list
  );
  const table = useReactTable<CustomLink>({
    data: customLinks,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    meta: {
      removeCustomLink: (id: string) => dispatch(removeManyCustomLinks([id])),
      toggleCustomLink: (customLink: CustomLink) =>
        dispatch(toggleOneCustomLink(customLink)),
      getListName: (list_id: string) => customLinkList[list_id]?.name ?? "user",
    },
  });

  return (
    <VStack>
      <TableContainer rounded="md" boxShadow="xs" whiteSpace="normal">
        <Table variant="simple" layout="fixed" width="max-content">
          <Thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <Tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  const meta: any = header.column.columnDef.meta;
                  return (
                    <Th key={header.id} {...meta?.thProps}>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </Th>
                  );
                })}
              </Tr>
            ))}
          </Thead>
          <Tbody>
            {table.getRowModel().rows.map((row) => (
              <Tr key={row.id} minHeight="96">
                {row.getVisibleCells().map((cell) => {
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  const meta: any = cell.column.columnDef.meta;
                  return (
                    <Td key={cell.id} fontSize="md" py="1" {...meta?.tdProps}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </Td>
                  );
                })}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      <HStack>
        <IconButton
          aria-label="jump first page"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
          icon={<HiOutlineChevronDoubleLeft />}
          fontSize="20"
        />
        <IconButton
          aria-label="jump previous page"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          icon={<HiOutlineChevronLeft />}
          fontSize="20"
        />
        <Button fontWeight="normal">1</Button>
        <Button fontWeight="normal">2</Button>
        <Button fontWeight="normal">3</Button>
        <IconButton
          aria-label="jump next page"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          icon={<HiOutlineChevronRight />}
          fontSize="20"
        />
        <IconButton
          aria-label="jump last page"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
          icon={<HiOutlineChevronDoubleRight />}
          fontSize="20"
        />
      </HStack>
    </VStack>
  );
};
export default CustomLinkTable;
