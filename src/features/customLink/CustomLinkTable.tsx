import type { AppDispatch } from "../../app/store";
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
} from "@chakra-ui/react";
import { AnyAction } from "@reduxjs/toolkit";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  RowData,
  useReactTable,
} from "@tanstack/react-table";
import React from "react";
import { HiOutlineTrash } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";

declare module "@tanstack/table-core" {
  // eslint-disable-next-line unused-imports/no-unused-vars
  interface TableMeta<TData extends RowData> {
    removeCustomLink: (id: string) => Promise<AnyAction>;
    toggleCustomLink: (customLink: CustomLink) => Promise<AnyAction>;
  }
}

const columnHelper = createColumnHelper<CustomLink>();

const columns = [
  columnHelper.accessor("group", {
    cell: (info) => info.getValue(),
    header: "Group name",
    meta: {
      props: {
        minWidth: 48,
        maxWidth: 64,
      },
    },
  }),
  columnHelper.accessor("match", {
    cell: (info) => info.getValue(),
    header: "Match",
    meta: {
      props: {
        minWidth: 48,
        maxWidth: 64,
      },
    },
  }),
  columnHelper.accessor("name", {
    cell: (info) => info.getValue(),
    header: "Link name",
    meta: {
      props: {
        minWidth: 48,
        maxWidth: 64,
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
      props: {
        minWidth: 48,
        maxWidth: 80,
      },
    },
  }),
  // TODO: Listの名前も書く
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
      props: {
        height: 14,
        pr: 1,
      },
    },
  }),
];

const CustomLinkTable: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const customLinks = useSelector(selectCustomLinks.selectAll);
  const table = useReactTable<CustomLink>({
    data: customLinks,
    columns,
    getCoreRowModel: getCoreRowModel(),
    meta: {
      removeCustomLink: (id: string) => dispatch(removeManyCustomLinks([id])),
      toggleCustomLink: (customLink: CustomLink) =>
        dispatch(toggleOneCustomLink(customLink)),
    },
  });

  return (
    <TableContainer
      rounded="md"
      boxShadow="xs"
      maxW="min-content"
      whiteSpace="normal"
    >
      <Table variant="simple" width="80%">
        <Thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <Tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <Th key={header.id}>
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </Th>
              ))}
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
                  <Td key={cell.id} fontSize="md" py="1" {...meta?.props}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Td>
                );
              })}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};
export default CustomLinkTable;
