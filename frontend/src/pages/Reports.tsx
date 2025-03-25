
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

interface ProjectSummary {
  id: string;
  name: string;
  value: number;
  totalSeconds: number;
}

interface TimeEntry {
  id: string;
  description: string;
  project: string;
  tag: string;
  date: string;
  duration: string;
  durationSeconds: number;
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
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [timeRange, setTimeRange] = useState('week');
  const [isLoading, setIsLoading] = useState(true);
  
  const [stats, setStats] = useState({
    totalHours: "0h 0m",
    billableHours: "0h 0m",
    billableRate: "0%",
    avgDailyHours: "0h 0m",
    totalHoursTrend: { value: 0, isPositive: true },
    billableHoursTrend: { value: 0, isPositive: true },
    billableRateTrend: { value: 0, isPositive: true },
    avgDailyHoursTrend: { value: 0, isPositive: true }
  });
  
  const [barData, setBarData] = useState<DailyData[]>([]);
  const [pieData, setPieData] = useState<ProjectSummary[]>([]);
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  
  useEffect(() => {
    if (!user) return;
    
    const fetchReportData = async () => {
      setIsLoading(true);
      
      try {
        let startDate, endDate, previousStartDate, previousEndDate;
        
        // Determine date range based on selected option
        if (timeRange === 'day') {
          startDate = new Date(date!);
          startDate.setHours(0, 0, 0, 0);
          endDate = new Date(date!);
          endDate.setHours(23, 59, 59, 999);
          
          previousStartDate = subDays(startDate, 1);
          previousEndDate = subDays(endDate, 1);
        } else if (timeRange === 'week') {
          startDate = startOfWeek(date!, { weekStartsOn: 1 });
          endDate = endOfWeek(date!, { weekStartsOn: 1 });
          
          previousStartDate = subWeeks(startDate, 1);
          previousEndDate = subWeeks(endDate, 1);
        } else if (timeRange === 'month') {
          startDate = startOfMonth(date!);
          endDate = endOfMonth(date!);
          
          // Get previous month
          const prevMonth = new Date(date!);
          prevMonth.setMonth(prevMonth.getMonth() - 1);
          previousStartDate = startOfMonth(prevMonth);
          previousEndDate = endOfMonth(prevMonth);
        } else {
          // Default to current week
          startDate = startOfWeek(new Date(), { weekStartsOn: 1 });
          endDate = endOfWeek(new Date(), { weekStartsOn: 1 });
          
          previousStartDate = subWeeks(startDate, 1);
          previousEndDate = subWeeks(endDate, 1);
        }
        
        // Fetch current period time entries
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
        
        // Fetch previous period time entries for trend calculation
        const { data: prevEntriesData, error: prevEntriesError } = await supabase
          .from('time_entries')
          .select('duration')
          .eq('user_id', user.id)
          .gte('start_time', previousStartDate.toISOString())
          .lte('start_time', previousEndDate.toISOString());
          
        if (prevEntriesError) throw prevEntriesError;
        
        // Calculate total seconds for current period
        const totalSeconds = entriesData?.reduce((sum, entry) => sum + entry.duration, 0) || 0;
        
        // Calculate total seconds for previous period
        const prevTotalSeconds = prevEntriesData?.reduce((sum, entry) => sum + entry.duration, 0) || 0;
        
        // Calculate billable hours (for now, assume all are billable)
        const billableSeconds = totalSeconds; // In a real app, you'd filter by billable flag
        const prevBillableSeconds = prevTotalSeconds;
        
        // Calculate billable rate
        const billableRate = totalSeconds > 0 ? Math.round((billableSeconds / totalSeconds) * 100) : 0;
        const prevBillableRate = prevTotalSeconds > 0 ? Math.round((prevBillableSeconds / prevTotalSeconds) * 100) : 0;
        
        // Calculate average daily hours
        const days = timeRange === 'day' ? 1 : 
                    timeRange === 'week' ? 7 : 
                    new Date(endDate.getFullYear(), endDate.getMonth() + 1, 0).getDate();
        
        const avgDailySeconds = days > 0 ? totalSeconds / days : 0;
        const prevDays = timeRange === 'day' ? 1 : 
                       timeRange === 'week' ? 7 : 
                       new Date(previousEndDate.getFullYear(), previousEndDate.getMonth() + 1, 0).getDate();
        const prevAvgDailySeconds = prevDays > 0 ? prevTotalSeconds / prevDays : 0;
        
        // Calculate trends
        const totalHoursTrend = prevTotalSeconds > 0 
          ? Math.round(((totalSeconds - prevTotalSeconds) / prevTotalSeconds) * 100) 
          : 0;
          
        const billableHoursTrend = prevBillableSeconds > 0 
          ? Math.round(((billableSeconds - prevBillableSeconds) / prevBillableSeconds) * 100) 
          : 0;
          
        const billableRateTrend = prevBillableRate > 0 
          ? billableRate - prevBillableRate
          : 0;
          
        const avgDailyHoursTrend = prevAvgDailySeconds > 0 
          ? Math.round(((avgDailySeconds - prevAvgDailySeconds) / prevAvgDailySeconds) * 100) 
          : 0;
        
        // Format time values
        const totalHours = Math.floor(totalSeconds / 3600);
        const totalMinutes = Math.floor((totalSeconds % 3600) / 60);
        const totalHoursFormatted = `${totalHours}h ${totalMinutes}m`;
        
        const billableHours = Math.floor(billableSeconds / 3600);
        const billableMinutes = Math.floor((billableSeconds % 3600) / 60);
        const billableHoursFormatted = `${billableHours}h ${billableMinutes}m`;
        
        const avgDailyHours = Math.floor(avgDailySeconds / 3600);
        const avgDailyMinutes = Math.floor((avgDailySeconds % 3600) / 60);
        const avgDailyHoursFormatted = `${avgDailyHours}h ${avgDailyMinutes}m`;
        
        // Update stats
        setStats({
          totalHours: totalHoursFormatted,
          billableHours: billableHoursFormatted,
          billableRate: `${billableRate}%`,
          avgDailyHours: avgDailyHoursFormatted,
          totalHoursTrend: { 
            value: Math.abs(totalHoursTrend), 
            isPositive: totalHoursTrend >= 0 
          },
          billableHoursTrend: { 
            value: Math.abs(billableHoursTrend), 
            isPositive: billableHoursTrend >= 0 
          },
          billableRateTrend: { 
            value: Math.abs(billableRateTrend), 
            isPositive: billableRateTrend >= 0 
          },
          avgDailyHoursTrend: { 
            value: Math.abs(avgDailyHoursTrend), 
            isPositive: avgDailyHoursTrend >= 0 
          }
        });
        
        // Prepare bar chart data (daily breakdown)
        const dailyDataMap = new Map<string, DailyData>();
        
        // Initialize with all days in the period
        if (timeRange !== 'day') {
          const daysInPeriod = eachDayOfInterval({ start: startDate, end: endDate });
          daysInPeriod.forEach(day => {
            const dateStr = format(day, 'yyyy-MM-dd');
            dailyDataMap.set(dateStr, {
              name: format(day, 'EEE'),
              hours: 0,
              date: day
            });
          });
        } else {
          // Just one day for day view
          const dateStr = format(startDate, 'yyyy-MM-dd');
          dailyDataMap.set(dateStr, {
            name: format(startDate, 'EEE'),
            hours: 0,
            date: startDate
          });
        }
        
        // Sum up hours for each day
        entriesData?.forEach(entry => {
          const entryDate = parseISO(entry.start_time);
          const dateStr = format(entryDate, 'yyyy-MM-dd');
          const existingData = dailyDataMap.get(dateStr);
          
          if (existingData) {
            existingData.hours += entry.duration / 3600; // Convert seconds to hours
          }
        });
        
        // Convert map to array and sort by date
        const sortedDailyData = Array.from(dailyDataMap.values())
          .sort((a, b) => a.date.getTime() - b.date.getTime())
          .map(item => ({
            ...item,
            hours: parseFloat(item.hours.toFixed(1)) // Round to 1 decimal
          }));
        
        setBarData(sortedDailyData);
        
        // Prepare pie chart data (project distribution)
        const projectMap = new Map<string, ProjectSummary>();
        
        entriesData?.forEach(entry => {
          const projectId = entry.project_id || 'no-project';
          const projectName = entry.projects?.name || 'No Project';
          
          if (!projectMap.has(projectId)) {
            projectMap.set(projectId, {
              id: projectId,
              name: projectName,
              value: 0,
              totalSeconds: 0
            });
          }
          
          const project = projectMap.get(projectId)!;
          project.totalSeconds += entry.duration;
          project.value = Math.round(project.totalSeconds / 3600 * 100) / 100; // Round to 2 decimals
        });
        
        setPieData(Array.from(projectMap.values()));
        
        // Prepare time entries list
        const formattedEntries = entriesData?.map(entry => {
          const hours = Math.floor(entry.duration / 3600);
          const minutes = Math.floor((entry.duration % 3600) / 60);
          const durationFormatted = `${hours}h ${minutes}m`;
          
          return {
            id: entry.id,
            description: entry.description,
            project: entry.projects?.name || 'No Project',
            tag: 'Development', // Placeholder, could be added to your schema later
            date: format(parseISO(entry.start_time), 'MMM d, yyyy'),
            duration: durationFormatted,
            durationSeconds: entry.duration
          };
        }) || [];
        
        // Sort by most recent
        formattedEntries.sort((a, b) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });
        
        setTimeEntries(formattedEntries);
        
      } catch (error) {
        console.error("Error fetching report data:", error);
        toast({
          title: "Error loading reports",
          description: "Could not load report data. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchReportData();
  }, [user, date, timeRange, toast]);
  
  const handleTimeRangeChange = (value: string) => {
    setTimeRange(value);
  };
  
  return (
    <DashboardLayout title="Reports">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, 'MMM d, yyyy') : 'Select date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(date) => {
                  setDate(date);
                  setIsCalendarOpen(false);
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          
          <Select value={timeRange} onValueChange={handleTimeRangeChange}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="outline">
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="time">
        <TabsList className="mb-6">
          <TabsTrigger value="time">
            <Clock className="mr-2 h-4 w-4" />
            Time
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
        
        <TabsContent value="time" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Hours</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{isLoading ? '...' : stats.totalHours}</div>
                <p className="text-xs text-muted-foreground">
                  {isLoading ? '...' : (
                    <span className={stats.totalHoursTrend.isPositive ? "text-emerald-500" : "text-red-500"}>
                      {stats.totalHoursTrend.isPositive ? '+' : '-'}{stats.totalHoursTrend.value}%
                    </span>
                  )} from last {timeRange}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Billable Hours</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{isLoading ? '...' : stats.billableHours}</div>
                <p className="text-xs text-muted-foreground">
                  {isLoading ? '...' : (
                    <span className={stats.billableHoursTrend.isPositive ? "text-emerald-500" : "text-red-500"}>
                      {stats.billableHoursTrend.isPositive ? '+' : '-'}{stats.billableHoursTrend.value}%
                    </span>
                  )} from last {timeRange}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Billable Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{isLoading ? '...' : stats.billableRate}</div>
                <p className="text-xs text-muted-foreground">
                  {isLoading ? '...' : (
                    <span className={stats.billableRateTrend.isPositive ? "text-emerald-500" : "text-red-500"}>
                      {stats.billableRateTrend.isPositive ? '+' : '-'}{stats.billableRateTrend.value}%
                    </span>
                  )} from last {timeRange}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Avg. Daily Hours</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{isLoading ? '...' : stats.avgDailyHours}</div>
                <p className="text-xs text-muted-foreground">
                  {isLoading ? '...' : (
                    <span className={stats.avgDailyHoursTrend.isPositive ? "text-emerald-500" : "text-red-500"}>
                      {stats.avgDailyHoursTrend.isPositive ? '+' : '-'}{stats.avgDailyHoursTrend.value}%
                    </span>
                  )} from last {timeRange}
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Daily Breakdown</CardTitle>
                  <BarChart2 className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="h-[300px] flex items-center justify-center">
                    <div className="animate-pulse text-muted-foreground">Loading chart data...</div>
                  </div>
                ) : (
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsBarChart data={barData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip 
                          formatter={(value) => [`${value} hours`, 'Time Tracked']}
                          contentStyle={{ 
                            borderRadius: '6px', 
                            border: 'none', 
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' 
                          }}
                        />
                        <Bar dataKey="hours" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                      </RechartsBarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Time Distribution</CardTitle>
                  <PieChart className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="h-[300px] flex items-center justify-center">
                    <div className="animate-pulse text-muted-foreground">Loading chart data...</div>
                  </div>
                ) : (
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          fill="#8884d8"
                          paddingAngle={2}
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value) => [`${value} hours`, 'Time Tracked']}
                          contentStyle={{ 
                            borderRadius: '6px', 
                            border: 'none', 
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' 
                          }}
                        />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Detailed Time Entries</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-10 bg-muted rounded-md"></div>
                  <div className="h-20 bg-muted rounded-md"></div>
                  <div className="h-20 bg-muted rounded-md"></div>
                </div>
              ) : (
                <div className="rounded-md border">
                  <div className="grid grid-cols-6 bg-muted/50 p-3 text-sm font-medium">
                    <div className="col-span-2">Description</div>
                    <div>Project</div>
                    <div>Tag</div>
                    <div>Date</div>
                    <div className="text-right">Duration</div>
                  </div>
                  <div className="divide-y divide-border">
                    {timeEntries.length > 0 ? (
                      timeEntries.map(entry => (
                        <div key={entry.id} className="grid grid-cols-6 p-3 text-sm">
                          <div className="col-span-2">{entry.description}</div>
                          <div>{entry.project}</div>
                          <div>{entry.tag || 'Development'}</div>
                          <div>{entry.date}</div>
                          <div className="text-right font-mono">{entry.duration}</div>
                        </div>
                      ))
                    ) : (
                      <div className="p-6 text-center text-muted-foreground">
                        No time entries found for the selected period
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="projects" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pieData.length}</div>
                <p className="text-xs text-muted-foreground">
                  Projects with tracked time in this period
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Most Active Project</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {pieData.length > 0 ? 
                    pieData.sort((a, b) => b.totalSeconds - a.totalSeconds)[0]?.name : 
                    'None'
                  }
                </div>
                <p className="text-xs text-muted-foreground">
                  Based on tracked hours
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Project Completion</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">In Progress</div>
                <p className="text-xs text-muted-foreground">
                  Status of most active project
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Avg. Project Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {pieData.length > 0 ? 
                    (() => {
                      const avgSeconds = pieData.reduce((sum, p) => sum + p.totalSeconds, 0) / pieData.length;
                      const avgHours = Math.floor(avgSeconds / 3600);
                      const avgMinutes = Math.floor((avgSeconds % 3600) / 60);
                      return `${avgHours}h ${avgMinutes}m`;
                    })() : 
                    '0h 0m'
                  }
                </div>
                <p className="text-xs text-muted-foreground">
                  Average time per project
                </p>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Project Time Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-10 bg-muted rounded-md"></div>
                  <div className="h-20 bg-muted rounded-md"></div>
                </div>
              ) : (
                <div className="rounded-md border">
                  <div className="grid grid-cols-5 bg-muted/50 p-3 text-sm font-medium">
                    <div className="col-span-2">Project</div>
                    <div>Status</div>
                    <div>Team</div>
                    <div className="text-right">Time Spent</div>
                  </div>
                  <div className="divide-y divide-border">
                    {pieData.length > 0 ? (
                      pieData.map(project => (
                        <div key={project.id} className="grid grid-cols-5 p-3 text-sm">
                          <div className="col-span-2">{project.name}</div>
                          <div>
                            <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800">Active</span>
                          </div>
                          <div>You</div>
                          <div className="text-right font-mono">{`${project.value}h`}</div>
                        </div>
                      ))
                    ) : (
                      <div className="p-6 text-center text-muted-foreground">
                        No projects with tracked time in this period
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="team" className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-12">
                <Users className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-4 text-lg font-medium">Team Reports</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Team reporting functionality will be available in our upcoming Team plan.
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

export default Reports;
