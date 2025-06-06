'use client';

import AppLayout from '@/components/layouts/AppLayout';

export default function ListProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppLayout>{children}</AppLayout>;
}
