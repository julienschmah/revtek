'use client';

import React from 'react';
import { Tab } from '@headlessui/react';
import ProtectedLayout from '@/components/layouts/ProtectedLayout';
import ProfileHeader from './components/ProfileHeader';
import ProfileTabs from './components/ProfileTabs';
import PersonalInfoPanel from './components/PersonalInfoPanel';
import SellerPanel from './components/SellerPanel';
import SecurityPanel from './components/SecurityPanel';
import { useProfileForm } from './components/useProfileForm';

export default function ProfilePage() {
  const {
    user,
    formData,
    passwordData,
    isUpdating,
    isChangingPassword,
    updateSuccess,
    passwordSuccess,
    validationError,
    isBecomingSeller,
    handleInputChange,
    handlePasswordChange,
    handleSpecialInputChange,
    handleUpdateProfile,
    handleChangePassword
  } = useProfileForm();

  if (!user) {
    return null;
  }

  return (
    <ProtectedLayout>
      <div className="max-w-5xl mx-auto px-4">
        <ProfileHeader 
          name={user.name}
          email={user.email}
          updateSuccess={updateSuccess}
          passwordSuccess={passwordSuccess}
          validationError={validationError}
        />

        <ProfileTabs>
          <Tab.Panels className="mt-2">
            <Tab.Panel className="p-1 focus:outline-none">
              <PersonalInfoPanel 
                formData={formData}
                isUpdating={isUpdating}
                handleInputChange={handleInputChange}
                handleSpecialInputChange={handleSpecialInputChange}
                handleUpdateProfile={handleUpdateProfile}
              />
            </Tab.Panel>
            
            <Tab.Panel className="p-1 focus:outline-none">
              <SellerPanel 
                user={user}
                formData={formData}
                isUpdating={isUpdating}
                isBecomingSeller={isBecomingSeller}
                handleInputChange={handleInputChange}
                handleSpecialInputChange={handleSpecialInputChange}
                handleUpdateProfile={handleUpdateProfile}
              />
            </Tab.Panel>
            
            <Tab.Panel className="p-1 focus:outline-none">
              <SecurityPanel 
                passwordData={passwordData}
                isChangingPassword={isChangingPassword}
                handlePasswordChange={handlePasswordChange}
                handleChangePassword={handleChangePassword}
              />
            </Tab.Panel>
          </Tab.Panels>
        </ProfileTabs>
      </div>
    </ProtectedLayout>
  );
}