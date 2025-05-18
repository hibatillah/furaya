import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'User',
    href: '/user',
  },
  {
    title: 'Tambah',
    href: '/user/tambah',
  },
];

export default function UserCreate() {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Tambah User" />
      <h1 className="text-2xl font-bold">User Create Page</h1>
    </AppLayout>
  );
}
