import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, User, Lock, Droplets, AlertCircle, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useLoginMutation } from '@/services/authApi';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import raghwaLogo from '/public/logo.jpeg';

// Enhanced floating bubbles with different types
const FloatingBubbles = () => {
  const bubbles = Array.from({ length: 25 }, (_, i) => ({
    id: i,
    size: Math.random() * 100 + 20,
    left: Math.random() * 100,
    top: Math.random() * 100,
    delay: Math.random() * 10,
    duration: Math.random() * 8 + 6,
    type: Math.random() > 0.5 ? 'bubble' : 'foam',
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {bubbles.map((bubble) => (
        <div
          key={bubble.id}
          className={`absolute rounded-full ${
            bubble.type === 'foam' 
              ? 'bg-white/30 border border-white/20' 
              : 'bg-blue-200/40'
          } animate-bubble-float opacity-60`}
          style={{
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            left: `${bubble.left}%`,
            top: `${bubble.top}%`,
            animationDelay: `${bubble.delay}s`,
            animationDuration: `${bubble.duration}s`,
            filter: bubble.type === 'foam' ? 'blur(0.5px)' : 'none'
          }}
        />
      ))}
    </div>
  );
};

// Animated soap droplets
const SoapDroplets = () => {
  const droplets = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 5,
    duration: Math.random() * 3 + 2,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {droplets.map((droplet) => (
        <Droplets
          key={droplet.id}
          className="absolute text-blue-300/40 animate-bounce"
          style={{
            left: `${droplet.left}%`,
            top: '-20px',
            animationDelay: `${droplet.delay}s`,
            animationDuration: `${droplet.duration}s`,
          }}
          size={Math.random() * 20 + 15}
        />
      ))}
    </div>
  );
};

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [shake, setShake] = useState(false);
  const [hasShownSuccessToast, setHasShownSuccessToast] = useState(false);

  // استخدام طلب تسجيل الدخول من الخادم
  const [login, { isLoading, error, isSuccess, data }] = useLoginMutation();
  const { toast } = useToast();
  const { login: authLogin } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // إعادة تعيين متغير toast عند بدء تسجيل دخول جديد
    setHasShownSuccessToast(false);
    
    if (!username.trim() || !password.trim()) {
      setShake(true);
      setTimeout(() => setShake(false), 600);
      toast({
        title: "حقول فارغة",
        description: "يرجى إدخال رقم الهاتف وكلمة المرور",
        variant: "destructive"
      });
      return;
    }

    try {
      await login({ 
        phoneNumber: username,
        password: password 
      }).unwrap();
    } catch (err) {
      setShake(true);
      setTimeout(() => setShake(false), 600);
      
      // عرض رسالة الخطأ المناسبة
      if (err?.data?.message) {
        toast({
          title: "خطأ في تسجيل الدخول",
          description: err.data.message,
          variant: "destructive"
        });
      } else if (err?.status === 'FETCH_ERROR') {
        toast({
          title: "خطأ في الاتصال",
          description: "خطأ في الاتصال بالخادم. تأكد من تشغيل الخادم",
          variant: "destructive"
        });
      } else {
        toast({
          title: "خطأ في تسجيل الدخول",
          description: "حدث خطأ في تسجيل الدخول",
          variant: "destructive"
        });
      }
    }
  };

  // إعادة تعيين toast عند تغيير بيانات تسجيل الدخول
  useEffect(() => {
    setHasShownSuccessToast(false);
  }, [username, password]);

  // معالجة نجاح تسجيل الدخول
  useEffect(() => {
    if (isSuccess && data && !hasShownSuccessToast) {
      if (data.token) {
        authLogin(data.token, data.data?.user);
        
        setHasShownSuccessToast(true);
        toast({
          title: "تم تسجيل الدخول",
          description: "تم تسجيل الدخول بنجاح!",
          variant: "default"
        });
        
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
      }
    }
  }, [isSuccess, data, navigate, authLogin, toast, hasShownSuccessToast]);

  // Parallax effect for background
  useEffect(() => {
    const handleMouseMove = (e) => {
      const moveX = (e.clientX * -1) / 100;
      const moveY = (e.clientY * -1) / 100;
      const bg = document.querySelector('.parallax-bg');
      if (bg) {
        bg.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
      {/* Background image with overlay */}
      <div 
        className="parallax-bg absolute inset-0 scale-110 transition-transform duration-100 ease-out"
        style={{
          backgroundImage: 'url(/bg.jpeg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      
      {/* Blue overlay for brand consistency */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/70 via-blue-500/60 to-blue-700/80" />
      
      {/* Animated elements */}
      <FloatingBubbles />
      <SoapDroplets />
      
      {/* Main login container */}
      <div className={`w-full max-w-md mx-auto animate-scale-in relative z-10 ${shake ? 'animate-pulse' : ''}`}>
        {/* Login card with enhanced glassmorphism */}
        <Card className="bg-white/15 backdrop-blur-xl border border-white/25 rounded-3xl p-8 shadow-2xl transform transition-all duration-300 hover:scale-105 hover:bg-white/20">
          {/* Logo section */}
          <div className="text-center mb-8">
            {/* Company Logo */}
            <div className="mb-6">
              <img 
                src={raghwaLogo}
                alt="رغوة - خبراء العناية ب الكافية" 
                className="w-56 h-auto mx-auto filter drop-shadow-xl"
              />
            </div>
            
            {/* Login Header */}
            <h2 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">
              تسجيل الدخول
            </h2>
            <p className="text-white/80 text-sm mb-4">
              مرحباً بك في نظام الإدارة المتكامل
            </p>
          </div>

          {/* Login form with enhanced interactions */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Phone number field with floating label effect */}
            <div className="relative group">
              <Phone className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 transition-colors group-focus-within:text-blue-500" />
              <Input
                type="tel"
                placeholder="رقم الهاتف"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full h-14 pr-12 pl-4 bg-white/90 backdrop-blur-sm border-0 rounded-2xl text-gray-700 placeholder:text-gray-500 focus:ring-2 focus:ring-blue-400 focus:bg-white transition-all duration-300 transform focus:scale-105"
              />
            </div>

            {/* Password field with enhanced security visual */}
            <div className="relative group">
              <Lock className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 transition-colors group-focus-within:text-blue-500" />
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="كلمة المرور"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-14 pr-12 pl-12 bg-white/90 backdrop-blur-sm border-0 rounded-2xl text-gray-700 placeholder:text-gray-500 focus:ring-2 focus:ring-blue-400 focus:bg-white transition-all duration-300 transform focus:scale-105"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-all duration-200 hover:scale-110"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Enhanced login button with ripple effect */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl relative overflow-hidden group mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  جاري تسجيل الدخول...
                </div>
              ) : (
                <span className="relative z-10">دخول</span>
              )}
            </Button>

            {/* Enhanced forgot password link */}
            <div className="text-center mt-6">
              <button
                type="button"
                className="text-white/90 hover:text-white transition-all duration-200 text-sm font-medium hover:underline transform hover:scale-105"
              >
                نسيت كلمة المرور؟
              </button>
            </div>
          </form>
        </Card>

        {/* Enhanced footer */}
        <div className="text-center mt-8">
          <p className="text-xs text-white/80 drop-shadow-sm">
            © جميع الحقوق محفوظة رغوة 2025.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;