
import { useState } from 'react';
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
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval, isToday, isSameDay } from 'date-fns';
import DashboardLayout from '@/components/DashboardLayout';

// Sample time entry data
const timeEntries = [
  {
    id: 1,
    title: 'Frontend Development',
    project: 'TimeTrack App',
    start: new Date(),
    duration: '3h 15m',
    color: 'bg-blue-500'
  },
  {
    id: 2,
    title: 'Team Meeting',
    project: 'Marketing Campaign',
    start: addDays(new Date(), 1),
    duration: '1h 30m',
    color: 'bg-green-500'
  },
  {
    id: 3,
    title: 'UI Design',
    project: 'Client Portal',
    start: addDays(new Date(), 2),
    duration: '2h 45m',
    color: 'bg-purple-500'
  },
  {
    id: 4,
    title: 'Client Presentation',
    project: 'Website Redesign',
    start: addDays(new Date(), 2),
    duration: '1h 00m',
    color: 'bg-orange-500'
  },
  {
    id: 5,
    title: 'Bug Fixing',
    project: 'TimeTrack App',
    start: addDays(new Date(), 3),
    duration: '4h 00m',
    color: 'bg-blue-500'
  }
];

const CalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('week');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const startDate = startOfWeek(currentDate, { weekStartsOn: 1 });
  const endDate = endOfWeek(currentDate, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: startDate, end: endDate });
  
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
                  <Input id="title" placeholder="What are you working on?" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <label htmlFor="project" className="text-sm font-medium">Project</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select project" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="timetrack">TimeTrack App</SelectItem>
                        <SelectItem value="marketing">Marketing Campaign</SelectItem>
                        <SelectItem value="website">Website Redesign</SelectItem>
                        <SelectItem value="client">Client Portal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="tag" className="text-sm font-medium">Tag</label>
                    <Select>
                      <SelectTrigger>
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
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <label htmlFor="date" className="text-sm font-medium">Date</label>
                    <div className="flex">
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        <span>{format(currentDate, 'MMM dd, yyyy')}</span>
                      </Button>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="duration" className="text-sm font-medium">Duration</label>
                    <div className="flex gap-2">
                      <Input placeholder="HH" className="w-1/2" />
                      <Input placeholder="MM" className="w-1/2" />
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 mt-2">
                  <Checkbox id="billable" />
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
                <Button onClick={() => setIsDialogOpen(false)}>
                  Add Entry
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
                      {getEntriesForDay(day).map(entry => (
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
                      ))}
                      
                      {dayIndex <= 4 && getEntriesForDay(day).length === 0 && (
                        <button
                          className="w-full p-2 rounded-md border border-dashed border-border hover:border-primary/50 hover:bg-primary/5 transition-colors text-sm text-muted-foreground"
                          onClick={() => setIsDialogOpen(true)}
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
