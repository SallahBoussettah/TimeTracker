
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Play, Pause, StopCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

const TimerCard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [description, setDescription] = useState('');
  const [projectId, setProjectId] = useState<string>('');
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [projects, setProjects] = useState<{id: string; name: string}[]>([]);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('id, name')
          .eq('user_id', user.id);
          
        if (error) throw error;
        
        setProjects(data || []);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };
    
    fetchProjects();
  }, [user]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, []);

  const startTimer = () => {
    if (!description.trim()) {
      toast({
        title: "Description required",
        description: "Please enter what you're working on.",
        variant: "destructive",
      });
      return;
    }
    
    setIsRunning(true);
    setStartTime(new Date());
    
    intervalRef.current = window.setInterval(() => {
      setSeconds(prevSeconds => prevSeconds + 1);
    }, 1000);
  };

  const pauseTimer = () => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRunning(false);
  };

  const stopTimer = async () => {
    if (!user || !startTime) return;
    
    pauseTimer();
    
    try {
      const endTime = new Date();
      
      const { error } = await supabase
        .from('time_entries')
        .insert({
          user_id: user.id,
          description: description,
          duration: seconds,
          start_time: startTime.toISOString(),
          end_time: endTime.toISOString(),
          project_id: projectId || null
        });
        
      if (error) throw error;
      
      toast({
        title: "Time entry saved",
        description: `You tracked ${formatTime(seconds)} for "${description}"`,
      });
      
      // Reset timer
      setSeconds(0);
      setDescription('');
      setProjectId('');
      setStartTime(null);
      
    } catch (error: any) {
      toast({
        title: "Error saving time entry",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const formatTime = (timeInSeconds: number) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const secs = timeInSeconds % 60;
    
    return [
      hours.toString().padStart(2, '0'),
      minutes.toString().padStart(2, '0'),
      secs.toString().padStart(2, '0')
    ].join(':');
  };

  return (
    <Card className="shadow-lg border-primary/10">
      <CardContent className="p-6">
        <div className="flex flex-col space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-center">
            <div className="lg:col-span-2">
              <Input
                type="text"
                placeholder="What are you working on?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="font-medium text-lg w-full"
                disabled={isRunning}
              />
            </div>
            <div className="text-right text-3xl font-mono font-medium tabular-nums">
              {formatTime(seconds)}
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-1 block">Project</label>
              <Select value={projectId} onValueChange={setProjectId} disabled={isRunning}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map(project => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            {isRunning ? (
              <Button 
                onClick={pauseTimer} 
                variant="outline" 
                className="bg-primary/5 hover:bg-primary/10 btn-hover"
              >
                <Pause className="mr-2 h-4 w-4" />
                Pause
              </Button>
            ) : (
              <Button 
                onClick={startTimer} 
                variant="outline" 
                className="bg-primary/5 hover:bg-primary/10 btn-hover"
              >
                <Play className="mr-2 h-4 w-4" />
                {seconds > 0 ? 'Resume' : 'Start'}
              </Button>
            )}
            
            {seconds > 0 && (
              <Button 
                onClick={stopTimer} 
                variant="default" 
                className="btn-hover"
              >
                <StopCircle className="mr-2 h-4 w-4" />
                Complete
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TimerCard;
