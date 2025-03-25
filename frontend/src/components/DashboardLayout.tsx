import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Clock, 
  BarChart2, 
  Calendar, 
  User, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  BellRing, 
  Zap, 
  Layers,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
}

const DashboardLayout = ({ children, title }: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [profileData, setProfileData] = useState<{name?: string, avatar_url?: string} | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, signOut } = useAuth();
  
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('name, avatar_url')
          .eq('id', user.id)
          .single();
          
        if (error) throw error;
        
        setProfileData(data);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };
    
    fetchProfileData();
    
    // Set up subscription to profile changes
    const channel = supabase
      .channel('profile_updates')
      .on('postgres_changes', 
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'profiles',
          filter: `id=eq.${user?.id}`
        }, 
        () => {
          fetchProfileData();
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleNotifications = () => {
    setNotificationsOpen(!notificationsOpen);
  };

  const toggleProfile = () => {
    setProfileOpen(!profileOpen);
  };

  const handleLogout = async () => {
    await signOut();
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account.",
    });
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;
  
  const getUserInitials = () => {
    if (!user) return '?';
    
    if (profileData?.name) {
      const names = profileData.name.split(' ');
      if (names.length >= 2) {
        return `${names[0][0]}${names[1][0]}`.toUpperCase();
      }
      return names[0][0].toUpperCase();
    }
    
    // Use email if name is not available
    return user.email ? user.email[0].toUpperCase() : '?';
  };

  return (
    <div className="min-h-screen flex bg-secondary/30">
      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 z-50 flex flex-col w-64 bg-white border-r border-border/40 transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-border/40">
          <Link to="/" className="flex items-center space-x-2">
            <Clock className="h-6 w-6 text-primary" />
            <span className="text-lg font-semibold">TimeTrack</span>
          </Link>
          <button
            className="p-1.5 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 md:hidden"
            onClick={toggleSidebar}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <nav className="flex-1 pt-4 px-2 space-y-1 overflow-y-auto">
          <Link 
            to="/dashboard" 
            className={`flex items-center px-3 py-2.5 rounded-lg ${isActive('/dashboard') ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-muted transition-colors'}`}
          >
            <Layers className="h-5 w-5 mr-3" />
            Dashboard
          </Link>
          <Link 
            to="/timer" 
            className={`flex items-center px-3 py-2.5 rounded-lg ${isActive('/timer') ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-muted transition-colors'}`}
          >
            <Clock className="h-5 w-5 mr-3" />
            Timer
          </Link>
          <Link 
            to="/reports" 
            className={`flex items-center px-3 py-2.5 rounded-lg ${isActive('/reports') ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-muted transition-colors'}`}
          >
            <BarChart2 className="h-5 w-5 mr-3" />
            Reports
          </Link>
          <Link 
            to="/calendar" 
            className={`flex items-center px-3 py-2.5 rounded-lg ${isActive('/calendar') ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-muted transition-colors'}`}
          >
            <Calendar className="h-5 w-5 mr-3" />
            Calendar
          </Link>
          <div className="px-3 pt-3 pb-1">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
              Settings
            </div>
          </div>
          <Link 
            to="/profile" 
            className={`flex items-center px-3 py-2.5 rounded-lg ${isActive('/profile') ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-muted transition-colors'}`}
          >
            <User className="h-5 w-5 mr-3" />
            Profile
          </Link>
          <Link 
            to="/settings" 
            className={`flex items-center px-3 py-2.5 rounded-lg ${isActive('/settings') ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-muted transition-colors'}`}
          >
            <Settings className="h-5 w-5 mr-3" />
            Settings
          </Link>
        </nav>
        
        <div className="p-4 border-t border-border/40">
          <Button 
            variant="outline" 
            className="w-full justify-start text-muted-foreground"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Log out
          </Button>
        </div>
      </aside>
      
      {/* Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
      
      {/* Main content */}
      <div className="flex-1 flex flex-col md:ml-64">
        {/* Top navigation */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border/40 bg-white/90 backdrop-blur-sm px-4">
          <button
            className="p-1.5 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 md:hidden"
            onClick={toggleSidebar}
          >
            <Menu className="h-5 w-5" />
          </button>
          
          <div className="flex-1 flex items-center justify-end space-x-4">
            <Dialog>
              <DialogTrigger asChild>
                <button
                  className="p-1.5 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 relative"
                  aria-label="Notifications"
                >
                  <BellRing className="h-5 w-5" />
                  <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-primary"></span>
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Notifications</DialogTitle>
                  <DialogDescription>
                    Your recent notifications and alerts
                  </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col space-y-4 max-h-[60vh] overflow-y-auto py-4">
                  <div className="flex items-start space-x-4 p-4 rounded-lg bg-muted/50">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Zap className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">Project deadline approaching</p>
                      <p className="text-muted-foreground text-sm mt-1">Marketing Campaign is due in 2 days</p>
                      <p className="text-xs text-muted-foreground mt-2">10 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4 p-4 rounded-lg bg-muted/50">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">Team meeting reminder</p>
                      <p className="text-muted-foreground text-sm mt-1">Weekly team meeting starts in 30 minutes</p>
                      <p className="text-xs text-muted-foreground mt-2">1 hour ago</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4 p-4 rounded-lg bg-muted/50">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">Timer completed</p>
                      <p className="text-muted-foreground text-sm mt-1">You've tracked 3h 24m today</p>
                      <p className="text-xs text-muted-foreground mt-2">2 hours ago</p>
                    </div>
                  </div>
                </div>
                <DialogFooter className="sm:justify-start">
                  <Button variant="outline" className="w-full">View all notifications</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            <Dialog>
              <DialogTrigger asChild>
                <button className="flex items-center rounded-full">
                  <span className="sr-only">User menu</span>
                  <Avatar>
                    <AvatarImage src={profileData?.avatar_url || ''} alt={profileData?.name || 'User'} />
                    <AvatarFallback>{getUserInitials()}</AvatarFallback>
                  </Avatar>
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[300px]">
                <DialogHeader>
                  <DialogTitle>Account</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col space-y-2 pt-2">
                  <Link to="/profile">
                    <Button variant="ghost" className="w-full justify-start">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Button>
                  </Link>
                  <Link to="/settings">
                    <Button variant="ghost" className="w-full justify-start">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Button>
                  </Link>
                  <Button variant="ghost" className="w-full justify-start text-destructive" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </header>
        
        {/* Dashboard content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
              <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
              {title === "Dashboard" && (
                <div className="mt-3 sm:mt-0">
                  <Link to="/new-project">
                    <Button className="btn-hover flex">
                      <Plus className="mr-1.5 h-4 w-4" />
                      New Project
                    </Button>
                  </Link>
                </div>
              )}
            </div>
            
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
