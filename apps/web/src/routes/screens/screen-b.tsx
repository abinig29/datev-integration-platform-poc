import { useState } from "react";

import { EmployeeTable } from "@/components/employees/employee-table";
import { ConstraintNotice } from "@/components/layout/constraint-notice";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEmployeeLookup } from "@/hooks/use-employees";
import { EMPLOYEE_NOT_FOUND_DEMO_ID, SCREEN_META } from "@/lib/constants";
import { ApiError } from "@/types/api";

export default function ScreenB() {
  const meta = SCREEN_META.b;
  const [lookupId, setLookupId] = useState("");
  const [activeLookup, setActiveLookup] = useState("");
  const { data, error, isFetching, refetch } = useEmployeeLookup(activeLookup);

  function handleLookup() {
    setActiveLookup(lookupId.trim());
  }

  const notFound =
    error instanceof ApiError && error.body.code === "EmployeeNotFound";

  return (
    <div className="space-y-8">
      <PageHeader title={meta.title} description={meta.description} />

      <ConstraintNotice title="EmployeeNotFound" variant="warning">
        Lookup returns HTTP 404 with code{" "}
        <code>EmployeeNotFound</code>. Try personnel number{" "}
        <code>{EMPLOYEE_NOT_FOUND_DEMO_ID}</code> or{" "}
        <code>99999</code> in sandbox mode.
      </ConstraintNotice>

      <div className="flex flex-wrap items-end gap-3 border p-4">
        <div className="space-y-2">
          <Label htmlFor="pn">Personnel number lookup</Label>
          <Input
            id="pn"
            placeholder="e.g. 10001 or NOTFOUND"
            value={lookupId}
            onChange={(e) => setLookupId(e.target.value)}
          />
        </div>
        <Button onClick={handleLookup} disabled={!lookupId.trim()}>
          Lookup
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            setLookupId(EMPLOYEE_NOT_FOUND_DEMO_ID);
            setActiveLookup(EMPLOYEE_NOT_FOUND_DEMO_ID);
          }}
        >
          Demo NOTFOUND
        </Button>
      </div>

      {activeLookup ? (
        <div className="border p-4 text-sm">
          {isFetching ? (
            <p className="text-muted-foreground">Searching…</p>
          ) : notFound ? (
            <div className="space-y-1 text-destructive">
              <p className="font-medium">EmployeeNotFound</p>
              <p>{(error as ApiError).body.message}</p>
              <Button size="sm" variant="outline" onClick={() => refetch()}>
                Retry
              </Button>
            </div>
          ) : data ? (
            <p>
              Found: {data.firstName} {data.lastName} ({data.department})
            </p>
          ) : error ? (
            <p className="text-destructive">{(error as Error).message}</p>
          ) : null}
        </div>
      ) : null}

      <EmployeeTable />
    </div>
  );
}
