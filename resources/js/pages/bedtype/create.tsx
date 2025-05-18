import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Kamar',
    href: '/kamar',
  },
  {
    title: 'Tipe Kasur',
    href: '/kamar/tipe/kasur',
  },
  {
    title: 'Tambah',
    href: '/kamar/tipe/kasur/tambah',
  },
];

export default function BedTypeCreate() {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Tambah Bed Type" />
      <h1 className="text-2xl font-bold">Bed Type Create Page</h1>
    </AppLayout>
  );
}
