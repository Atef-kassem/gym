import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const LogoutButton = ({ className = '', variant = 'outline' }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    logout();
    toast.success('تم تسجيل الخروج بنجاح');
    navigate('/login');
  };

  return (
    <Button
      onClick={handleLogout}
      variant={variant}
      className={`gap-2 ${className}`}
    >
      <LogOut className="w-4 h-4" />
      تسجيل الخروج
    </Button>
  );
};

export default LogoutButton;
