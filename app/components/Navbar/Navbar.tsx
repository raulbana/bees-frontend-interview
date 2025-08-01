"use client";

import React from 'react';
import { useUserContext } from '@/app/store/userContext';
import { useRouter } from 'next/navigation';
import {ArrowCircleLeft} from 'phosphor-react'

const Navbar = () => {
  const { user, logout } = useUserContext();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/authentication/login');
  };

  return (
    <nav className="bg-primary-yellow p-5 flex items-center justify-between w-full">
      <button 
        onClick={handleLogout}
        className="flex items-center gap-2 text-lg font-semibold border-0 text-black cursor-pointer"
      >
        <ArrowCircleLeft size={32} weight='fill'/>
        Logout
      </button>
      
      <div className="text-black text-lg">
        Hi, {user?.name}
      </div>
    </nav>
  );
};

export default Navbar;