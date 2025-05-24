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
import { useQuery } from "@tanstack/react-query";
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
import { DocumentItems, StudentMeta } from "./../../../types/admin-table-type";
import { getAllDocument } from "../../../services/document-service/get-all-doc";
import DocumentDialog from "../../../components/admin/DocumentDialog";

const columns: ColumnDef<DocumentItems>[] = [
  {
    accessorKey: "ID",
    header: ({ column }) => {
      return (
        <div className="flex justify-center">
          <Button
            variant="ghost"
            onClick={() =>
              column.toggleSorting(column.getIsSorted() === "asc")
            }>
            Document ID
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => (
      <div className="font-medium text-center">{row.getValue("ID")}</div>
    ),
  },
  {
    accessorKey: "MetaData",
    header: "Student Name",
    cell: ({ row }) => {
      const metadata = row.getValue("MetaData") as StudentMeta[];

      // Add more defensive checks
      if (!metadata || !Array.isArray(metadata) || metadata.length === 0) {
        return <div className="text-center">N/A</div>;
      }

      return (
        <div className="text-center uppercase">{metadata[0].name || "N/A"}</div>
      );
    },
  },
  {
    accessorKey: "DocHash",
    header: "Document Hash",
    cell: ({ row }) => (
      <div className="text-center font-mono text-sm">
        {(row.getValue("DocHash") as string)?.substring(0, 16)}...
      </div>
    ),
  },
  {
    accessorKey: "Issuer",
    header: "Issued By",
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("Issuer")}</div>
    ),
  },
  {
    accessorKey: "IssueDate",
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
      return <div className="text-center">{row.getValue("IssueDate")}</div>;
    },
  },
  {
    accessorKey: "Status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("Status") as string;
      return (
        <div className="flex justify-center">
          <Badge
            variant={status === "approved" ? "default" : "destructive"}
            className={`gap-1 ${
              status === "approved"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}>
            {status === "approved" ? (
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
  {
    accessorKey: "docType",
    header: "Document Type",
    cell: ({ row }) => (
      <div className="text-center">
        {(row.getValue("docType") as string)?.charAt(0).toUpperCase() +
          (row.getValue("docType") as string)?.slice(1)}
      </div>
    ),
  },
];

export default function DocumentVerificationTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const {
    data: documents = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["getAllDocuments"],
    queryFn: getAllDocument,
  });

  console.log(documents);

  const table = useReactTable({
    data: documents,
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

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading documents</p>;

  return (
    <div className="w-full px-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-custom-primary mb-2">
          Document Verification Records
        </h2>
      </div>

      {/* <div className="flex justify-between items-center py-4 gap-4">
        <div className="flex justify-start items-center gap-4 w-full">
          <Input
            placeholder="Search by document ID or student name..."
            className="max-w-lg w-full"
          />
          <DocumentDialog />
        </div>
        <Button className="bg-custom-primary hover:bg-rose-400 transition-colors duration-200 cursor-pointer">
          <Sheet className="mr-2 h-4 w-4" />
          Import
        </Button>
      </div> */}

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
