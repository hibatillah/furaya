import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Department',
    href: '/department',
  },
  {
    title: 'Edit',
    href: '#', // Typically, you would use a dynamic route here
  },
];

export default function DepartmentEdit() {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Edit Department" />
      <h1 className="text-2xl font-bold">Department Edit Page</h1>
    </AppLayout>
  );
}
