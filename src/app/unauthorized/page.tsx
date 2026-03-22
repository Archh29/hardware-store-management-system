'use client';

import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Shield, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function UnauthorizedPage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  const handleGoHome = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-red-600" />
          </div>
          <CardTitle className="text-red-900">Access Denied</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">
            You don&apos;t have permission to access this page.
          </p>
          
          {user && (
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                Logged in as: <span className="font-medium">{user.name}</span>
              </p>
              <p className="text-sm text-gray-600">
                Role: <span className="font-medium capitalize">{user.role}</span>
              </p>
            </div>
          )}

          <div className="flex gap-3">
            <Button variant="secondary" onClick={handleGoBack} className="flex-1">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
            <Button onClick={handleGoHome} className="flex-1">
              Dashboard
            </Button>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <Button variant="ghost" onClick={logout} className="text-sm">
              Sign out and login with different account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
