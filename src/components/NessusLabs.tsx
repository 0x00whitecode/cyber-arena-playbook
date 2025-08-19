import React from 'react';
import { DatabaseConnectedNessusLabs } from './DatabaseConnectedNessusLabs';
import { useAuth } from '@/hooks/useAuth';

export const NessusLabs = () => {
  const { user } = useAuth();

  // If user is not logged in, show static content
  if (!user) {
    return (
      <div>
        <h2 className="text-2xl font-bold mb-6">Nessus Labs</h2>
        <p className="text-muted-foreground">Sign in to access hands-on Nessus vulnerability assessment labs.</p>
      </div>
    );
  }

  return <DatabaseConnectedNessusLabs />;
};