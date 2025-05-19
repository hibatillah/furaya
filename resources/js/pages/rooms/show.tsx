import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

export default function RoomsShow(props: { room: Room.Default }) {
  const { room } = props;

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Kamar',
      href: route('room.index'),
    },
    {
      title: 'Detail',
      href: route('room.show', { id: room.id }),
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Kamar" />
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Detail Kamar</h1>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>{room.room_number}</span>
            <span>{room.floor_number}</span>
            <span>{room.room_type?.name}</span>
            <span>{room.bed_type?.name}</span>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
