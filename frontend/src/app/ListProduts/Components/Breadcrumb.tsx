'use client';

import React from 'react';
import Link from 'next/link';

const Breadcrumb: React.FC = () => {
  return (
    <nav className="flex mb-8 text-sm" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        <li className="inline-flex items-center">
          <Link href="/landingpage" className="text-gray-600 hover:text-amber-600 transition-colors">
            Home
          </Link>
        </li>
        <li>
          <div className="flex items-center">
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-800 font-medium">Produtos</span>
          </div>
        </li>
      </ol>
    </nav>
  );
};

export default Breadcrumb;
