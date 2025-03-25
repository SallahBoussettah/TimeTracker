
import { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Filter, 
  Clock, 
  Check, 
  Layers, 
  Users 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval, isToday, isSameDay, parseISO } from 'date-fns';
import DashboardLayout from '@/components/DashboardLayout';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

interface TimeEntry {
  id: string;
  title: string;
  project: string;
  project_id: string;
  start: Date;
  duration: string;
  color: string;
  description: string;
}

interface Project {
  id: string;
  name: string;
}

const CalendarPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('week');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newEntry, setNewEntry] = useState({
    title: '',
    project_id: '',
    date: new Date(),
    hours: '',
    minutes: '',
    billable: false
  });
  
  const startDate = startOfWeek(currentDate, { weekStartsOn: 1 });
  const endDate = endOfWeek(currentDate, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: startDate, end: endDate });
  
  // Project colors map for consistent coloring
  const projectColors: Record<string, string> = {
    'default': 'bg-blue-500',
  };
  
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
        
        // Setup project colors
        data?.forEach((project, index) => {
          const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-pink-500'];
          projectColors[project.id] = colors[index % colors.length];
        });
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };
    
    fetchProjects();
  }, [user]);
  
  useEffect(() => {
    const fetchTimeEntries = async () => {
      if (!user) return;
      
      setIsLoading(true);
      
      try {
        // Get start and end of the displayed week in ISO format
        const startISO = startDate.toISOString();
        const endISO = endDate.toISOString();
        
        const { data: entriesData, error: entriesError } = await supabase
          .from('time_entries')
          .select(`
            id, 
            description, 
            duration, 
            start_time, 
            project_id,
            projects(name)
          `)
          .eq('user_id', user.id)
          .gte('start_time', startISO)
          .lte('start_time', endISO);
          
        if (entriesError) throw entriesError;
        
        // Transform the data
        const formattedEntries = entriesData?.map(entry => {
          // Format duration as hours and minutes
          const hours = Math.floor(entry.duration / 3600);
          const minutes = Math.floor((entry.duration % 3600) / 60);
          const durationFormatted = `${hours}h ${minutes}m`;
          
          // Get project name
          const projectName = entry.projects?.name || 'No Project';
          
          // Get project color or use default
          const color = projectColors[entry.project_id || 'default'] || 'bg-blue-500';
          
          return {
            id: entry.id,
            title: entry.description,
            description: entry.description,
            project: projectName,
            project_id: entry.project_id,
            start: parseISO(entry.start_time),
            duration: durationFormatted,
            color
          };
        }) || [];
        
        setTimeEntries(formattedEntries);
      } catch (error) {
        console.error("Error fetching time entries:", error);
        toast({
          title: "Error loading calendar",
          description: "Could not load your time entries. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTimeEntries();
  }, [user, startDate, endDate, toast]);
  
  const getEntriesForDay = (day: Date) => {
    return timeEntries.filter(entry => isSameDay(entry.start, day));
  };
  
  const goToPreviousWeek = () => {
    setCurrentDate(prevDate => addDays(prevDate, -7));
  };
  
  const goToNextWeek = () => {
    setCurrentDate(prevDate => addDays(prevDate, 7));
  };
  
  const goToToday = () => {
    setCurrentDate(new Date());
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewEntry(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleProjectChange = (value: string) => {
    setNewEntry(prev => ({
      ...prev,
      project_id: value
    }));
  };
  
  const handleDateChange = (date: Date) => {
    setNewEntry(prev => ({
      ...prev,
      date
    }));
  };
  
  const handleBillableChange = (checked: boolean) => {
    setNewEntry(prev => ({
      ...prev,
      billable: checked
    }));
  };
  
  const handleAddEntry = async () => {
    if (!user) return;
    if (!newEntry.title.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a title for your time entry.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Parse hours and minutes to seconds
      const hours = parseInt(newEntry.hours) || 0;
      const minutes = parseInt(newEntry.minutes) || 0;
      const durationSeconds = (hours * 3600) + (minutes * 60);
      
      if (durationSeconds <= 0) {
        toast({
          title: "Invalid duration",
          description: "Please enter a valid duration.",
          variant: "destructive"
        });
        return;
      }
      
      // Set the time of the date object to noon to avoid timezone issues
      const startDate = new Date(newEntry.date);
      startDate.setHours(12, 0, 0, 0);
      
      // Calculate end time
      const endDate = new Date(startDate.getTime() + (durationSeconds * 1000));
      
      const { error } = await supabase
        .from('time_entries')
        .insert({
          user_id: user.id,
          description: newEntry.title,
          project_id: newEntry.project_id || null,
          duration: durationSeconds,
          start_time: startDate.toISOString(),
          end_time: endDate.toISOString()
        });
        
      if (error) throw error;
      
      toast({
        title: "Entry added",
        description: "Your time entry has been added successfully."
      });
      
      // Reset form and reload entries
      setNewEntry({
        title: '',
        project_id: '',
        date: new Date(),
        hours: '',
        minutes: '',
        billable: false
      });
      
      setIsDialogOpen(false);
      
      // Refresh entries
      const { data: entriesData, error: entriesError } = await supabase
        .from('time_entries')
        .select(`
          id, 
          description, 
          duration, 
          start_time, 
          project_id,
          projects(name)
        `)
        .eq('user_id', user.id)
        .gte('start_time', startDate.toISOString())
        .lte('start_time', endDate.toISOString());
        
      if (entriesError) throw entriesError;
      
      // Transform the data
      const formattedEntries = entriesData?.map(entry => {
        const hours = Math.floor(entry.duration / 3600);
        const minutes = Math.floor((entry.duration % 3600) / 60);
        const durationFormatted = `${hours}h ${minutes}m`;
        
        const projectName = entry.projects?.name || 'No Project';
        const color = projectColors[entry.project_id || 'default'] || 'bg-blue-500';
        
        return {
          id: entry.id,
          title: entry.description,
          description: entry.description,
          project: projectName,
          project_id: entry.project_id,
          start: parseISO(entry.start_time),
          duration: durationFormatted,
          color
        };
      }) || [];
      
      setTimeEntries(formattedEntries);
      
    } catch (error: any) {
      toast({
        title: "Error adding entry",
        description: error.message || "Could not add your time entry. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <DashboardLayout title="Calendar">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" onClick={goToPreviousWeek}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" onClick={goToToday}>Today</Button>
          <Button variant="outline" onClick={goToNextWeek}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium">
            {format(startDate, 'MMM d')} - {format(endDate, 'MMM d, yyyy')}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <Select defaultValue={view} onValueChange={setView}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="View" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Day</SelectItem>
              <SelectItem value="week">Week</SelectItem>
              <SelectItem value="month">Month</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Entry
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add Time Entry</DialogTitle>
                <DialogDescription>
                  Create a new time entry for your calendar
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <label htmlFor="title" className="text-sm font-medium">Title</label>
                  <Input 
                    id="title" 
                    name="title"
                    value={newEntry.title}
                    onChange={handleInputChange}
                    placeholder="What are you working on?" 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <label htmlFor="project" className="text-sm font-medium">Project</label>
                    <Select value={newEntry.project_id} onValueChange={handleProjectChange}>
                      <SelectTrigger>
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
                  <div className="grid gap-2">
                    <label htmlFor="date" className="text-sm font-medium">Date</label>
                    <div className="flex">
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        <span>{format(newEntry.date, 'MMM dd, yyyy')}</span>
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <label htmlFor="hours" className="text-sm font-medium">Hours</label>
                    <Input 
                      id="hours" 
                      name="hours"
                      value={newEntry.hours}
                      onChange={handleInputChange}
                      placeholder="0" 
                      type="number"
                      min="0"
                      max="24"
                    />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="minutes" className="text-sm font-medium">Minutes</label>
                    <Input 
                      id="minutes" 
                      name="minutes"
                      value={newEntry.minutes}
                      onChange={handleInputChange}
                      placeholder="0" 
                      type="number"
                      min="0"
                      max="59"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2 mt-2">
                  <Checkbox 
                    id="billable" 
                    checked={newEntry.billable}
                    onCheckedChange={handleBillableChange}
                  />
                  <label
                    htmlFor="billable"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Billable
                  </label>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddEntry} disabled={isLoading}>
                  {isLoading ? 'Adding...' : 'Add Entry'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <Tabs defaultValue="calendar">
        <TabsList className="mb-6">
          <TabsTrigger value="calendar">
            <CalendarIcon className="mr-2 h-4 w-4" />
            Calendar
          </TabsTrigger>
          <TabsTrigger value="timeline">
            <Clock className="mr-2 h-4 w-4" />
            Timeline
          </TabsTrigger>
          <TabsTrigger value="projects">
            <Layers className="mr-2 h-4 w-4" />
            Projects
          </TabsTrigger>
          <TabsTrigger value="team">
            <Users className="mr-2 h-4 w-4" />
            Team
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="calendar">
          <Card>
            <CardContent className="p-0">
              <div className="grid grid-cols-7 border-b">
                {days.map((day, index) => (
                  <div 
                    key={index} 
                    className={`p-3 text-center border-r last:border-r-0 ${
                      isToday(day) ? 'bg-primary/10 font-medium' : ''
                    }`}
                  >
                    <div className="text-sm font-medium">{format(day, 'EEE')}</div>
                    <div className={`text-lg ${isToday(day) ? 'text-primary' : ''}`}>
                      {format(day, 'd')}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-7 min-h-[600px]">
                {days.map((day, dayIndex) => (
                  <div 
                    key={dayIndex} 
                    className={`p-2 border-r last:border-r-0 ${
                      isToday(day) ? 'bg-primary/5' : ''
                    }`}
                  >
                    <div className="space-y-2">
                      {isLoading ? (
                        <div className="p-2 rounded-md bg-muted animate-pulse h-14"></div>
                      ) : (
                        getEntriesForDay(day).map(entry => (
                          <div 
                            key={entry.id} 
                            className={`p-2 rounded-md ${entry.color} text-white cursor-pointer hover:opacity-90 transition-opacity`}
                          >
                            <div className="font-medium text-sm">{entry.title}</div>
                            <div className="text-xs flex justify-between">
                              <span>{entry.project}</span>
                              <span>{entry.duration}</span>
                            </div>
                          </div>
                        ))
                      )}
                      
                      {!isLoading && dayIndex <= 4 && getEntriesForDay(day).length === 0 && (
                        <button
                          className="w-full p-2 rounded-md border border-dashed border-border hover:border-primary/50 hover:bg-primary/5 transition-colors text-sm text-muted-foreground"
                          onClick={() => {
                            setNewEntry(prev => ({
                              ...prev,
                              date: day
                            }));
                            setIsDialogOpen(true);
                          }}
                        >
                          <Plus className="h-4 w-4 mx-auto" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="timeline">
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-12">
                <CalendarIcon className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-4 text-lg font-medium">Timeline View</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  The timeline view allows you to see your time entries in a chronological sequence.
                </p>
                <Button className="mt-4">
                  <Check className="mr-2 h-4 w-4" />
                  Coming Soon
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="projects">
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-12">
                <Layers className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-4 text-lg font-medium">Projects View</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  The projects view allows you to organize time entries by project.
                </p>
                <Button className="mt-4">
                  <Check className="mr-2 h-4 w-4" />
                  Coming Soon
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="team">
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-12">
                <Users className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-4 text-lg font-medium">Team View</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  The team view allows you to see time entries for all team members.
                </p>
                <Button className="mt-4">
                  <Check className="mr-2 h-4 w-4" />
                  Coming Soon
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default CalendarPage;
