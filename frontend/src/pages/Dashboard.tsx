
import { Link } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import TimerCard from '@/components/TimerCard';
import TimeEntryList from '@/components/TimeEntryList';
import StatCard from '@/components/StatCard';
import { Clock, Calendar, Layers, Zap } from 'lucide-react';

const Dashboard = () => {
  return (
    <DashboardLayout title="Dashboard">
      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard 
          title="Today" 
          value="3h 24m" 
          icon={Clock} 
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard 
          title="This Week" 
          value="18h 40m" 
          icon={Calendar}
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard 
          title="Projects" 
          value="7" 
          icon={Layers}
        />
        <StatCard 
          title="Productivity" 
          value="84%" 
          icon={Zap}
          trend={{ value: 3, isPositive: true }}
        />
      </div>
      
      {/* Timer */}
      <div className="mb-8">
        <TimerCard />
      </div>
      
      {/* Recent Entries */}
      <TimeEntryList />
    </DashboardLayout>
  );
};

export default Dashboard;
