
'use client';
import { Fragment, useState } from 'react';

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}

export default function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <div className="hidden lg:flex lg:w-72 lg:flex-col bg-white">
        {/* Sidebar component, swap this element with another sidebar if you like */}
        <div className="flex grow flex-col gap-y-5 bg-white overflow-y-auto px-6 pb-4">
          {/* Add your sidebar content here */}
        </div>
      </div>
    </>
  );
}