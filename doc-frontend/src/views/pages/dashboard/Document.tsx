import { useState } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, Check, X, Sheet } from "lucide-react";

import { Button } from "./../../../components/ui/button";
import { Input } from "./../../../components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./../../../components/ui/table";
import { Badge } from "./../../../components/ui/badge";
import { DocumentVerification } from "./../../../types/admin-table-type";
import { data } from "./../../../data/document-mock";
import DocumentDialog from "../../../components/admin/DocumentDialog";

const columns: ColumnDef<DocumentVerification>[] = [
  {
    accessorKey: "certificateNumber",
    header: ({ column }) => {
      return (
        <div className="flex justify-center">
          <Button
            variant="ghost"
            onClick={() =>
              column.toggleSorting(column.getIsSorted() === "asc")
            }>
            Certificate Number
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => (
      <div className="font-medium text-center">
        {row.getValue("certificateNumber")}
      </div>
    ),
  },
  {
    accessorKey: "studentName",
    header: "Student Name",
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("studentName")}</div>
    ),
  },
  {
    accessorKey: "documentHash",
    header: "Document Hash",
    cell: ({ row }) => (
      <div className="text-center font-mono text-sm">
        {row.getValue("documentHash")}
      </div>
    ),
  },
  {
    accessorKey: "signBy",
    header: "Sign By",
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("signBy")}</div>
    ),
  },
  {
    accessorKey: "issueDate",
    header: ({ column }) => {
      return (
        <div className="flex justify-center">
          <Button
            variant="ghost"
            onClick={() =>
              column.toggleSorting(column.getIsSorted() === "asc")
            }>
            Issue Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("issueDate"));
      return <div className="text-center">{date.toLocaleDateString()}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;

      return (
        <div className="flex justify-center">
          <Badge
            variant={status === "verified" ? "default" : "destructive"}
            className={`gap-1 ${
              status === "verified"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}>
            {status === "verified" ? (
              <Check className="h-3 w-3" />
            ) : (
              <X className="h-3 w-3" />
            )}
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        </div>
      );
    },
  },
];

export default function DocumentVerificationTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  return (
    <div className="w-full px-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-custom-primary mb-2">
          Document Verification Records
        </h2>
      </div>

      <div className="flex justify-between  items-center py-4 gap-4">
        <div className="flex justify-start items-center gap-4 w-full">
          <Input
            placeholder="Search by certificate number or student name..."
            value={
              (table
                .getColumn("certificateNumber")
                ?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table
                .getColumn("certificateNumber")
                ?.setFilterValue(event.target.value)
            }
            className="max-w-lg w-full"
          />
          <DocumentDialog />
        </div>
        <Button className="bg-custom-primary hover:bg-rose-400 transition-colors duration-200 cursor-pointer">
          <Sheet className="mr-2 h-4 w-4" />
          Import
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="text-center">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center">
                  No documents found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between py-4">
        <div className="text-sm text-muted-foreground">
          Showing {table.getRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} documents
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}>
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
