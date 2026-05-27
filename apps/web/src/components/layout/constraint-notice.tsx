import { Info } from "lucide-react";

import { cn } from "@/lib/utils";

interface ConstraintNoticeProps {
  title: string;
  children: React.ReactNode;
  variant?: "info" | "warning";
  className?: string;
}

export function ConstraintNotice({
  title,
  children,
  variant = "info",
  className,
}: ConstraintNoticeProps) {
  return (
    <div
      className={cn(
        "flex gap-3 border px-4 py-3 text-sm",
        variant === "info" && "border-primary/30 bg-primary/5",
        variant === "warning" && "border-amber-500/40 bg-amber-500/10",
        className,
      )}
      role="note"
    >
      <Info className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
      <div>
        <p className="font-medium">{title}</p>
        <div className="mt-1 text-muted-foreground">{children}</div>
      </div>
    </div>
  );
}
