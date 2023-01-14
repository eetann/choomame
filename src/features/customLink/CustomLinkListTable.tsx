import type { AppDispatch } from "../../app/store";
import ReactTable, { ReactTableProps } from "../../common/ReactTable";
import {
  removeOneCustomLinkList,
  selectCustomLinkList,
} from "./customLinkListSlice";
import { CustomLinkList } from "./customLinkSchema";
import { IconButton, Link } from "@chakra-ui/react";
import { AnyAction } from "@reduxjs/toolkit";
import { ColumnDef, createColumnHelper, RowData } from "@tanstack/react-table";
import React, { createContext, useContext } from "react";
import { HiOutlineTrash } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";

declare module "@tanstack/table-core" {
  // eslint-disable-next-line unused-imports/no-unused-vars
  interface TableMeta<TData extends RowData> {
    removeCustomLinkList?: (list_id: string) => Promise<AnyAction>;
    isUpdatingList?: boolean;
  }
}

export type IsUpdatingListContextType = {
  isUpdatingList: boolean;
  setStartUpdatingList: React.Dispatch<React.SetStateAction<boolean>>;
  setStopUpdatingList: React.Dispatch<React.SetStateAction<boolean>>;
};

const defaultIsUpdatingListContext: IsUpdatingListContextType = {
  isUpdatingList: false,
  setStartUpdatingList: () => true,
  setStopUpdatingList: () => false,
};

export const IsUpdatingListContext = createContext<IsUpdatingListContextType>(
  defaultIsUpdatingListContext
);

const columnHelper = createColumnHelper<CustomLinkList>();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const columns: ColumnDef<CustomLinkList, any>[] = [
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
        aria-label="Delete custom link list"
        icon={<HiOutlineTrash />}
        onClick={() => table.options.meta?.removeCustomLinkList?.(getValue())}
        isLoading={table.options.meta?.isUpdatingList ?? false}
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

const CustomLinkListTable: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const customLinkList = useSelector(selectCustomLinkList.selectAll);
  const { isUpdatingList } = useContext(IsUpdatingListContext);

  const tableProps: ReactTableProps<CustomLinkList> = {
    columns,
    data: customLinkList,
    meta: {
      removeCustomLinkList: (list_id: string) =>
        dispatch(removeOneCustomLinkList(list_id)),
      isUpdatingList,
    },
    pageSize: 10,
  };

  return <ReactTable {...tableProps} />;
};
export default CustomLinkListTable;
