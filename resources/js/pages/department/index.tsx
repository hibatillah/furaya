import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Department',
    href: '/department',
  },
];

export default function DepartmentIndex() {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Department" />
      <h1 className="text-2xl font-bold">Department Index Page</h1>
    </AppLayout>
  );
}
