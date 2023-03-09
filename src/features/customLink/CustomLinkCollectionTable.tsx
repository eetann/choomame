import type { AppDispatch } from "../../app/store";
import ReactTable, { ReactTableProps } from "../../common/ReactTable";
import {
  removeOneCustomLinkCollection,
  selectCustomLinkCollection,
} from "./customLinkCollectionSlice";
import { CustomLinkCollection } from "./customLinkSchema";
import { IconButton, Link } from "@chakra-ui/react";
import { AnyAction } from "@reduxjs/toolkit";
import { ColumnDef, createColumnHelper, RowData } from "@tanstack/react-table";
import React, { createContext, useContext } from "react";
import { HiOutlineTrash } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";

declare module "@tanstack/table-core" {
  // eslint-disable-next-line unused-imports/no-unused-vars
  interface TableMeta<TData extends RowData> {
    removeCustomLinkCollection?: (collectionId: string) => Promise<AnyAction>;
    isUpdatingCollection?: boolean;
  }
}

export type WhereUpdatingCollectionContextType = {
  whereUpdatingCollection: "" | "Background" | "Manual";
};

const defaultWhereUpdatingCollectionContext: WhereUpdatingCollectionContextType =
  {
    whereUpdatingCollection: "",
  };

export const WhereUpdatingCollectionContext =
  createContext<WhereUpdatingCollectionContextType>(
    defaultWhereUpdatingCollectionContext
  );

const columnHelper = createColumnHelper<CustomLinkCollection>();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const columns: ColumnDef<CustomLinkCollection, any>[] = [
  columnHelper.accessor("name", {
    cell: (info) => info.getValue(),
    header: "Name",
    meta: {
      tdProps: {
        width: 48,
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
        width: "120",
        wordBreak: "break-word",
      },
    },
  }),
  columnHelper.accessor((row) => `${row.id}`, {
    id: "button",
    header: "",
    cell: ({ getValue, table }) => (
      <IconButton
        fontSize="20"
        aria-label="Delete custom link collection"
        icon={<HiOutlineTrash />}
        onClick={() =>
          table.options.meta?.removeCustomLinkCollection?.(getValue())
        }
        isLoading={table.options.meta?.isUpdatingCollection ?? false}
      />
    ),
    meta: {
      thProps: {
        height: 14,
        pr: 1,
      },
    },
  }),
];

const CustomLinkCollectionTable: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const customLinkCollection = useSelector(
    selectCustomLinkCollection.selectAll
  );
  const { whereUpdatingCollection } = useContext(
    WhereUpdatingCollectionContext
  );

  const tableProps: ReactTableProps<CustomLinkCollection> = {
    columns,
    data: customLinkCollection,
    meta: {
      removeCustomLinkCollection: (collectionId: string) =>
        dispatch(removeOneCustomLinkCollection(collectionId)),
      isUpdatingCollection: whereUpdatingCollection !== "",
    },
    pageSize: 10,
  };

  return <ReactTable {...tableProps} />;
};
export default CustomLinkCollectionTable;
