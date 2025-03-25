
import { useState, useEffect } from 'react';
import { Edit2, Trash2, Play, MoreVertical } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

type TimeEntry = {
  id: string;
  description: string;
  duration: number;
  start_time: string;
  end_time: string | null;
  project_id: string | null;
};

// Project colors for the badges
const projectColors: Record<string, string> = {
  Marketing: 'bg-blue-100 text-blue-800',
  Sales: 'bg-green-100 text-green-800',
  Design: 'bg-purple-100 text-purple-800',
  Development: 'bg-orange-100 text-orange-800',
  default: 'bg-gray-100 text-gray-800'
};

const TimeEntryList = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState<Record<string, {name: string}>>({});
  
  useEffect(() => {
    if (!user) return;
    
    const fetchProjects = async () => {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('id, name')
          .eq('user_id', user.id);
          
        if (error) throw error;
        
        const projectMap: Record<string, {name: string}> = {};
        data?.forEach(project => {
          projectMap[project.id] = { name: project.name };
        });
        
        setProjects(projectMap);
      } catch (error: any) {
        console.error("Error fetching projects:", error);
      }
    };
    
    const fetchTimeEntries = async () => {
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('time_entries')
          .select('*')
          .eq('user_id', user.id)
          .order('start_time', { ascending: false })
          .limit(10);
          
        if (error) throw error;
        
        setTimeEntries(data || []);
      } catch (error: any) {
        toast({
          title: "Error loading time entries",
          description: error.message,
          variant: "destructive",
        });
        console.error("Error fetching time entries:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    // Fetch both projects and time entries
    Promise.all([fetchProjects(), fetchTimeEntries()]);
    
    // Subscribe to real-time changes
    const channel = supabase
      .channel('time_entries_changes')
      .on('postgres_changes', 
        {
          event: '*',
          schema: 'public',
          table: 'time_entries',
          filter: `user_id=eq.${user.id}`
        }, 
        () => {
          fetchTimeEntries();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, toast]);
  
  const formatDuration = (durationInSeconds: number) => {
    const hours = Math.floor(durationInSeconds / 3600);
    const minutes = Math.floor((durationInSeconds % 3600) / 60);
    
    return `${hours}h ${minutes}m`;
  };
  
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const deleteEntry = async (id: string) => {
    try {
      const { error } = await supabase
        .from('time_entries')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      setTimeEntries(timeEntries.filter(entry => entry.id !== id));
      
      toast({
        title: "Entry deleted",
        description: "Time entry has been deleted successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error deleting entry",
        description: error.message,
        variant: "destructive",
      });
    }
  };
  
  const continueTiming = (entry: TimeEntry) => {
    // Implementation would continue timing with the same description and project
    console.log('Continue timing', entry);
  };

  if (isLoading) {
    return (
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle>Recent Time Entries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="py-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading your time entries...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle>Recent Time Entries</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {timeEntries.map((entry, index) => (
            <div 
              key={entry.id} 
              className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 border border-border/50 animate-fade-in hover:bg-secondary transition-colors"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="flex-1">
                <div className="flex items-center">
                  <h4 className="font-medium">{entry.description}</h4>
                  {entry.project_id && projects[entry.project_id] && (
                    <span className={`ml-3 px-2 py-0.5 rounded-full text-xs font-medium ${
                      projectColors[projects[entry.project_id].name as keyof typeof projectColors] || projectColors.default
                    }`}>
                      {projects[entry.project_id].name}
                    </span>
                  )}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {new Date(entry.start_time).toLocaleDateString()} • {formatTime(entry.start_time)}
                </div>
              </div>
              
              <div className="flex items-center">
                <span className="font-mono mr-4">{formatDuration(entry.duration)}</span>
                
                <div className="flex items-center space-x-1">
                  <button 
                    onClick={() => continueTiming(entry)} 
                    className="p-1.5 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                    aria-label="Continue timing"
                  >
                    <Play className="h-4 w-4" />
                  </button>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button 
                        className="p-1.5 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                        aria-label="More options"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                      <DropdownMenuItem className="cursor-pointer">
                        <Edit2 className="mr-2 h-4 w-4" />
                        <span>Edit</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="cursor-pointer text-destructive focus:text-destructive"
                        onClick={() => deleteEntry(entry.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          ))}
          
          {timeEntries.length === 0 && (
            <div className="text-center py-6 text-muted-foreground">
              No time entries yet. Start tracking your time!
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TimeEntryList;
