
import { useState } from 'react';
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
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import DashboardLayout from '@/components/DashboardLayout';

const Timer = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [description, setDescription] = useState('');
  const [editing, setEditing] = useState(false);
  const [project, setProject] = useState('');
  const [tag, setTag] = useState('');
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [activeTab, setActiveTab] = useState('timer');

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
    setIsRunning(!isRunning);
  };

  const stopTimer = () => {
    setIsRunning(false);
    // Here we would normally save the time entry
    setTime(0);
    setDescription('');
    setProject('');
    setTag('');
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
                    <Select value={project} onValueChange={setProject}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select project" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="design">UI Design</SelectItem>
                        <SelectItem value="development">Development</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
                        <SelectItem value="research">Research</SelectItem>
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

          {/* Recent Time Entries */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Today's Entries</h2>
            <div className="divide-y divide-border space-y-2">
              <div className="bg-card rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <h3 className="font-medium">UI Design for TimeTrack</h3>
                    <div className="flex items-center text-sm text-muted-foreground mt-1 space-x-4">
                      <span className="flex items-center">
                        <Folder className="h-3.5 w-3.5 mr-1" />
                        Design
                      </span>
                      <span className="flex items-center">
                        <Tag className="h-3.5 w-3.5 mr-1" />
                        Billable
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-medium">01:45:00</div>
                    <div className="text-xs text-muted-foreground mt-1">9:00 AM - 10:45 AM</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-card rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <h3 className="font-medium">Client Meeting</h3>
                    <div className="flex items-center text-sm text-muted-foreground mt-1 space-x-4">
                      <span className="flex items-center">
                        <Folder className="h-3.5 w-3.5 mr-1" />
                        Marketing
                      </span>
                      <span className="flex items-center">
                        <Tag className="h-3.5 w-3.5 mr-1" />
                        Meeting
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-medium">00:45:00</div>
                    <div className="text-xs text-muted-foreground mt-1">11:00 AM - 11:45 AM</div>
                  </div>
                </div>
              </div>
            </div>
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
          
          <Button className="w-full mt-4">
            <Plus className="h-4 w-4 mr-2" />
            Add Time Entry
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Timer;
