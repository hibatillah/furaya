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
    title: 'Edit',
    href: '#',
  },
];

export default function BedTypeEdit() {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Edit Bed Type" />
      <h1 className="text-2xl font-bold">Bed Type Edit Page</h1>
    </AppLayout>
  );
}
