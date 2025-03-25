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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval, isToday, isSameDay, parseISO, startOfMonth, endOfMonth } from 'date-fns';
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
  const [filterProject, setFilterProject] = useState<string | null>(null);
  
  const startDate = view === 'day' 
    ? new Date(currentDate) 
    : view === 'week'
      ? startOfWeek(currentDate, { weekStartsOn: 1 })
      : startOfMonth(currentDate);

  const endDate = view === 'day'
    ? new Date(currentDate)
    : view === 'week'
      ? endOfWeek(currentDate, { weekStartsOn: 1 })
      : endOfMonth(currentDate);

  const days = eachDayOfInterval({ start: startDate, end: endDate });
  
  // Project colors map for consistent coloring
  const projectColors: Record<string, string> = {
    'default': 'bg-blue-600 text-white',
  };
  
  // Function to get background color based on color class name
  const getColorFromClass = (colorClass: string): string => {
    if (!colorClass) return '#1d4ed8'; // Default blue
    
    if (colorClass.includes('blue')) return '#1d4ed8';
    if (colorClass.includes('emerald')) return '#047857';
    if (colorClass.includes('green')) return '#047857';
    if (colorClass.includes('violet')) return '#7c3aed';
    if (colorClass.includes('purple')) return '#7c3aed';
    if (colorClass.includes('amber')) return '#b45309';
    if (colorClass.includes('orange')) return '#b45309';
    if (colorClass.includes('rose')) return '#be123c';
    if (colorClass.includes('pink')) return '#be123c';
    
    return '#1d4ed8'; // Default fallback
  };
  
  // Optimized fetchTimeEntries with caching
  const fetchTimeEntries = async () => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      // For day view, add a buffer day on each side to ensure we get all entries
      let startISO = startDate.toISOString();
      let endISO = endDate.toISOString();
      
      if (view === 'day') {
        const bufferStart = new Date(startDate);
        bufferStart.setDate(bufferStart.getDate() - 1);
        const bufferEnd = new Date(endDate);
        bufferEnd.setDate(bufferEnd.getDate() + 1);
        startISO = bufferStart.toISOString();
        endISO = bufferEnd.toISOString();
      }
      
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
  
  // Add a useEffect to reset the cache when view changes
  useEffect(() => {
    // Clear the time entries cache when the view changes to force a refresh
    timeEntriesCache = null;
  }, [view]);
  
  // Fix getEntriesForDay to check if dates are the same by direct component comparison
  const getEntriesForDay = (day: Date) => {
    // For entries on the day we're interested in, be more permissive
    const dayMonth = day.getMonth();
    const dayDate = day.getDate();
    const dayYear = day.getFullYear();
    
    if (view === 'day') {
      console.log(`Looking for entries on: ${dayYear}-${dayMonth+1}-${dayDate}`);
    }
    
    const entriesForDay = timeEntries.filter(entry => {
      try {
        // Parse the entry date
        const entryDate = parseISO(entry.start_time);
        
        // Compare individual date components directly
        const sameDay = entryDate.getDate() === dayDate;
        const sameMonth = entryDate.getMonth() === dayMonth;
        const sameYear = entryDate.getFullYear() === dayYear;
        
        // Filter by project if a filter is set
        const projectMatches = !filterProject || entry.project_id === filterProject;
        
        // Match if all date components are the same
        const dateMatches = sameDay && sameMonth && sameYear;
        
        if (view === 'day' && dateMatches) {
          console.log(`MATCH FOUND: Entry ${entry.description} on ${format(entryDate, 'yyyy-MM-dd')}`);
        }
        
        return projectMatches && dateMatches;
      } catch (e) {
        console.error("Error parsing date:", e, entry);
        return false;
      }
    });
    
    if (view === 'day') {
      console.log(`Found ${entriesForDay.length} entries for ${dayYear}-${dayMonth+1}-${dayDate}`);
      if (entriesForDay.length === 0) {
        // Let's log all entries we have to diagnose the issue
        console.log("Available entries:", timeEntries.map(e => ({
          id: e.id,
          date: e.start_time,
          desc: e.description
        })));
      }
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
  
  const goToPreviousView = () => {
    if (view === 'day') {
      setCurrentDate(prevDate => addDays(prevDate, -1));
    } else if (view === 'week') {
      setCurrentDate(prevDate => addDays(prevDate, -7));
    } else {
      // Month view - go to previous month
      setCurrentDate(prevDate => {
        const newDate = new Date(prevDate);
        newDate.setMonth(newDate.getMonth() - 1);
        return newDate;
      });
    }
  };
  
  const goToNextView = () => {
    if (view === 'day') {
      setCurrentDate(prevDate => addDays(prevDate, 1));
    } else if (view === 'week') {
      setCurrentDate(prevDate => addDays(prevDate, 7));
    } else {
      // Month view - go to next month
      setCurrentDate(prevDate => {
        const newDate = new Date(prevDate);
        newDate.setMonth(newDate.getMonth() + 1);
        return newDate;
      });
    }
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
          <Button variant="outline" onClick={goToPreviousView}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" onClick={goToToday}>Today</Button>
          <Button variant="outline" onClick={goToNextView}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium">
            {view === 'day' 
              ? format(currentDate, 'MMM d, yyyy')
              : view === 'week'
                ? `${format(startDate, 'MMM d')} - ${format(endDate, 'MMM d, yyyy')}`
                : format(currentDate, 'MMMM yyyy')}
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
          
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[400px]">
              <DialogHeader>
                <DialogTitle>Filter Entries</DialogTitle>
                <DialogDescription>
                  Filter time entries by project
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <label htmlFor="filter-project" className="text-sm font-medium">Project</label>
                    <Select 
                      value={filterProject || ''} 
                      onValueChange={(value) => setFilterProject(value || null)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All Projects" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Projects</SelectItem>
                        {projects.map(project => (
                          <SelectItem key={project.id} value={project.id}>
                            {project.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setFilterProject(null)}>
                  Clear Filter
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
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
      
      {/* Day View */}
      {view === 'day' && (
        <Card>
          <CardHeader className="pb-2 flex flex-row justify-between items-center">
            <CardTitle className="text-xl">{format(currentDate, 'EEEE, MMMM d, yyyy')}</CardTitle>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                timeEntriesCache = null;
                fetchTimeEntries();
                toast({
                  title: "Calendar refreshed",
                  description: "Refreshing data from the server"
                });
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="mr-1"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path></svg>
              Refresh
            </Button>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                <div className="h-14 bg-muted rounded-md animate-pulse"></div>
                <div className="h-14 bg-muted rounded-md animate-pulse"></div>
                <div className="h-14 bg-muted rounded-md animate-pulse"></div>
              </div>
            ) : (
              <>
                {(() => {
                  const entries = getEntriesForDay(currentDate);
                  
                  if (entries.length > 0) {
                    return (
                      <div className="space-y-3">
                        {entries.map(entry => (
                          <div 
                            key={entry.id} 
                            className="flex items-center p-3 border rounded-md hover:bg-slate-50 transition-colors"
                          >
                            <div className={`w-2 h-full min-h-[3rem] rounded-full mr-3`} 
                                 style={{ backgroundColor: getColorFromClass(entry.color) }}></div>
                            <div className="flex-1">
                              <div className="font-medium">{entry.title}</div>
                              <div className="text-sm text-muted-foreground flex justify-between">
                                <span>{entry.project}</span>
                                <span>{entry.duration}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  } else {
                    return (
                      <div className="text-center py-8">
                        <div className="text-muted-foreground">No entries for this day</div>
                        <div className="mt-2 flex justify-center space-x-2">
                          <Button 
                            variant="outline" 
                            className="mt-4"
                            onClick={() => {
                              setNewEntry(prev => ({
                                ...prev,
                                date: new Date(currentDate)
                              }));
                              setIsDialogOpen(true);
                            }}
                          >
                            <Plus className="mr-2 h-4 w-4" />
                            Add Entry
                          </Button>
                        </div>
                      </div>
                    );
                  }
                })()}
              </>
            )}
          </CardContent>
        </Card>
      )}
      
      {/* Week View (unchanged) */}
      {view === 'week' && (
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
                        {getEntriesForDay(day).map(entry => (
                          <div 
                            key={entry.id} 
                            className={`p-2 rounded-md cursor-pointer hover:opacity-90 transition-opacity shadow border border-gray-300 mb-1 text-white`}
                            style={{ backgroundColor: getColorFromClass(entry.color) }}
                          >
                            <div className="text-sm font-medium">{entry.title}</div>
                            <div className="text-xs flex justify-between">
                              <span className="truncate mr-1">{entry.project}</span>
                              <span className="whitespace-nowrap">{entry.duration}</span>
                            </div>
                          </div>
                        ))}
                        
                        {!isLoading && getEntriesForDay(day).length === 0 && (
                          <button
                            className="w-full p-2 rounded-md border border-dashed border-border hover:border-primary/50 hover:bg-primary/5 transition-colors text-sm text-muted-foreground"
                            onClick={() => {
                              const selectedDate = new Date(day.getTime());
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
      )}
      
      {/* Month View */}
      {view === 'month' && (
        <Card>
          <CardContent className="p-0">
            <div className="grid grid-cols-7 border-b">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                <div key={index} className="p-3 text-center font-medium">
                  {day}
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 min-h-[600px]">
              {eachDayOfInterval({ 
                start: startOfMonth(currentDate),
                end: endOfMonth(currentDate)
              }).map((day, dayIndex) => {
                const entriesForThisDay = getEntriesForDay(day);
                const hasEntries = entriesForThisDay.length > 0;
                const isCurrentMonth = day.getMonth() === currentDate.getMonth();
                
                return (
                  <div 
                    key={dayIndex} 
                    className={`min-h-[100px] p-2 border ${
                      !isCurrentMonth ? 'opacity-30' : ''
                    } ${isToday(day) ? 'bg-primary/5' : ''}`}
                  >
                    <div className="flex flex-col h-full">
                      <div className={`text-sm font-medium ${isToday(day) ? 'text-primary' : ''}`}>
                        {format(day, 'd')}
                      </div>
                      
                      {/* Entry indicators */}
                      <div className="flex flex-wrap gap-1 mt-1">
                        {hasEntries && (
                          <div className="flex items-center gap-1 mt-1">
                            {entriesForThisDay.slice(0, 3).map((entry, i) => (
                              <div 
                                key={i}
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: getColorFromClass(entry.color) }}
                              ></div>
                            ))}
                            {entriesForThisDay.length > 3 && (
                              <span className="text-xs text-muted-foreground">+{entriesForThisDay.length - 3}</span>
                            )}
                          </div>
                        )}
                      </div>
                      
                      {/* Add button at the bottom */}
                      <div className="mt-auto pt-1">
                        <button
                          className="w-full h-6 flex items-center justify-center rounded-md opacity-0 hover:opacity-100 hover:bg-primary/5 transition-opacity"
                          onClick={() => {
                            const selectedDate = new Date(day.getTime());
                            setNewEntry(prev => ({
                              ...prev,
                              date: selectedDate
                            }));
                            setIsDialogOpen(true);
                          }}
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </DashboardLayout>
  );
};

export default CalendarPage;
