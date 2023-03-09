import type { AppDispatch, RootState } from "../../app/store";
import ReactTable, { ReactTableProps } from "../../common/ReactTable";
import { selectCustomLinkCollection } from "./customLinkCollectionSlice";
import {
  removeManyCustomLinkItem,
  selectCustomLinkItem,
  toggleOneCustomLinkItem,
} from "./customLinkItemSlice";
import { CustomLinkItem } from "./customLinkSchema";
import { IconButton, Link, Switch } from "@chakra-ui/react";
import { AnyAction } from "@reduxjs/toolkit";
import { ColumnDef, createColumnHelper, RowData } from "@tanstack/react-table";
import React from "react";
import { HiOutlineTrash } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";

declare module "@tanstack/table-core" {
  // eslint-disable-next-line unused-imports/no-unused-vars
  interface TableMeta<TData extends RowData> {
    removeCustomLink?: (id: string) => Promise<AnyAction>;
    toggleCustomLink?: (customLink: CustomLinkItem) => Promise<AnyAction>;
    getCollectionName?: (collectionId: string) => string;
  }
}

const columnHelper = createColumnHelper<CustomLinkItem>();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const columns: ColumnDef<CustomLinkItem, any>[] = [
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
    id: "collectionName",
    cell: ({ getValue, table }) => {
      const id = getValue();
      const collectionId = id.substring(0, id.indexOf("/"));
      return table.options.meta?.getCollectionName?.(collectionId);
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
            onClick={() =>
              table.options.meta?.removeCustomLink?.(customLink.id)
            }
            fontSize="20"
            aria-label="Delete customLink"
            icon={<HiOutlineTrash />}
          />
        );
      }
      return (
        <Switch
          isChecked={customLink.enable}
          onChange={() => table.options.meta?.toggleCustomLink?.(customLink)}
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
  const customLinks = useSelector(selectCustomLinkItem.selectAll);
  const CustomLinkCollectionName = (collectionId: string) =>
    useSelector((state: RootState) =>
      selectCustomLinkCollection.selectById(state, collectionId)
    )?.name ?? "user";

  const tableProps: ReactTableProps<CustomLinkItem> = {
    columns,
    data: customLinks,
    meta: {
      removeCustomLink: (id: string) =>
        dispatch(removeManyCustomLinkItem([id])),
      toggleCustomLink: (customLink: CustomLinkItem) =>
        dispatch(toggleOneCustomLinkItem(customLink)),
      getCollectionName: (collectionId: string) =>
        CustomLinkCollectionName(collectionId),
    },
    pageSize: 50,
  };

  return <ReactTable {...tableProps} />;
};
export default CustomLinkTable;
