import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'User',
    href: '/user',
  },
];

export default function UserIndex() {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="User" />
      <h1 className="text-2xl font-bold">User Index Page</h1>
    </AppLayout>
  );
}
