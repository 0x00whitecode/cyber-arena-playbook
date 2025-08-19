import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';

interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  email: string | null;
  role: string;
  department: string | null;
  specialization: string | null;
  avatar_url: string | null;
  points: number;
  rank: number;
  streak_days: number;
  total_hours: number;
}

interface Badge {
  id: string;
  name: string;
  description: string | null;
  category: string;
  icon: string | null;
  earned_at: string;
}

export const useProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Fetch user profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (profileError) throw profileError;
      setProfile(profileData);

      // Fetch user badges
      const { data: badgesData, error: badgesError } = await supabase
        .from('user_badges')
        .select(`
          *,
          badges (
            name,
            description,
            category,
            icon
          )
        `)
        .eq('user_id', user.id);

      if (badgesError) throw badgesError;
      
      const formattedBadges = badgesData?.map(badge => ({
        id: badge.badge_id,
        name: badge.badges.name,
        description: badge.badges.description,
        category: badge.badges.category,
        icon: badge.badges.icon,
        earned_at: badge.earned_at
      })) || [];
      
      setBadges(formattedBadges);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user || !profile) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', user.id);

      if (error) throw error;
      
      setProfile({ ...profile, ...updates });
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  return {
    profile,
    badges,
    loading,
    error,
    updateProfile,
    refetch: fetchProfile
  };
};