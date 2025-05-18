import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Customer',
    href: '/customer',
  },
];

export default function CustomerIndex() {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Customer" />
      <h1 className="text-2xl font-bold">Customer Index Page</h1>
    </AppLayout>
  );
}
