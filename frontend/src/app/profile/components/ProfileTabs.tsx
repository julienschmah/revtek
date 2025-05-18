'use client';

import React from 'react';
import { Tab } from '@headlessui/react';
import { FaIdCard, FaBuilding, FaBox, FaLock } from 'react-icons/fa';

interface ProfileTabsProps {
  children: React.ReactNode;
}

export default function ProfileTabs({ children }: ProfileTabsProps) {
  const tabClassNames = ({ selected }: { selected: boolean }) => 
    `relative flex items-center justify-center w-full py-3 px-2 rounded-lg text-sm font-medium leading-5 
    transition-all duration-200 ease-in-out
    ${selected 
      ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-white shadow-lg' 
      : 'text-amber-800 hover:bg-amber-100'
    }`;

  return (
    <Tab.Group>
      <Tab.List className="flex rounded-xl bg-white p-2 mb-8 shadow-lg">
        <Tab className={tabClassNames}>
          <FaIdCard className="mr-2" /> Informações Pessoais
        </Tab>
        
        <Tab className={tabClassNames}>
          <FaBuilding className="mr-2" /> Endereço
        </Tab>
        
        <Tab className={tabClassNames}>
          <FaBox className="mr-2" /> Informações de Vendedor
        </Tab>
        
        <Tab className={tabClassNames}>
          <FaLock className="mr-2" /> Segurança
        </Tab>
      </Tab.List>
      
      <Tab.Panels className="mt-2">
        {children}
      </Tab.Panels>
    </Tab.Group>
  );
}
