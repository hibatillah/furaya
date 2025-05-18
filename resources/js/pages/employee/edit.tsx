import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Employee',
    href: '/employee',
  },
  {
    title: 'Edit',
    href: '#', // Typically, you would use a dynamic route here
  },
];

export default function EmployeeEdit() {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Edit Employee" />
      <h1 className="text-2xl font-bold">Employee Edit Page</h1>
    </AppLayout>
  );
}
