import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useRef } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { useEmployees } from "@/hooks/use-employees";
import type { Employee } from "@/types/api";

const columnHelper = createColumnHelper<Employee>();

const columns = [
  columnHelper.accessor("personnelNumber", { header: "Personnel #" }),
  columnHelper.accessor("lastName", { header: "Last name" }),
  columnHelper.accessor("firstName", { header: "First name" }),
  columnHelper.accessor("department", { header: "Department" }),
];

export function EmployeeTable() {
  const { data: employees = [], isLoading } = useEmployees();
  const parentRef = useRef<HTMLDivElement>(null);

  const table = useReactTable({
    data: employees,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const { rows } = table.getRowModel();

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 40,
    overscan: 8,
  });

  if (isLoading) {
    return <Skeleton className="h-64 w-full" />;
  }

  return (
    <div className="border">
      <div className="grid grid-cols-4 gap-2 border-b bg-muted/50 px-3 py-2 text-xs font-medium">
        {table.getHeaderGroups()[0]?.headers.map((header) => (
          <div key={header.id}>
            {flexRender(header.column.columnDef.header, header.getContext())}
          </div>
        ))}
      </div>
      <div ref={parentRef} className="h-[400px] overflow-auto">
        <div
          style={{ height: `${virtualizer.getTotalSize()}px`, position: "relative" }}
        >
          {virtualizer.getVirtualItems().map((virtualRow) => {
            const row = rows[virtualRow.index];
            if (!row) return null;
            return (
              <div
                key={row.id}
                className="absolute grid w-full grid-cols-4 gap-2 border-b px-3 py-2 text-sm hover:bg-muted/30"
                style={{
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                {row.getVisibleCells().map((cell) => (
                  <div key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
      <p className="border-t px-3 py-2 text-xs text-muted-foreground">
        {employees.length} employees · virtualised with TanStack Table + Virtual
      </p>
    </div>
  );
}
