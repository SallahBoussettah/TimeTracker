
import { useState, useEffect } from 'react';
import { Play, Pause, StopCircle, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

const TimerCard = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [description, setDescription] = useState('');
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    let interval: number | undefined;
    
    if (isRunning) {
      interval = window.setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning]);

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
  };

  const handleEditClick = () => {
    setEditing(true);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
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
    <Card className="glass shadow-lg animate-scale-in overflow-hidden border-primary/10">
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
              <p className="text-sm text-muted-foreground mt-1">Today</p>
            </div>
            <div className="text-3xl font-mono font-medium tabular-nums">
              {formatTime(time)}
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
  );
};

export default TimerCard;
