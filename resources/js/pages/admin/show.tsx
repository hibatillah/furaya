import { usePage } from "@inertiajs/react";

export default function Show() {
  const { admin } = usePage().props;
  return (
    <div>
      <h1>Detail Admin</h1>
      <pre>{JSON.stringify(admin, null, 2)}</pre>
    </div>
  );
}