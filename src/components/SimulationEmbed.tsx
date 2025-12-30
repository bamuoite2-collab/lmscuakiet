import { useState, useRef, useEffect, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Maximize2, Minimize2, FlaskConical, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface SimulationEmbedProps {
  simulationUrl: string;
  lessonId: string;
  title?: string;
}

export function SimulationEmbed({ simulationUrl, lessonId, title = 'Thí nghiệm ảo' }: SimulationEmbedProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const startTimeRef = useRef<number | null>(null);

  // Track simulation interaction
  const trackInteraction = useMutation({
    mutationFn: async () => {
      if (!user) return;
      
      // Check if interaction already exists
      const { data: existing } = await supabase
        .from('simulation_interactions')
        .select('id, interaction_count, total_time_seconds')
        .eq('user_id', user.id)
        .eq('lesson_id', lessonId)
        .maybeSingle();

      if (existing) {
        // Update existing record
        const { error } = await supabase
          .from('simulation_interactions')
          .update({
            interaction_count: existing.interaction_count + 1,
            last_opened_at: new Date().toISOString(),
          })
          .eq('id', existing.id);
        if (error) throw error;
      } else {
        // Create new record
        const { error } = await supabase
          .from('simulation_interactions')
          .insert({
            user_id: user.id,
            lesson_id: lessonId,
          });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['simulation-interactions'] });
    },
  });

  // Update time spent when leaving - uses fetch with keepalive for reliable tracking
  const updateTimeSpent = useCallback(async () => {
    if (!user || !startTimeRef.current) return;
    
    const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000);
    if (timeSpent < 5) return; // Don't track very short interactions
    
    try {
      // Get current session for authentication
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) return;
      
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const payload = JSON.stringify({
        lesson_id: lessonId,
        time_spent: timeSpent,
      });
      
      // Use fetch with keepalive for reliable data sending (sendBeacon can't send auth headers)
      const beaconUrl = `${supabaseUrl}/functions/v1/update-simulation-time`;
      await fetch(beaconUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: payload,
        keepalive: true,
      });
      
      // Reset start time after updating
      startTimeRef.current = Date.now();
    } catch (error) {
      console.error('Failed to update simulation time:', error);
    }
  }, [user, lessonId]);

  // Track when iframe loads (user starts interaction)
  const handleIframeLoad = () => {
    if (!hasInteracted && user) {
      setHasInteracted(true);
      startTimeRef.current = Date.now();
      trackInteraction.mutate();
      toast.success('Đã ghi nhận hoạt động thí nghiệm!', { duration: 2000 });
    }
  };

  // Handle fullscreen
  const toggleFullscreen = async () => {
    if (!containerRef.current) return;
    
    if (!isFullscreen) {
      try {
        await containerRef.current.requestFullscreen();
        setIsFullscreen(true);
      } catch (err) {
        console.error('Fullscreen error:', err);
      }
    } else {
      try {
        await document.exitFullscreen();
        setIsFullscreen(false);
      } catch (err) {
        console.error('Exit fullscreen error:', err);
      }
    }
  };

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      // Update time when component unmounts
      updateTimeSpent();
    };
  }, []);

  // Update time on page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      updateTimeSpent();
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  return (
    <div className="border rounded-xl overflow-hidden bg-card">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-chemical/10 to-primary/10 border-b">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-chemical/20">
            <FlaskConical className="h-5 w-5 text-chemical" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-foreground">
              🧪 Phòng thí nghiệm tương tác
            </h3>
            <p className="text-sm text-muted-foreground">{title}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(simulationUrl, '_blank')}
            className="gap-2"
          >
            <ExternalLink className="h-4 w-4" />
            <span className="hidden sm:inline">Mở tab mới</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={toggleFullscreen}
            className="gap-2"
          >
            {isFullscreen ? (
              <>
                <Minimize2 className="h-4 w-4" />
                <span className="hidden sm:inline">Thu nhỏ</span>
              </>
            ) : (
              <>
                <Maximize2 className="h-4 w-4" />
                <span className="hidden sm:inline">Toàn màn hình</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Iframe Container */}
      <div 
        ref={containerRef}
        className={`relative ${isFullscreen ? 'h-screen' : ''}`}
      >
        <div className={`${isFullscreen ? 'h-full' : 'aspect-video'}`}>
          <iframe
            src={simulationUrl}
            title={title}
            className="w-full h-full border-0"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            onLoad={handleIframeLoad}
          />
        </div>
      </div>

      {/* Footer hint */}
      <div className="p-3 bg-muted/30 border-t">
        <p className="text-xs text-muted-foreground text-center">
          💡 Tương tác với thí nghiệm để hiểu rõ hơn về bài học. Thời gian sử dụng sẽ được ghi nhận vào tiến độ học tập.
        </p>
      </div>
    </div>
  );
}
