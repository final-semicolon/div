'use client';

import MobileBackIconBlack from '@/assets/images/upsert_image/MobileBackIconBlack';
import { useRouter } from 'next/navigation';
import React from 'react';

const MobileBackClickBlack = () => {
  const router = useRouter();

  const handleBackClick = () => {
    router.back();
  };

  return (
    <div>
      <button onClick={handleBackClick} className="z-50">
        <MobileBackIconBlack />
      </button>
    </div>
  );
};

export default MobileBackClickBlack;
