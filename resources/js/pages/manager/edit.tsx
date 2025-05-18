import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Manager',
    href: '/manager',
  },
  {
    title: 'Edit',
    href: '#', // Typically, you would use a dynamic route here
  },
];

export default function ManagerEdit() {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Edit Manager" />
      <h1 className="text-2xl font-bold">Manager Edit Page</h1>
    </AppLayout>
  );
}
