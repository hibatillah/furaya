import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Admin',
    href: '/admin',
  },
  {
    title: 'Tambah',
    href: '/admin/tambah',
  },
];

export default function AdminCreate() {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Tambah Admin" />
      <h1 className="text-2xl font-bold">Admin Create Page</h1>
    </AppLayout>
  );
}
