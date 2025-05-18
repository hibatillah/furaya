import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Employee',
    href: '/employee',
  },
  {
    title: 'Tambah',
    href: '/employee/tambah',
  },
];

export default function EmployeeCreate() {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Tambah Employee" />
      <h1 className="text-2xl font-bold">Employee Create Page</h1>
    </AppLayout>
  );
}
