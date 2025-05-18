import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Department',
    href: '/department',
  },
  {
    title: 'Tambah',
    href: '/department/tambah',
  },
];

export default function DepartmentCreate() {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Tambah Department" />
      <h1 className="text-2xl font-bold">Department Create Page</h1>
    </AppLayout>
  );
}
