import { LoaderCircleIcon } from "lucide-react";
import React from "react";
import { Button } from "./ui/button";

export function SubmitButton({
  loading,
  loadingText,
  className,
  children,
  ...props
}: React.ComponentProps<"button"> & {
  loading: boolean;
  loadingText?: string;
}) {
  return (
    <Button
      type="submit"
      className={className}
      {...props}
    >
      {loading ? (
        <>
          <LoaderCircleIcon className="size-4 animate-spin" />
          {loadingText || "Memproses..."}
        </>
      ) : (
        children
      )}
    </Button>
  );
}
