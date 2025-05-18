import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Role',
    href: '/role',
  },
];

export default function RoleIndex() {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Role" />
      <h1 className="text-2xl font-bold">Role Index Page</h1>
    </AppLayout>
  );
}
