import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Role',
    href: '/role',
  },
  {
    title: 'Edit',
    href: '#', // Typically, you would use a dynamic route here
  },
];

export default function RoleEdit() {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Edit Role" />
      <h1 className="text-2xl font-bold">Role Edit Page</h1>
    </AppLayout>
  );
}
