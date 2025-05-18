import { usePage } from "@inertiajs/react";

export default function Show() {
  const { bedType } = usePage().props;
  return (
    <div>
      <h1>Detail Bed Type</h1>
      <pre>{JSON.stringify(bedType, null, 2)}</pre>
    </div>
  );
}