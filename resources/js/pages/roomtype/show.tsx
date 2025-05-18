import { usePage } from "@inertiajs/react";

export default function Show() {
  const { roomType } = usePage().props;
  return (
    <div>
      <h1>Detail Room Type</h1>
      <pre>{JSON.stringify(roomType, null, 2)}</pre>
    </div>
  );
}