import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'User',
    href: '/user',
  },
  {
    title: 'Edit',
    href: '#', // Typically, you would use a dynamic route here
  },
];

export default function UserEdit() {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Edit User" />
      <h1 className="text-2xl font-bold">User Edit Page</h1>
    </AppLayout>
  );
}
