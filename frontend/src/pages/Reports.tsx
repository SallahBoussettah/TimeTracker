
import { useState } from 'react';
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
import { format } from 'date-fns';
import DashboardLayout from '@/components/DashboardLayout';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';

const barData = [
  { name: 'Mon', hours: 5.2 },
  { name: 'Tue', hours: 6.8 },
  { name: 'Wed', hours: 4.3 },
  { name: 'Thu', hours: 7.1 },
  { name: 'Fri', hours: 6.5 },
  { name: 'Sat', hours: 2.1 },
  { name: 'Sun', hours: 0.5 },
];

const pieData = [
  { name: 'Development', value: 32 },
  { name: 'Design', value: 18 },
  { name: 'Marketing', value: 12 },
  { name: 'Meetings', value: 8 },
  { name: 'Research', value: 6 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const Reports = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [timeRange, setTimeRange] = useState('week');
  
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
          
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
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
                <div className="text-2xl font-bold">32.5h</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-emerald-500">+8%</span> from last week
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Billable Hours</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">28.2h</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-emerald-500">+12%</span> from last week
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Billable Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">87%</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-emerald-500">+3%</span> from last week
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Avg. Daily Hours</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">6.5h</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-emerald-500">+5%</span> from last week
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
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Detailed Time Entries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-6 bg-muted/50 p-3 text-sm font-medium">
                  <div className="col-span-2">Description</div>
                  <div>Project</div>
                  <div>Tag</div>
                  <div>Date</div>
                  <div className="text-right">Duration</div>
                </div>
                <div className="divide-y divide-border">
                  <div className="grid grid-cols-6 p-3 text-sm">
                    <div className="col-span-2">Frontend Development</div>
                    <div>TimeTrack</div>
                    <div>Development</div>
                    <div>May 12, 2023</div>
                    <div className="text-right font-mono">3h 15m</div>
                  </div>
                  <div className="grid grid-cols-6 p-3 text-sm">
                    <div className="col-span-2">Client Meeting</div>
                    <div>Marketing</div>
                    <div>Meeting</div>
                    <div>May 11, 2023</div>
                    <div className="text-right font-mono">1h 30m</div>
                  </div>
                  <div className="grid grid-cols-6 p-3 text-sm">
                    <div className="col-span-2">UI Design</div>
                    <div>TimeTrack</div>
                    <div>Design</div>
                    <div>May 10, 2023</div>
                    <div className="text-right font-mono">2h 45m</div>
                  </div>
                  <div className="grid grid-cols-6 p-3 text-sm">
                    <div className="col-span-2">Bug Fixing</div>
                    <div>TimeTrack</div>
                    <div>Development</div>
                    <div>May 10, 2023</div>
                    <div className="text-right font-mono">4h 00m</div>
                  </div>
                  <div className="grid grid-cols-6 p-3 text-sm">
                    <div className="col-span-2">Content Writing</div>
                    <div>Blog</div>
                    <div>Marketing</div>
                    <div>May 9, 2023</div>
                    <div className="text-right font-mono">2h 20m</div>
                  </div>
                </div>
              </div>
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
                <div className="text-2xl font-bold">7</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-emerald-500">+1</span> from last month
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Completed Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-emerald-500">+3</span> from last month
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Project Completion Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">92%</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-emerald-500">+4%</span> from last month
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Avg. Project Duration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">14 days</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-emerald-500">-2 days</span> from last month
                </p>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Project Time Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-5 bg-muted/50 p-3 text-sm font-medium">
                  <div className="col-span-2">Project</div>
                  <div>Status</div>
                  <div>Team</div>
                  <div className="text-right">Time Spent</div>
                </div>
                <div className="divide-y divide-border">
                  <div className="grid grid-cols-5 p-3 text-sm">
                    <div className="col-span-2">TimeTrack App Development</div>
                    <div>
                      <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800">Active</span>
                    </div>
                    <div>5 members</div>
                    <div className="text-right font-mono">48h 20m</div>
                  </div>
                  <div className="grid grid-cols-5 p-3 text-sm">
                    <div className="col-span-2">Marketing Campaign</div>
                    <div>
                      <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800">Active</span>
                    </div>
                    <div>3 members</div>
                    <div className="text-right font-mono">24h 15m</div>
                  </div>
                  <div className="grid grid-cols-5 p-3 text-sm">
                    <div className="col-span-2">Website Redesign</div>
                    <div>
                      <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800">Active</span>
                    </div>
                    <div>4 members</div>
                    <div className="text-right font-mono">36h 45m</div>
                  </div>
                  <div className="grid grid-cols-5 p-3 text-sm">
                    <div className="col-span-2">Content Creation</div>
                    <div>
                      <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800">Active</span>
                    </div>
                    <div>2 members</div>
                    <div className="text-right font-mono">18h 30m</div>
                  </div>
                  <div className="grid grid-cols-5 p-3 text-sm">
                    <div className="col-span-2">Client Portal</div>
                    <div>
                      <span className="inline-flex items-center rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-medium text-orange-800">On Hold</span>
                    </div>
                    <div>3 members</div>
                    <div className="text-right font-mono">12h 10m</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="team" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Team Members</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-emerald-500">+2</span> from last month
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Avg. Member Hours</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">34.5h</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-emerald-500">+2.1h</span> from last week
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Team Utilization</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">86%</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-emerald-500">+4%</span> from last week
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Avg. Response Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1.2h</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-emerald-500">-0.3h</span> from last week
                </p>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Team Member Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-6 bg-muted/50 p-3 text-sm font-medium">
                  <div className="col-span-2">Team Member</div>
                  <div>Role</div>
                  <div>Projects</div>
                  <div>Tasks</div>
                  <div className="text-right">Hours Tracked</div>
                </div>
                <div className="divide-y divide-border">
                  <div className="grid grid-cols-6 p-3 text-sm">
                    <div className="col-span-2">John Doe</div>
                    <div>Developer</div>
                    <div>4</div>
                    <div>12</div>
                    <div className="text-right font-mono">38h 15m</div>
                  </div>
                  <div className="grid grid-cols-6 p-3 text-sm">
                    <div className="col-span-2">Jane Smith</div>
                    <div>Designer</div>
                    <div>3</div>
                    <div>8</div>
                    <div className="text-right font-mono">32h 40m</div>
                  </div>
                  <div className="grid grid-cols-6 p-3 text-sm">
                    <div className="col-span-2">Mike Johnson</div>
                    <div>Project Manager</div>
                    <div>6</div>
                    <div>15</div>
                    <div className="text-right font-mono">36h 50m</div>
                  </div>
                  <div className="grid grid-cols-6 p-3 text-sm">
                    <div className="col-span-2">Sarah Williams</div>
                    <div>Marketing</div>
                    <div>2</div>
                    <div>6</div>
                    <div className="text-right font-mono">28h 20m</div>
                  </div>
                  <div className="grid grid-cols-6 p-3 text-sm">
                    <div className="col-span-2">David Brown</div>
                    <div>Developer</div>
                    <div>3</div>
                    <div>10</div>
                    <div className="text-right font-mono">36h 45m</div>
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

export default Reports;
