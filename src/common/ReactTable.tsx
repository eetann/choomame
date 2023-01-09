import {
  TableContainer,
  Table,
  Tbody,
  Text,
  Tr,
  Td,
  IconButton,
  Thead,
  Th,
  VStack,
  HStack,
  Button,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  NumberInput,
} from "@chakra-ui/react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  RowData,
  TableMeta,
  TableOptions,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import {
  HiOutlineChevronDoubleLeft,
  HiOutlineChevronDoubleRight,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
} from "react-icons/hi2";

export interface ReactTableProps<TData extends RowData>
  extends Omit<TableOptions<TData>, "getCoreRowModel"> {
  data: TData[];
  columns: ColumnDef<TData>[];
  meta: TableMeta<TData>;
}

const ReactTable = <TDataType extends object>({
  data,
  columns,
  meta,
}: ReactTableProps<TDataType>) => {
  const table = useReactTable<TDataType>({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    meta,
  });
  const pageIndex = table.getState().pagination.pageIndex + 1;
  const pageCount = table.getPageCount();
  const [jumpPageIndex, setJumpPageIndex] = useState(pageIndex);

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
        <Text fontSize="md">{`Page ${pageIndex}/${pageCount}`}</Text>
        <NumberInput
          maxW="24"
          defaultValue={pageIndex}
          min={1}
          max={pageCount}
          onChange={(value) => setJumpPageIndex(Number(value))}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
        <Button
          fontWeight="normal"
          onClick={() => table.setPageIndex(jumpPageIndex - 1)}
        >
          jump
        </Button>
        <IconButton
          aria-label="jump next page"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          icon={<HiOutlineChevronRight />}
          fontSize="20"
        />
        <IconButton
          aria-label="jump last page"
          onClick={() => table.setPageIndex(pageCount - 1)}
          disabled={!table.getCanNextPage()}
          icon={<HiOutlineChevronDoubleRight />}
          fontSize="20"
        />
      </HStack>
    </VStack>
  );
};
export default ReactTable;
