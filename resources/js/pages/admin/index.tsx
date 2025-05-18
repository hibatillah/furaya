import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Admin',
    href: '/admin',
  },
];

export default function AdminIndex() {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Admin" />
      <h1 className="text-2xl font-bold">Admin Index Page</h1>
    </AppLayout>
  );
}
