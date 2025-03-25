import { useState, useEffect } from 'react';
import { 
  BarChart, 
  BarChart2, 
  PieChart, 
  Calendar as CalendarIcon, 
  Download, 
  Share2, 
  Filter, 
  Users, 
  Layers,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, startOfWeek, endOfWeek, subWeeks, startOfMonth, endOfMonth, parseISO, eachDayOfInterval, subDays } from 'date-fns';
import DashboardLayout from '@/components/DashboardLayout';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';

interface TimeEntry {
  id: string;
  description: string;
  duration: number;
  start_time: string;
  project_id: string | null;
  project?: {
    name: string;
  };
}

interface ProjectSummary {
  id: string;
  name: string;
  totalSeconds: number;
  percentage: number;
}

interface DailyData {
  name: string;
  hours: number;
  date: Date;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const Reports = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [date, setDate] = useState<Date>(new Date());
  const [timeRange, setTimeRange] = useState('week');
  const [isLoading, setIsLoading] = useState(true);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  
  const [stats, setStats] = useState({
    totalHours: "0h 0m",
    avgDailyHours: "0h 0m",
    projectCount: 0,
    totalEntries: 0
  });
  
  const [barData, setBarData] = useState<DailyData[]>([]);
  const [pieData, setPieData] = useState<ProjectSummary[]>([]);
  
  useEffect(() => {
    if (!user) return;
    fetchReportData();
  }, [user, date, timeRange]);
  
  const fetchReportData = async () => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      let startDate: Date, endDate: Date;
      
      // Determine date range based on selected option
      if (timeRange === 'day') {
        startDate = new Date(date);
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(date);
        endDate.setHours(23, 59, 59, 999);
      } else if (timeRange === 'week') {
        startDate = startOfWeek(date, { weekStartsOn: 1 });
        endDate = endOfWeek(date, { weekStartsOn: 1 });
      } else {
        startDate = startOfMonth(date);
        endDate = endOfMonth(date);
      }
      
      // Fetch time entries with project information
      const { data: entries, error: entriesError } = await supabase
        .from('time_entries')
        .select(`
          id,
          description,
          duration,
          start_time,
          project_id,
          projects (
            id,
            name
          )
        `)
        .eq('user_id', user.id)
        .gte('start_time', startDate.toISOString())
        .lte('start_time', endDate.toISOString());
      
      if (entriesError) throw entriesError;
      
      // Calculate total time and project statistics
      const totalSeconds = entries?.reduce((sum, entry) => sum + entry.duration, 0) || 0;
      
      // Calculate project summaries
      const projectMap = new Map<string, { name: string; totalSeconds: number }>();
      entries?.forEach(entry => {
        if (entry.project_id && entry.projects) {
          const existing = projectMap.get(entry.project_id) || { 
            name: entry.projects.name, 
            totalSeconds: 0 
          };
          projectMap.set(entry.project_id, {
            ...existing,
            totalSeconds: existing.totalSeconds + entry.duration
          });
        }
      });
      
      // Convert project data for pie chart
      const projectSummaries: ProjectSummary[] = Array.from(projectMap.entries())
        .map(([id, data]) => ({
          id,
          name: data.name,
          totalSeconds: data.totalSeconds,
          percentage: Math.round((data.totalSeconds / totalSeconds) * 100)
        }))
        .sort((a, b) => b.totalSeconds - a.totalSeconds);
      
      // Prepare daily data for bar chart
      const dailyDataMap = new Map<string, DailyData>();
      
      // Initialize with all days in the period
      const daysInPeriod = eachDayOfInterval({ start: startDate, end: endDate });
      daysInPeriod.forEach(day => {
        dailyDataMap.set(format(day, 'yyyy-MM-dd'), {
          name: format(day, 'EEE'),
          hours: 0,
          date: day
        });
      });
      
      // Sum up hours for each day
      entries?.forEach(entry => {
        const entryDate = format(parseISO(entry.start_time), 'yyyy-MM-dd');
        const existing = dailyDataMap.get(entryDate);
        if (existing) {
          existing.hours += entry.duration / 3600; // Convert seconds to hours
        }
      });
      
      // Format statistics
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const avgDailySeconds = totalSeconds / daysInPeriod.length;
      const avgHours = Math.floor(avgDailySeconds / 3600);
      const avgMinutes = Math.floor((avgDailySeconds % 3600) / 60);
      
      setStats({
        totalHours: `${hours}h ${minutes}m`,
        avgDailyHours: `${avgHours}h ${avgMinutes}m`,
        projectCount: projectMap.size,
        totalEntries: entries?.length || 0
      });
      
      setPieData(projectSummaries);
      setBarData(Array.from(dailyDataMap.values()));
      
    } catch (error) {
      console.error('Error fetching report data:', error);
      toast({
        title: 'Error loading reports',
        description: 'Could not load report data. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleTimeRangeChange = (value: string) => {
    setTimeRange(value);
  };
  
  return (
    <DashboardLayout title="Reports">
      <div className="space-y-4">
        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Select value={timeRange} onValueChange={handleTimeRangeChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Day</SelectItem>
                <SelectItem value="week">Week</SelectItem>
                <SelectItem value="month">Month</SelectItem>
              </SelectContent>
            </Select>
            
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(date, 'PPP')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(date) => {
                    setDate(date || new Date());
                    setIsCalendarOpen(false);
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalHours}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Daily Average</CardTitle>
              <BarChart2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.avgDailyHours}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Projects</CardTitle>
              <Layers className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.projectCount}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Time Entries</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalEntries}</div>
            </CardContent>
          </Card>
        </div>
        
        {/* Charts */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Time Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="hours" fill="#8884d8" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Project Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={pieData}
                      dataKey="totalSeconds"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={({ name, percentage }) => `${name} (${percentage}%)`}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={entry.id} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Reports;
