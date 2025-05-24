import * as React from "react";
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
import { ArrowUpDown, Phone, Mail } from "lucide-react";
import { StudentRecord } from "../../../types/student-table-type";
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
import { data } from "./../../../data/student-mock";
import StudentDialog from "../../../components/admin/StudentDialog";
const columns: ColumnDef<StudentRecord>[] = [
  {
    accessorKey: "studentId",
    header: ({ column }) => {
      return (
        <div className="flex justify-center">
          <Button
            variant="ghost"
            onClick={() =>
              column.toggleSorting(column.getIsSorted() === "asc")
            }>
            Student ID
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => (
      <div className="font-medium text-center">{row.getValue("studentId")}</div>
    ),
  },
  {
    id: "fullName",
    header: ({ column }) => {
      return (
        <div className="flex justify-center">
          <Button
            variant="ghost"
            onClick={() =>
              column.toggleSorting(column.getIsSorted() === "asc")
            }>
            Full Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => (
      <div className="text-center">
        {row.original.firstName} {row.original.lastName}
      </div>
    ),
    sortingFn: (rowA, rowB) => {
      const nameA = `${rowA.original.firstName} ${rowA.original.lastName}`;
      const nameB = `${rowB.original.firstName} ${rowB.original.lastName}`;
      return nameA.localeCompare(nameB);
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <div className="flex items-center justify-center gap-1">
        <Mail className="h-3 w-3 text-gray-500" />
        <a
          href={`mailto:${row.getValue("email")}`}
          className="text-blue-600 hover:underline">
          {row.getValue("email")}
        </a>
      </div>
    ),
  },
  {
    accessorKey: "phoneNumber",
    header: "Phone",
    cell: ({ row }) => (
      <div className="flex items-center justify-center gap-1">
        <Phone className="h-3 w-3 text-gray-500" />
        <span className="text-center">{row.getValue("phoneNumber")}</span>
      </div>
    ),
  },
  {
    accessorKey: "program",
    header: "Program",
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("program")}</div>
    ),
  },

  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;

      const getStatusStyle = (status: string) => {
        switch (status) {
          case "active":
            return "bg-green-100 text-green-800";
          case "graduated":
            return "bg-blue-100 text-blue-800";
          case "suspended":
            return "bg-yellow-100 text-yellow-800";
          case "withdrawn":
            return "bg-red-100 text-red-800";
          default:
            return "bg-gray-100 text-gray-800";
        }
      };

      return (
        <div className="flex justify-center">
          <Badge variant="default" className={`${getStatusStyle(status)}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        </div>
      );
    },
  },
];

export default function Student() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

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
          Student Records Management
        </h2>
        <p className="text-gray-600">
          View and manage student information and academic records
        </p>
      </div>{" "}
      <div className="flex items-center py-4 gap-4">
        <Input
          placeholder="Search by student ID or name..."
          value={
            (table.getColumn("studentId")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("studentId")?.setFilterValue(event.target.value)
          }
          className="max-w-md"
        />
        <StudentDialog />
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
                  No students found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between py-4">
        <div className="text-sm text-muted-foreground">
          Showing {table.getRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} students
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
