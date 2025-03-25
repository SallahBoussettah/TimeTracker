
import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';

const Logout = () => {
  const { toast } = useToast();
  const { signOut, isLoading } = useAuth();
  
  useEffect(() => {
    signOut();
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account.",
    });
  }, [signOut, toast]);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return <Navigate to="/" replace />;
};

export default Logout;
