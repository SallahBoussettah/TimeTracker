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
import { PostgrestError } from '@supabase/supabase-js';

interface TimeEntry {
  id: string;
  description: string;
  duration: number;
  start_time: string;
  project_id: string | null;
  project_name?: string;
}

interface Project {
  id: string;
  name: string;
}

interface DisplayEntry {
  id: string;
  title: string;
  project: string;
  duration: string;
  color: string;
}

// Add a delay helper function at the top of the file
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Cache for time entries to reduce API calls
interface TimeEntriesCache {
  startDate: string;
  endDate: string;
  entries: TimeEntry[];
  timestamp: number;
}

let timeEntriesCache: TimeEntriesCache | null = null;
let projectsCache: Project[] | null = null;

const CalendarPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('week');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
    'default': 'bg-blue-600 text-white',
  };
  
  // Optimized fetchTimeEntries with caching
  const fetchTimeEntries = async () => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      const startISO = startDate.toISOString();
      const endISO = endDate.toISOString();
      
      // Check if we have cached data for this date range that's less than 2 minutes old
      const now = Date.now();
      if (timeEntriesCache && 
          timeEntriesCache.startDate === startISO && 
          timeEntriesCache.endDate === endISO && 
          now - timeEntriesCache.timestamp < 120000) {
        console.log("Using cached time entries data");
        setTimeEntries(timeEntriesCache.entries);
        setIsLoading(false);
        return;
      }
      
      // If projects aren't loaded, load them first (important: do this BEFORE time entries)
      if (!projectsCache || projects.length === 0) {
        await fetchProjects();
        // Add a small delay to prevent concurrent requests
        await delay(500);
      }
      
      // Now fetch time entries in a single call with retries
      let timeEntriesData = null;
      let timeEntriesError = null;
      
      for (let attempt = 0; attempt < 3; attempt++) {
        if (attempt > 0) {
          await delay(1000 * attempt);
          console.log(`Retry attempt ${attempt + 1} for time entries...`);
        }
        
        try {
          const response = await supabase
            .from('time_entries')
            .select('id, description, duration, start_time, project_id')
            .eq('user_id', user.id)
            .gte('start_time', startISO)
            .lte('start_time', endISO)
            .order('start_time', { ascending: false });
            
          if (!response.error) {
            timeEntriesData = response.data;
            break; // Success, exit retry loop
          } else {
            timeEntriesError = response.error;
          }
        } catch (e) {
          console.error("Network error during fetch attempt:", e);
        }
      }
      
      if (timeEntriesError) throw timeEntriesError;
      
      // Create a map of project IDs to names from the cached projects
      const projectNameMap = new Map(projectsCache?.map(p => [p.id, p.name]) || []);
      
      // Combine the data
      const entriesWithProjects = timeEntriesData?.map(entry => ({
        ...entry,
        project_name: entry.project_id ? projectNameMap.get(entry.project_id) : undefined
      })) || [];
      
      // Update the cache
      timeEntriesCache = {
        startDate: startISO,
        endDate: endISO,
        entries: entriesWithProjects,
        timestamp: now
      };
      
      setTimeEntries(entriesWithProjects);
      
    } catch (error: unknown) {
      const pgError = error as PostgrestError;
      console.error("Error fetching time entries:", pgError);
      setError(pgError.message || "Could not load your time entries due to a server error.");
      toast({
        title: "Error loading calendar",
        description: pgError.message || "Could not load your time entries. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Optimized fetchProjects function that will be called directly
  const fetchProjects = async (): Promise<boolean> => {
    if (!user) return false;
    
    // Use cached projects if available and less than 5 minutes old
    const now = Date.now();
    if (projectsCache && projects.length > 0) {
      console.log("Using cached projects data");
      return true;
    }
    
    // Implementation with retry logic
    for (let attempt = 0; attempt < 3; attempt++) {
      if (attempt > 0) {
        await delay(1000 * attempt);
        console.log(`Retry attempt ${attempt + 1} for projects...`);
      }
      
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('id, name')
          .eq('user_id', user.id);
          
        if (error) {
          console.error(`Project fetch attempt ${attempt + 1} failed:`, error);
          if (attempt === 2) {
            toast({
              title: "Error fetching projects",
              description: error.message || "Could not load your projects. Will try again later.",
              variant: "destructive"
            });
          }
          continue; // Try again
        }
        
        // Success
        projectsCache = data || [];
        setProjects(projectsCache);
        
        // Setup project colors
        const colors = [
          'bg-blue-600 text-white',
          'bg-green-600 text-white',
          'bg-purple-600 text-white',
          'bg-orange-600 text-white',
          'bg-pink-600 text-white'
        ];
        projectsCache.forEach((project, index) => {
          projectColors[project.id] = colors[index % colors.length];
        });
        
        return true;
      } catch (e) {
        console.error(`Project fetch attempt ${attempt + 1} error:`, e);
      }
    }
    
    // All attempts failed
    return false;
  };
  
  // Load projects on component mount
  useEffect(() => {
    if (user) {
      fetchProjects();
    }
  }, [user]);
  
  // Fetch time entries when date range changes
  useEffect(() => {
    if (user) {
      fetchTimeEntries();
    }
  }, [user, startDate, endDate]);
  
  // Improved getEntriesForDay function to handle timezone issues better
  const getEntriesForDay = (day: Date) => {
    // Set hours to 0 for comparison to avoid timezone issues
    const comparisonDay = new Date(day);
    comparisonDay.setHours(0, 0, 0, 0);
    
    const entriesForDay = timeEntries.filter(entry => {
      try {
        // Parse the date and normalize it for comparison
        const entryDate = parseISO(entry.start_time);
        const entryComparisonDate = new Date(entryDate);
        entryComparisonDate.setHours(0, 0, 0, 0);
        
        // Using simple date comparison instead of isSameDay to avoid timezone issues
        return comparisonDay.getFullYear() === entryComparisonDate.getFullYear() && 
               comparisonDay.getMonth() === entryComparisonDate.getMonth() && 
               comparisonDay.getDate() === entryComparisonDate.getDate();
      } catch (e) {
        console.error("Error parsing date:", entry.start_time, e);
        return false;
      }
    });
    
    console.log(`Entries for ${format(day, 'EEE dd')}: `, entriesForDay);
    
    // If we have entries but they might not be visible, log a warning
    if (entriesForDay.length > 0) {
      console.log(`Found ${entriesForDay.length} entries for ${format(day, 'EEE dd')}`);
    }
    
    // Map to display format
    return entriesForDay.map(entry => {
      const hours = Math.floor(entry.duration / 3600);
      const minutes = Math.floor((entry.duration % 3600) / 60);
      const durationFormatted = `${hours}h ${minutes}m`;
      
      // Get color from project or use default
      const bgColor = projectColors[entry.project_id || 'default'];
      
      return {
        id: entry.id,
        title: entry.description,
        project: entry.project_name || 'No Project',
        duration: durationFormatted,
        color: bgColor
      };
    });
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
  
  // Optimized handleAddEntry function
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
      
      const newEntryDate = new Date(newEntry.date);
      newEntryDate.setHours(12, 0, 0, 0);
      const newEndDate = new Date(newEntryDate.getTime() + (durationSeconds * 1000));
      
      const { error } = await supabase
        .from('time_entries')
        .insert({
          user_id: user.id,
          description: newEntry.title,
          project_id: newEntry.project_id || null,
          duration: durationSeconds,
          start_time: newEntryDate.toISOString(),
          end_time: newEndDate.toISOString()
        });
        
      if (error) throw error;
      
      toast({
        title: "Entry added",
        description: "Your time entry has been added successfully."
      });
      
      // Reset form
      setNewEntry({
        title: '',
        project_id: '',
        date: new Date(),
        hours: '',
        minutes: '',
        billable: false
      });
      
      setIsDialogOpen(false);
      
      // Force a full refresh of time entries instead of just relying on cache updates
      // This ensures any newly added entry will show up properly
      timeEntriesCache = null;
      fetchTimeEntries();
      
    } catch (error: unknown) {
      const pgError = error as PostgrestError;
      toast({
        title: "Error adding entry",
        description: pgError.message || "Could not add your time entry. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  if (error) {
    return (
      <DashboardLayout title="Calendar">
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
          <div className="text-destructive mb-4">
            <CalendarIcon className="h-12 w-12 mx-auto mb-4" />
            <h3 className="text-lg font-medium">Error loading calendar</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </DashboardLayout>
    );
  }
  
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
                    onChange={(e) => setNewEntry(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="What are you working on?" 
                  />
                </div>
                
                <div className="grid gap-2">
                  <label htmlFor="project" className="text-sm font-medium">Project</label>
                  <Select 
                    value={newEntry.project_id} 
                    onValueChange={(value) => setNewEntry(prev => ({ ...prev, project_id: value }))}
                  >
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
                  <div className="flex items-center p-2 rounded-md border">
                    <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{format(newEntry.date, 'EEEE, MMMM d, yyyy')}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <label htmlFor="hours" className="text-sm font-medium">Hours</label>
                    <Input 
                      id="hours" 
                      name="hours"
                      value={newEntry.hours}
                      onChange={(e) => setNewEntry(prev => ({ ...prev, hours: e.target.value }))}
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
                      onChange={(e) => setNewEntry(prev => ({ ...prev, minutes: e.target.value }))}
                      placeholder="0" 
                      type="number"
                      min="0"
                      max="59"
                    />
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="billable" 
                    checked={newEntry.billable}
                    onCheckedChange={(checked) => 
                      setNewEntry(prev => ({ ...prev, billable: checked as boolean }))
                    }
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
                    <div className="animate-pulse space-y-2">
                      <div className="h-14 bg-muted rounded-md"></div>
                      <div className="h-14 bg-muted rounded-md"></div>
                    </div>
                  ) : (
                    <>
                      {getEntriesForDay(day).map(entry => {
                        console.log(`Rendering entry for ${format(day, 'EEE dd')}:`, entry);
                        return (
                          <div 
                            key={entry.id} 
                            className={`p-2 rounded-md ${entry.color} cursor-pointer hover:opacity-90 transition-opacity shadow-sm font-medium mb-1`}
                          >
                            <div className="text-sm">{entry.title}</div>
                            <div className="text-xs flex justify-between">
                              <span className="truncate mr-1">{entry.project}</span>
                              <span className="whitespace-nowrap">{entry.duration}</span>
                            </div>
                          </div>
                        );
                      })}
                      
                      {/* Show a message if entries exist but might have visibility issues */}
                      {getEntriesForDay(day).length > 0 && getEntriesForDay(day).length === 0 && (
                        <div className="p-2 rounded-md bg-yellow-100 text-yellow-800 text-xs">
                          {getEntriesForDay(day).length} entries found but may have display issues
                        </div>
                      )}
                      
                      {!isLoading && getEntriesForDay(day).length === 0 && (
                        <button
                          className="w-full p-2 rounded-md border border-dashed border-border hover:border-primary/50 hover:bg-primary/5 transition-colors text-sm text-muted-foreground"
                          onClick={() => {
                            // Create a new date object to avoid reference issues
                            const selectedDate = new Date(day.getTime());
                            console.log("Selected date for new entry:", format(selectedDate, 'yyyy-MM-dd'));
                            setNewEntry(prev => ({
                              ...prev,
                              date: selectedDate
                            }));
                            setIsDialogOpen(true);
                          }}
                        >
                          <Plus className="h-4 w-4 mx-auto" />
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default CalendarPage;
