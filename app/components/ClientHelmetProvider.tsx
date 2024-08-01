'use client';

import React, { ReactNode } from 'react';
import { HelmetProvider } from 'react-helmet-async';

export default function ClientHelmetProvider({ children }: { children: ReactNode }) {
  return <HelmetProvider>{children}</HelmetProvider>;
}
