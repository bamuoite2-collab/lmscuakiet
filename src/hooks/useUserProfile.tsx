import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface UserProfile {
  id: string;
  user_id: string;
  full_name: string | null;
  avatar_url: string | null;
  user_level: 'thcs' | 'thpt' | null;
  is_premium_user: boolean;
  created_at: string;
  updated_at: string;
}

export function useUserProfile() {
  const { user, loading: authLoading } = useAuth();

  const { data: profile, isLoading, refetch } = useQuery({
    queryKey: ['user-profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (error) throw error;
      return data as UserProfile | null;
    },
    enabled: !!user?.id && !authLoading
  });

  return {
    profile,
    isLoading: authLoading || isLoading,
    refetch,
    needsLevelSelection: !!user && !authLoading && !isLoading && profile && !profile.user_level
  };
}