
import { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  StopCircle, 
  Edit, 
  Folder, 
  Tag, 
  Clock, 
  Calendar, 
  Info, 
  Plus,
  Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { useToast } from '@/components/ui/use-toast';
import DashboardLayout from '@/components/DashboardLayout';
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

type Project = {
  id: string;
  name: string;
};

const Timer = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [description, setDescription] = useState('');
  const [editing, setEditing] = useState(false);
  const [projectId, setProjectId] = useState('');
  const [tag, setTag] = useState('');
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [activeTab, setActiveTab] = useState('timer');
  const [todayEntries, setTodayEntries] = useState<TimeEntry[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [timerInterval, setTimerInterval] = useState<number | null>(null);

  useEffect(() => {
    if (!user) return;
    
    const fetchProjects = async () => {
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
    
    const fetchTodayEntries = async () => {
      try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const { data, error } = await supabase
          .from('time_entries')
          .select('*')
          .eq('user_id', user.id)
          .gte('start_time', today.toISOString())
          .order('start_time', { ascending: false });
          
        if (error) throw error;
        
        setTodayEntries(data || []);
      } catch (error) {
        console.error("Error fetching today's entries:", error);
      }
    };
    
    fetchProjects();
    fetchTodayEntries();
    
    // Set up real-time subscription
    const channel = supabase
      .channel('timer_changes')
      .on('postgres_changes', 
        {
          event: '*',
          schema: 'public',
          table: 'time_entries',
          filter: `user_id=eq.${user.id}`
        }, 
        () => {
          fetchTodayEntries();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, [user]);

  const formatTime = (timeInSeconds: number) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;
    
    return [
      hours.toString().padStart(2, '0'),
      minutes.toString().padStart(2, '0'),
      seconds.toString().padStart(2, '0')
    ].join(':');
  };

  const toggleTimer = () => {
    if (isRunning) {
      // Pause timer
      if (timerInterval) {
        clearInterval(timerInterval);
        setTimerInterval(null);
      }
    } else {
      // Start timer
      if (!description.trim()) {
        toast({
          title: "Description required",
          description: "Please enter what you're working on.",
          variant: "destructive",
        });
        return;
      }
      
      if (!startTime) {
        setStartTime(new Date());
      }
      
      const interval = window.setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
      
      setTimerInterval(interval);
    }
    
    setIsRunning(!isRunning);
  };

  const stopTimer = async () => {
    if (!user || !startTime) return;
    
    // Stop timer
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
    setIsRunning(false);
    
    try {
      const endTime = new Date();
      
      const { error } = await supabase
        .from('time_entries')
        .insert({
          user_id: user.id,
          description: description,
          duration: time,
          start_time: startTime.toISOString(),
          end_time: endTime.toISOString(),
          project_id: projectId || null
        });
        
      if (error) throw error;
      
      toast({
        title: "Time entry saved",
        description: `You tracked ${formatTime(time)} for "${description}"`,
      });
      
      // Reset timer
      setTime(0);
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

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
  };

  const handleEditClick = () => {
    setEditing(true);
  };

  const handleDescriptionBlur = () => {
    setEditing(false);
  };

  const handleDescriptionKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setEditing(false);
    }
  };

  const deleteTimeEntry = async (id: string) => {
    try {
      const { error } = await supabase
        .from('time_entries')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      setTodayEntries(todayEntries.filter(entry => entry.id !== id));
      
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

  const getProjectName = (projectId: string | null) => {
    if (!projectId) return null;
    const project = projects.find(p => p.id === projectId);
    return project ? project.name : null;
  };

  return (
    <DashboardLayout title="Timer">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className="glass shadow-lg mb-6 border-primary/10">
            <CardContent className="p-6">
              <div className="flex flex-col space-y-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    {editing ? (
                      <Input
                        type="text"
                        value={description}
                        onChange={handleDescriptionChange}
                        onBlur={handleDescriptionBlur}
                        onKeyDown={handleDescriptionKeyDown}
                        placeholder="What are you working on?"
                        autoFocus
                        className="font-medium text-lg input-focus"
                      />
                    ) : (
                      <div 
                        className="flex items-center cursor-pointer group" 
                        onClick={handleEditClick}
                      >
                        <h3 className="font-medium text-lg">
                          {description || "What are you working on?"}
                        </h3>
                        <Edit className="ml-2 h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    )}
                  </div>
                  <div className="text-3xl font-mono font-medium tabular-nums">
                    {formatTime(time)}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-1 block">Project</label>
                    <Select value={projectId} onValueChange={setProjectId}>
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
                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-1 block">Tag</label>
                    <Select value={tag} onValueChange={setTag}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select tag" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="billable">Billable</SelectItem>
                        <SelectItem value="meeting">Meeting</SelectItem>
                        <SelectItem value="planning">Planning</SelectItem>
                        <SelectItem value="coding">Coding</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  {isRunning ? (
                    <Button 
                      onClick={toggleTimer} 
                      variant="outline" 
                      className="bg-primary/5 hover:bg-primary/10 btn-hover"
                    >
                      <Pause className="mr-2 h-4 w-4" />
                      Pause
                    </Button>
                  ) : (
                    <Button 
                      onClick={toggleTimer} 
                      variant="outline" 
                      className="bg-primary/5 hover:bg-primary/10 btn-hover"
                    >
                      <Play className="mr-2 h-4 w-4" />
                      {time > 0 ? 'Resume' : 'Start'}
                    </Button>
                  )}
                  {time > 0 && (
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

          {/* Today's Time Entries */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Today's Entries</h2>
            {todayEntries.length > 0 ? (
              <div className="divide-y divide-border space-y-2">
                {todayEntries.map(entry => {
                  const projectName = getProjectName(entry.project_id);
                  const startDate = new Date(entry.start_time);
                  const endDate = entry.end_time ? new Date(entry.end_time) : null;
                  
                  const formattedStartTime = startDate.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  });
                  
                  const formattedEndTime = endDate ? endDate.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  }) : '';
                  
                  const formattedTime = endDate 
                    ? `${formattedStartTime} - ${formattedEndTime}`
                    : formattedStartTime;
                  
                  return (
                    <div key={entry.id} className="bg-card rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                          <h3 className="font-medium">{entry.description}</h3>
                          <div className="flex items-center text-sm text-muted-foreground mt-1 space-x-4">
                            {projectName && (
                              <span className="flex items-center">
                                <Folder className="h-3.5 w-3.5 mr-1" />
                                {projectName}
                              </span>
                            )}
                            {tag && (
                              <span className="flex items-center">
                                <Tag className="h-3.5 w-3.5 mr-1" />
                                {tag}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center">
                          <div className="text-right mr-4">
                            <div className="font-mono font-medium">{formatTime(entry.duration)}</div>
                            <div className="text-xs text-muted-foreground mt-1">{formattedTime}</div>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => deleteTimeEntry(entry.id)}
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground bg-card rounded-lg">
                No time entries yet today. Start tracking your time!
              </div>
            )}
          </div>
        </div>
        
        <div className="md:col-span-1">
          <Card className="shadow-lg border-border/40">
            <CardContent className="p-4">
              <Tabs defaultValue="timer" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="timer">
                    <Clock className="h-4 w-4 mr-2" />
                    <span className="sr-only sm:not-sr-only">Timer</span>
                  </TabsTrigger>
                  <TabsTrigger value="calendar">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span className="sr-only sm:not-sr-only">Calendar</span>
                  </TabsTrigger>
                  <TabsTrigger value="info">
                    <Info className="h-4 w-4 mr-2" />
                    <span className="sr-only sm:not-sr-only">Info</span>
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="timer" className="pt-4">
                  <div className="flex flex-col space-y-4">
                    <div>
                      <h3 className="text-sm font-medium mb-2">Start time</h3>
                      <div className="grid grid-cols-4 gap-2">
                        <Input type="text" placeholder="HH" className="col-span-1" />
                        <Input type="text" placeholder="MM" className="col-span-1" />
                        <Select defaultValue="am">
                          <SelectTrigger className="col-span-2">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="am">AM</SelectItem>
                            <SelectItem value="pm">PM</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-2">End time</h3>
                      <div className="grid grid-cols-4 gap-2">
                        <Input type="text" placeholder="HH" className="col-span-1" />
                        <Input type="text" placeholder="MM" className="col-span-1" />
                        <Select defaultValue="am">
                          <SelectTrigger className="col-span-2">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="am">AM</SelectItem>
                            <SelectItem value="pm">PM</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-2">Duration</h3>
                      <div className="grid grid-cols-3 gap-2">
                        <Input type="text" placeholder="HH" className="col-span-1" />
                        <Input type="text" placeholder="MM" className="col-span-1" />
                        <Input type="text" placeholder="SS" className="col-span-1" />
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="calendar" className="pt-4">
                  <div className="space-y-4">
                    <CalendarComponent
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      className="rounded-md border"
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="info" className="pt-4">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium">Timer Tips</h3>
                      <p className="text-sm text-muted-foreground mt-2">Start the timer when you begin working and stop it when you're done. You can pause it when taking breaks.</p>
                    </div>
                    <Separator />
                    <div>
                      <h3 className="text-sm font-medium">Keyboard Shortcuts</h3>
                      <div className="text-sm text-muted-foreground mt-2 space-y-1">
                        <div className="flex justify-between">
                          <span>Start/Pause Timer</span>
                          <span className="font-mono">Alt + S</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Stop Timer</span>
                          <span className="font-mono">Alt + X</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Add New Entry</span>
                          <span className="font-mono">Alt + N</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          <Button className="w-full mt-4" onClick={() => setActiveTab('timer')}>
            <Plus className="h-4 w-4 mr-2" />
            Add Time Entry
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Timer;
