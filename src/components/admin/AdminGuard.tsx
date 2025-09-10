import React from 'react';
import { useAuth } from '../../hooks/useAuth.js';
import { AdminLogin } from './AdminLogin.js';
import { useAdmin } from '../../hooks/useAdmin.js';
import { Loader2 } from 'lucide-react';

interface AdminGuardProps {
  children: React.ReactNode;
}

export function AdminGuard({ children }: AdminGuardProps) {
  const { user, isLoading: authLoading } = useAuth();
  const { isAdmin, isLoading: adminLoading } = useAdmin(user as any);

  if (authLoading || adminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!isAdmin) {
    return <AdminLogin onSuccess={() => window.location.reload()} />;
  }

  return <>{children}</>;
}