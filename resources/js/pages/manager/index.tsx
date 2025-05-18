import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Manager',
    href: '/manager',
  },
];

export default function ManagerIndex() {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Manager" />
      <h1 className="text-2xl font-bold">Manager Index Page</h1>
    </AppLayout>
  );
}
