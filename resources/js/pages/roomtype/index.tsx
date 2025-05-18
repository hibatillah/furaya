import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Kamar',
    href: '/kamar',
  },
  {
    title: 'Tipe Kamar',
    href: '/kamar/tipe/kamar',
  },
];

export default function RoomTypeIndex() {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Room Type" />
      <h1 className="text-2xl font-bold">Room Type Index Page</h1>
    </AppLayout>
  );
}
