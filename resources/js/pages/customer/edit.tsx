import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Customer',
    href: '/customer',
  },
  {
    title: 'Edit',
    href: '#', // Typically, you would use a dynamic route here
  },
];

export default function CustomerEdit() {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Edit Customer" />
      <h1 className="text-2xl font-bold">Customer Edit Page</h1>
    </AppLayout>
  );
}
