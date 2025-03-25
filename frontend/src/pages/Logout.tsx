
import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

const Logout = () => {
  const { toast } = useToast();
  
  useEffect(() => {
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account.",
    });
  }, [toast]);
  
  return <Navigate to="/" replace />;
};

export default Logout;
