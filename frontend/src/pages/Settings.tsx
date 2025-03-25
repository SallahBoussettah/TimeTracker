import { 
  Bell, 
  Moon, 
  Sun, 
  Users, 
  Globe, 
  Mail, 
  MessageSquare, 
  Calendar as CalendarIcon,
  Languages
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import DashboardLayout from '@/components/DashboardLayout';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeProvider';

const Settings = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  
  // Theme state
  const [themeState, setThemeState] = useState<'light' | 'dark' | 'system'>('system');
  
  // Load theme settings on component mount
  useEffect(() => {
    // Get from localStorage for immediate application
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'system' | null;
    
    if (savedTheme) {
      setThemeState(savedTheme);
      applyTheme(savedTheme);
    } else {
      // Default to system if no theme is set
      applyTheme('system');
    }
  }, []);
  
  // Add an effect to listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      if (themeState === 'system') {
        applyTheme('system');
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [themeState]);
  
  // Function to apply theme
  const applyTheme = (selectedTheme: 'light' | 'dark' | 'system') => {
    const root = window.document.documentElement;
    
    if (selectedTheme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.remove('light', 'dark');
      root.classList.add(systemTheme);
    } else {
      root.classList.remove('light', 'dark');
      root.classList.add(selectedTheme);
    }
  };
  
  // Function to set theme
  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
    
    toast({
      title: "Theme updated",
      description: "Your theme preference has been saved.",
    });
  };
  
  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Your settings have been saved successfully.",
    });
  };
  
  return (
    <DashboardLayout title="Settings">
      <Tabs defaultValue="general">
        <TabsList className="mb-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Manage your general account settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select defaultValue="casablanca">
                  <SelectTrigger>
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="casablanca">Casablanca (GMT+1)</SelectItem>
                    <SelectItem value="pacific">Pacific Time (PT)</SelectItem>
                    <SelectItem value="mountain">Mountain Time (MT)</SelectItem>
                    <SelectItem value="central">Central Time (CT)</SelectItem>
                    <SelectItem value="eastern">Eastern Time (ET)</SelectItem>
                    <SelectItem value="london">London (GMT/BST)</SelectItem>
                    <SelectItem value="dubai">Dubai (GMT+4)</SelectItem>
                    <SelectItem value="tokyo">Tokyo (GMT+9)</SelectItem>
                    <SelectItem value="utc">Coordinated Universal Time (UTC)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select defaultValue="english">
                  <SelectTrigger className="flex items-center">
                    <Globe className="mr-2 h-4 w-4 text-muted-foreground" />
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English (US)</SelectItem>
                    <SelectItem value="spanish">Spanish</SelectItem>
                    <SelectItem value="french">French</SelectItem>
                    <SelectItem value="german">German</SelectItem>
                    <SelectItem value="japanese">Japanese</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="date-format">Date Format</Label>
                <Select defaultValue="mdy">
                  <SelectTrigger>
                    <SelectValue placeholder="Select date format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mdy">MM/DD/YYYY</SelectItem>
                    <SelectItem value="dmy">DD/MM/YYYY</SelectItem>
                    <SelectItem value="ymd">YYYY/MM/DD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="time-format">Time Format</Label>
                <Select defaultValue="12h">
                  <SelectTrigger>
                    <SelectValue placeholder="Select time format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="12h">12-hour (3:00 PM)</SelectItem>
                    <SelectItem value="24h">24-hour (15:00)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="first-day">First Day of Week</Label>
                <Select defaultValue="sunday">
                  <SelectTrigger>
                    <SelectValue placeholder="Select first day" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sunday">Sunday</SelectItem>
                    <SelectItem value="monday">Monday</SelectItem>
                    <SelectItem value="saturday">Saturday</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Working Days</Label>
                  <p className="text-sm text-muted-foreground">Days you typically work</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" className="rounded-full">M</Button>
                  <Button size="sm" variant="outline" className="rounded-full">T</Button>
                  <Button size="sm" variant="outline" className="rounded-full bg-primary text-primary-foreground">W</Button>
                  <Button size="sm" variant="outline" className="rounded-full bg-primary text-primary-foreground">T</Button>
                  <Button size="sm" variant="outline" className="rounded-full bg-primary text-primary-foreground">F</Button>
                  <Button size="sm" variant="outline" className="rounded-full">S</Button>
                  <Button size="sm" variant="outline" className="rounded-full">S</Button>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Auto Start Timer on Login</Label>
                  <p className="text-sm text-muted-foreground">Automatically start timer when you log in</p>
                </div>
                <Switch />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSave}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Manage how and when you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium">Email Notifications</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Weekly Summary</Label>
                      <p className="text-sm text-muted-foreground">Receive weekly summary of your activity</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Project Updates</Label>
                      <p className="text-sm text-muted-foreground">Notify when projects are updated</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Team Activity</Label>
                      <p className="text-sm text-muted-foreground">Notify about your team's activity</p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-medium">In-App Notifications</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Timer Reminders</Label>
                      <p className="text-sm text-muted-foreground">Reminder to start or stop timer</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Task Assignments</Label>
                      <p className="text-sm text-muted-foreground">Notify when you are assigned to a task</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Mentions</Label>
                      <p className="text-sm text-muted-foreground">Notify when someone mentions you</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSave}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
              <CardDescription>
                Customize the look and feel of the application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between mb-2">
                  <Label>Theme</Label>
                  <span className="text-sm text-muted-foreground">
                    Currently: <span className="font-medium">{theme === 'system' 
                      ? `System (${window.matchMedia('(prefers-color-scheme: dark)').matches ? 'Dark' : 'Light'})` 
                      : theme.charAt(0).toUpperCase() + theme.slice(1)}
                    </span>
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div 
                    className={`border rounded-md p-4 cursor-pointer flex items-center justify-center flex-col hover:border-primary ${theme === 'light' ? 'border-primary bg-secondary/50' : ''}`}
                    onClick={() => setTheme('light')}
                  >
                    <div className="bg-white dark:bg-transparent border border-border rounded-full p-2 mb-2">
                      <Sun className="h-5 w-5 text-amber-500" />
                    </div>
                    <span className="text-sm">Light</span>
                  </div>
                  <div 
                    className={`border rounded-md p-4 cursor-pointer flex items-center justify-center flex-col hover:border-primary ${theme === 'dark' ? 'border-primary bg-secondary/50' : ''}`}
                    onClick={() => setTheme('dark')}
                  >
                    <div className="bg-gray-900 border border-border rounded-full p-2 mb-2">
                      <Moon className="h-5 w-5 text-indigo-300" />
                    </div>
                    <span className="text-sm">Dark</span>
                  </div>
                  <div 
                    className={`border rounded-md p-4 cursor-pointer flex items-center justify-center flex-col hover:border-primary ${theme === 'system' ? 'border-primary bg-secondary/50' : ''}`}
                    onClick={() => setTheme('system')}
                  >
                    <div className="bg-gradient-to-r from-white to-gray-900 border border-border rounded-full p-2 mb-2">
                      <div className="flex">
                        <Sun className="h-5 w-5" />
                        <Moon className="h-5 w-5" />
                      </div>
                    </div>
                    <span className="text-sm">System</span>
                  </div>
                </div>
                
                <div className="mt-6 p-4 border rounded-md">
                  <h4 className="text-sm font-medium mb-2">Theme Preview</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-md border p-3 bg-card text-card-foreground shadow">
                      <div className="space-y-2">
                        <div className="h-2 w-1/2 rounded-sm bg-primary"></div>
                        <div className="h-2 w-3/4 rounded-sm bg-muted"></div>
                        <div className="h-2 w-1/4 rounded-sm bg-accent"></div>
                      </div>
                    </div>
                    <div className="rounded-md border p-3 flex items-center justify-center">
                      <div className="flex flex-wrap gap-2">
                        <div className="w-5 h-5 rounded-full bg-primary"></div>
                        <div className="w-5 h-5 rounded-full bg-secondary"></div>
                        <div className="w-5 h-5 rounded-full bg-accent"></div>
                        <div className="w-5 h-5 rounded-full bg-muted"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="density">Interface Density</Label>
                <Select defaultValue="comfortable">
                  <SelectTrigger id="density">
                    <SelectValue placeholder="Select density" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="compact">Compact</SelectItem>
                    <SelectItem value="comfortable">Comfortable</SelectItem>
                    <SelectItem value="spacious">Spacious</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="font-size">Font Size</Label>
                <Select defaultValue="medium">
                  <SelectTrigger id="font-size">
                    <SelectValue placeholder="Select font size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSave}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="integrations">
          <Card>
            <CardHeader>
              <CardTitle>Integrations</CardTitle>
              <CardDescription>
                Connect with other services and apps
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center">
                      <CalendarIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Google Calendar</h4>
                      <p className="text-sm text-muted-foreground">Sync your calendar events</p>
                    </div>
                  </div>
                  <Button variant="outline">Connect</Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Gmail</h4>
                      <p className="text-sm text-muted-foreground">Track time from emails</p>
                    </div>
                  </div>
                  <Button variant="outline">Connect</Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center">
                      <MessageSquare className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Slack</h4>
                      <p className="text-sm text-muted-foreground">Track time from conversations</p>
                    </div>
                  </div>
                  <Button variant="outline">Connect</Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center">
                      <Users className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Jira</h4>
                      <p className="text-sm text-muted-foreground">Track time on issues</p>
                    </div>
                  </div>
                  <div>
                    <Button variant="outline" className="bg-muted/50">Connected</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default Settings;
