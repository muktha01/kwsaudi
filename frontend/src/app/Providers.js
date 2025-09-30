"use client";

import { TranslationProvider } from '../contexts/TranslationContext';
import { GoogleOAuthProvider } from '@react-oauth/google';

export default function Providers({ children }) {
  return (
    <TranslationProvider>
      <GoogleOAuthProvider clientId="338139799424-0k3qfr1ip78n50gnn65g6odqj49no69p.apps.googleusercontent.com">
        {children}
      </GoogleOAuthProvider>
    </TranslationProvider>
  );
}
