import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Manager',
    href: '/manager',
  },
  {
    title: 'Tambah',
    href: '/manager/tambah',
  },
];

export default function ManagerCreate() {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Tambah Manager" />
      <h1 className="text-2xl font-bold">Manager Create Page</h1>
    </AppLayout>
  );
}
