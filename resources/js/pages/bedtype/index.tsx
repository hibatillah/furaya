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
];

export default function BedTypeIndex() {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Bed Type" />
      <h1 className="text-2xl font-bold">Bed Type Index Page</h1>
    </AppLayout>
  );
}
