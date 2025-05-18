import { usePage } from "@inertiajs/react";

export default function Show() {
  const { department } = usePage().props;
  return (
    <div>
      <h1>Detail Department</h1>
      <pre>{JSON.stringify(department, null, 2)}</pre>
    </div>
  );
}