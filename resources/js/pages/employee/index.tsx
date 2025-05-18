import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Employee',
    href: '/employee',
  },
];

export default function EmployeeIndex() {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Employee" />
      <h1 className="text-2xl font-bold">Employee Index Page</h1>
    </AppLayout>
  );
}
