'use client';

import MobileBackIconWhite from '@/assets/images/upsert_image/MobileBackIconWhite';
import { useRouter } from 'next/navigation';
import React from 'react';

const MobileBackClickWhite = () => {
  const router = useRouter();

  const handleBackClick = () => {
    router.back();
  };

  return (
    <div>
      <button onClick={handleBackClick}>
        <MobileBackIconWhite />
      </button>
    </div>
  );
};

export default MobileBackClickWhite;
