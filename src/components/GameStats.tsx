import React from 'react';
import { DatabaseConnectedGameStats } from './DatabaseConnectedGameStats';
import { useAuth } from '@/hooks/useAuth';

export const GameStats = () => {
  const { user } = useAuth();

  // If user is not logged in, show placeholder stats
  if (!user) {
    return <div className="text-center text-muted-foreground">Sign in to view your progress</div>;
  }

  return <DatabaseConnectedGameStats />;
};