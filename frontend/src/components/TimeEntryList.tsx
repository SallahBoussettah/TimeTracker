
import { useState } from 'react';
import { Edit2, Trash2, Play, MoreVertical } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Mock data for time entries
const mockTimeEntries = [
  {
    id: 1,
    description: 'Project Research',
    duration: 4500, // in seconds
    date: new Date(2023, 6, 19, 10, 30),
    project: 'Marketing'
  },
  {
    id: 2,
    description: 'Client Meeting',
    duration: 3600,
    date: new Date(2023, 6, 19, 14, 0),
    project: 'Sales'
  },
  {
    id: 3,
    description: 'UI Design',
    duration: 7200,
    date: new Date(2023, 6, 19, 16, 0),
    project: 'Design'
  },
  {
    id: 4,
    description: 'Bug Fixing',
    duration: 3000,
    date: new Date(2023, 6, 18, 9, 0),
    project: 'Development'
  }
];

// Project colors for the badges
const projectColors: Record<string, string> = {
  Marketing: 'bg-blue-100 text-blue-800',
  Sales: 'bg-green-100 text-green-800',
  Design: 'bg-purple-100 text-purple-800',
  Development: 'bg-orange-100 text-orange-800'
};

const TimeEntryList = () => {
  const [timeEntries, setTimeEntries] = useState(mockTimeEntries);
  
  const formatDuration = (durationInSeconds: number) => {
    const hours = Math.floor(durationInSeconds / 3600);
    const minutes = Math.floor((durationInSeconds % 3600) / 60);
    
    return `${hours}h ${minutes}m`;
  };
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const deleteEntry = (id: number) => {
    setTimeEntries(timeEntries.filter(entry => entry.id !== id));
  };
  
  const continueTiming = (entry: typeof mockTimeEntries[0]) => {
    // Implementation would continue timing with the same description and project
    console.log('Continue timing', entry);
  };

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
                  <span className={`ml-3 px-2 py-0.5 rounded-full text-xs font-medium ${projectColors[entry.project]}`}>
                    {entry.project}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {entry.date.toLocaleDateString()} • {formatTime(entry.date)}
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
