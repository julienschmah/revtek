'use client';

import AppLayout from '@/components/layouts/AppLayout';

export default function MeusProdutosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppLayout>
      {children}
    </AppLayout>
  );
}