
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Kamar',
    href: '/kamar',
  },
];

export default function RoomsIndex(props: { rooms: Pagination<Room.Default>; }) {
  const { rooms } = props;
  const { delete: deleteRoom } = useForm();

  function handleDelete(e: React.FormEvent, id: string) {
    e.preventDefault();

    toast.loading("Menghapus kamar...", { id: `delete-${id}` });
    deleteRoom(route("room.destroy", { id }), {
      onError: () => toast.error("Kamar gagal dihapus", { id: `delete-${id}` }),
    })
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Kamar" />
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Kamar</h1>
        </div>
        <Button className="w-fit" asChild>
          <Link href={route("room.create")}>Tambah Kamar</Link>
        </Button>
        {rooms.data.map((item) => (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span>{item.room_number}</span>
              <span>{item.floor_number}</span>
              <span>{item.room_type?.name}</span>
              <span>{item.bed_type?.name}</span>
              <span>{item.status}</span>
              <Link href={route("room.show", { id: item.id })}>
                <Button variant="outline" size="sm">Lihat</Button>
              </Link>
              <Link href={route("room.edit", { id: item.id })}>
                <Button variant="outline" size="sm">Edit</Button>
              </Link>
              <form onSubmit={(e) => handleDelete(e, item.id)}>
                <Button variant="outline" size="sm" type="submit">Hapus</Button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </AppLayout>
  );
}
