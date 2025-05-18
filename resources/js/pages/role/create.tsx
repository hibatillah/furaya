import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Role',
    href: '/role',
  },
  {
    title: 'Tambah',
    href: '/role/tambah',
  },
];

export default function RoleCreate() {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Tambah Role" />
      <h1 className="text-2xl font-bold">Role Create Page</h1>
    </AppLayout>
  );
}
