
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import TimerCard from '@/components/TimerCard';
import TimeEntryList from '@/components/TimeEntryList';
import StatCard from '@/components/StatCard';
import { Clock, Calendar, Layers, Zap } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState({
    today: "0h 0m",
    week: "0h 0m",
    projectCount: 0,
    productivity: "0%",
    todayTrend: { value: 0, isPositive: true },
    weekTrend: { value: 0, isPositive: true },
    productivityTrend: { value: 0, isPositive: true }
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      if (!user) return;

      try {
        setIsLoading(true);
        
        // Get today's entries
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayISOString = today.toISOString();
        
        // Get yesterday's entries for trend calculation
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        yesterday.setHours(0, 0, 0, 0);
        const yesterdayISOString = yesterday.toISOString();
        
        const { data: todayEntries, error: todayError } = await supabase
          .from('time_entries')
          .select('duration')
          .eq('user_id', user.id)
          .gte('start_time', todayISOString);
        
        if (todayError) throw todayError;
        
        const { data: yesterdayEntries, error: yesterdayError } = await supabase
          .from('time_entries')
          .select('duration')
          .eq('user_id', user.id)
          .gte('start_time', yesterdayISOString)
          .lt('start_time', todayISOString);
          
        if (yesterdayError) throw yesterdayError;
        
        // Get this week's entries
        const startOfWeek = new Date();
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
        startOfWeek.setHours(0, 0, 0, 0);
        const weekISOString = startOfWeek.toISOString();
        
        // Get last week's entries for trend calculation
        const startOfLastWeek = new Date(startOfWeek);
        startOfLastWeek.setDate(startOfLastWeek.getDate() - 7);
        const lastWeekISOString = startOfLastWeek.toISOString();
        
        const { data: weekEntries, error: weekError } = await supabase
          .from('time_entries')
          .select('duration')
          .eq('user_id', user.id)
          .gte('start_time', weekISOString);
        
        if (weekError) throw weekError;
        
        const { data: lastWeekEntries, error: lastWeekError } = await supabase
          .from('time_entries')
          .select('duration')
          .eq('user_id', user.id)
          .gte('start_time', lastWeekISOString)
          .lt('start_time', weekISOString);
          
        if (lastWeekError) throw lastWeekError;
        
        // Get project count
        const { count: projectCount, error: projectError } = await supabase
          .from('projects')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);
        
        if (projectError) throw projectError;
        
        // Calculate totals
        const todaySeconds = todayEntries?.reduce((sum, entry) => sum + entry.duration, 0) || 0;
        const yesterdaySeconds = yesterdayEntries?.reduce((sum, entry) => sum + entry.duration, 0) || 0;
        const weekSeconds = weekEntries?.reduce((sum, entry) => sum + entry.duration, 0) || 0;
        const lastWeekSeconds = lastWeekEntries?.reduce((sum, entry) => sum + entry.duration, 0) || 0;
        
        // Calculate trends
        const todayTrendValue = yesterdaySeconds > 0 
          ? Math.round(((todaySeconds - yesterdaySeconds) / yesterdaySeconds) * 100) 
          : 0;
        const weekTrendValue = lastWeekSeconds > 0 
          ? Math.round(((weekSeconds - lastWeekSeconds) / lastWeekSeconds) * 100) 
          : 0;
        
        const todayHours = Math.floor(todaySeconds / 3600);
        const todayMinutes = Math.floor((todaySeconds % 3600) / 60);
        
        const weekHours = Math.floor(weekSeconds / 3600);
        const weekMinutes = Math.floor((weekSeconds % 3600) / 60);
        
        // Calculate productivity (average hours per day this week compared to target of 8 hours per day)
        const currentDay = new Date().getDay() || 7; // 0 = Sunday, 1-6 = Monday-Saturday
        const daysThisWeek = Math.min(currentDay, 5); // Only count weekdays, max 5
        const targetHoursPerWeek = daysThisWeek * 8 * 3600; // 8 hours per weekday in seconds
        
        // If it's weekend, calculate based on 40h work week
        const productivityPercent = targetHoursPerWeek > 0 
          ? Math.min(100, Math.round((weekSeconds / targetHoursPerWeek) * 100))
          : 0;
          
        // Calculate productivity trend
        const lastWeekProductivity = lastWeekSeconds > 0 ? 
          Math.min(100, Math.round((lastWeekSeconds / (5 * 8 * 3600)) * 100)) : 0;
          
        const productivityTrendValue = lastWeekProductivity > 0 ? 
          productivityPercent - lastWeekProductivity : 0;
        
        // Update stats
        setStats({
          today: `${todayHours}h ${todayMinutes}m`,
          week: `${weekHours}h ${weekMinutes}m`,
          projectCount: projectCount || 0,
          productivity: `${productivityPercent}%`,
          todayTrend: { 
            value: Math.abs(todayTrendValue), 
            isPositive: todayTrendValue >= 0 
          },
          weekTrend: { 
            value: Math.abs(weekTrendValue), 
            isPositive: weekTrendValue >= 0 
          },
          productivityTrend: { 
            value: Math.abs(productivityTrendValue), 
            isPositive: productivityTrendValue >= 0 
          }
        });
        
      } catch (error) {
        console.error("Error loading dashboard stats:", error);
        toast({
          title: "Error loading statistics",
          description: "Could not load your dashboard statistics. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadStats();
    
    // Set up real-time subscription for live updates
    const channel = supabase
      .channel('dashboard_updates')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'time_entries',
          filter: `user_id=eq.${user?.id}`
        }, 
        () => {
          loadStats();
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, toast]);
  
  return (
    <DashboardLayout title="Dashboard">
      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard 
          title="Today" 
          value={stats.today} 
          icon={Clock} 
          trend={stats.todayTrend}
        />
        <StatCard 
          title="This Week" 
          value={stats.week} 
          icon={Calendar}
          trend={stats.weekTrend}
        />
        <StatCard 
          title="Projects" 
          value={stats.projectCount.toString()} 
          icon={Layers}
        />
        <StatCard 
          title="Productivity" 
          value={stats.productivity} 
          icon={Zap}
          trend={stats.productivityTrend}
        />
      </div>
      
      {/* Timer */}
      <div className="mb-8">
        <TimerCard />
      </div>
      
      {/* Recent Entries */}
      <TimeEntryList />
    </DashboardLayout>
  );
};

export default Dashboard;
